import { useEffect, useState } from "react";
import { Search, MapPin, ChevronDown, X, Filter } from "lucide-react";

import DecorativeBackground from "../../components/DecorativeBackground/DecorativeBackground";
import ItemDetailsModal from "../../components/ItemDetailsModal";

import { getCategoryIcon } from "../../utils/categoryIcons";
import { useItems } from "../../hooks/useItems";
import { useAttributes } from "../../hooks/useAttributes";

// Backend values:
// type   = LOST | FOUND
// status = OPEN | RESOLVED
const ITEM_TYPES = [
  { label: "All Items", value: "all" },
  { label: "Lost Items", value: "LOST" },
  { label: "Found Items", value: "FOUND" },
  { label: "Resolved", value: "RESOLVED" },
];

const ITEMS_PER_PAGE = 9;

function formatDate(isoDate) {
  if (!isoDate) return "";

  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const ItemList = () => {
  // ============================================================
  // SEARCH
  // ============================================================

  // What the user is currently typing.
  const [searchQuery, setSearchQuery] = useState("");

  // Search value actually sent to the backend.
  const [activeSearch, setActiveSearch] = useState("");

  // ============================================================
  // PAGINATION
  // ============================================================

  const [currentPage, setCurrentPage] = useState(1);

  // ============================================================
  // PENDING FILTERS
  // ============================================================
  // These are changed in the sidebar but are NOT sent to the
  // backend until "Apply Filters" is clicked.

  const [pendingType, setPendingType] = useState("all");
  const [pendingCategories, setPendingCategories] = useState([]);
  const [pendingColors, setPendingColors] = useState([]);
  const [pendingDateFrom, setPendingDateFrom] = useState("");
  const [pendingDateTo, setPendingDateTo] = useState("");

  // ============================================================
  // APPLIED FILTERS
  // ============================================================
  // These are the filters actually sent to GET /items.

  const [appliedType, setAppliedType] = useState("all");
  const [appliedCategories, setAppliedCategories] = useState([]);
  const [appliedColors, setAppliedColors] = useState([]);
  const [appliedDateFrom, setAppliedDateFrom] = useState("");
  const [appliedDateTo, setAppliedDateTo] = useState("");

  // ============================================================
  // UI STATE
  // ============================================================

  const [selectedItem, setSelectedItem] = useState(null);
  const [isColorsExpanded, setIsColorsExpanded] = useState(true);

  // Mobile only: whether the filter sidebar panel is open (on lg+ the
  // sidebar is always visible as the left column, so this state is
  // ignored there).
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // ============================================================
  // ATTRIBUTES
  // ============================================================
  //
  // useAttributes() loads:
  //
  // GET /categories
  // GET /colors
  //
  // through TanStack Query.

  const { categories, colors } = useAttributes();

  // ============================================================
  // BUILD API QUERY
  // ============================================================
  //
  // These parameters are sent to:
  //
  // GET /items
  //
  // Example:
  //
  // /items?search=wallet&type=LOST&page=1&limit=9

  const queryParams = {
    // ----------------------------------------------------------
    // Search
    // ----------------------------------------------------------

    ...(activeSearch && {
      search: activeSearch,
    }),

    // ----------------------------------------------------------
    // Type
    // ----------------------------------------------------------
    //
    // "all"       -> don't send type
    // "LOST"      -> type=LOST
    // "FOUND"     -> type=FOUND
    // "RESOLVED"  -> handled through status below

    ...(appliedType !== "all" &&
      appliedType !== "RESOLVED" && {
        type: appliedType,
      }),

    // ----------------------------------------------------------
    // Status
    // ----------------------------------------------------------

    ...(appliedType === "RESOLVED" && {
      status: "RESOLVED",
    }),

    // ----------------------------------------------------------
    // Category
    // ----------------------------------------------------------
    //
    // Current backend accepts ONE category.
    //
    // Therefore if the user selects:
    //
    // ["Electronics", "Bags"]
    //
    // only "Electronics" is currently sent.

    ...(appliedCategories.length > 0 && {
      category: appliedCategories[0],
    }),

    // ----------------------------------------------------------
    // Color
    // ----------------------------------------------------------
    //
    // Current backend accepts ONE color.
    //
    // Therefore only the first selected color is sent.

    ...(appliedColors.length > 0 && {
      color: appliedColors[0],
    }),

    // ----------------------------------------------------------
    // Date range
    // ----------------------------------------------------------

    ...(appliedDateFrom && {
      fromDate: appliedDateFrom,
    }),

    ...(appliedDateTo && {
      toDate: appliedDateTo,
    }),

    // ----------------------------------------------------------
    // Pagination
    // ----------------------------------------------------------

    page: currentPage,
    limit: ITEMS_PER_PAGE,
  };

  // ============================================================
  // TANSTACK QUERY
  // ============================================================

  const { data, isLoading, isError, error } = useItems(queryParams);

  // ============================================================
  // BACKEND RESPONSE
  // ============================================================
  //
  // {
  //   data: [...],
  //   pagination: {
  //     page,
  //     limit,
  //     total,
  //     totalPages
  //   }
  // }

  const items = data?.data ?? [];
  const pagination = data?.pagination;

  const totalItems = pagination?.total ?? 0;
  const totalPages = pagination?.totalPages ?? 0;

  // ============================================================
  // RESET PAGE WHEN FILTERS CHANGE
  // ============================================================
  //
  // Example:
  //
  // User is on page 4.
  // User searches "wallet".
  //
  // We need to return to page 1.

  useEffect(() => {
    setCurrentPage(1);
  }, [
    activeSearch,
    appliedType,
    appliedCategories,
    appliedColors,
    appliedDateFrom,
    appliedDateTo,
  ]);

  // ============================================================
  // CATEGORY TOGGLE
  // ============================================================

  const toggleCategory = (name) => {
    setPendingCategories((previousCategories) =>
      previousCategories.includes(name)
        ? previousCategories.filter((category) => category !== name)
        : [...previousCategories, name],
    );
  };

  // ============================================================
  // COLOR TOGGLE
  // ============================================================

  const toggleColor = (name) => {
    setPendingColors((previousColors) =>
      previousColors.includes(name)
        ? previousColors.filter((color) => color !== name)
        : [...previousColors, name],
    );
  };

  // ============================================================
  // APPLY FILTERS
  // ============================================================

  const handleApplyFilters = () => {
    setAppliedType(pendingType);
    setAppliedCategories(pendingCategories);
    setAppliedColors(pendingColors);
    setAppliedDateFrom(pendingDateFrom);
    setAppliedDateTo(pendingDateTo);

    // Start from first page after applying filters.
    setCurrentPage(1);

    // Close the collapsible panel on mobile so results are visible.
    setIsFiltersOpen(false);
  };

  // ============================================================
  // CANCEL FILTER CHANGES
  // ============================================================

  const handleCancel = () => {
    setPendingType(appliedType);
    setPendingCategories(appliedCategories);
    setPendingColors(appliedColors);
    setPendingDateFrom(appliedDateFrom);
    setPendingDateTo(appliedDateTo);

    // Close the collapsible panel on mobile.
    setIsFiltersOpen(false);
  };

  // ============================================================
  // CLEAR ALL
  // ============================================================

  const handleClearAll = () => {
    // Pending filters
    setPendingType("all");
    setPendingCategories([]);
    setPendingColors([]);
    setPendingDateFrom("");
    setPendingDateTo("");

    // Applied filters
    setAppliedType("all");
    setAppliedCategories([]);
    setAppliedColors([]);
    setAppliedDateFrom("");
    setAppliedDateTo("");

    // Search
    setSearchQuery("");
    setActiveSearch("");

    // Pagination
    setCurrentPage(1);
  };

  // ============================================================
  // SEARCH
  // ============================================================

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    setActiveSearch(searchQuery.trim());
    setCurrentPage(1);
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="relative w-full">
      <DecorativeBackground variant="itemList" />

      <div className="relative z-10">
        {/* ======================================================
            HERO
        ====================================================== */}

        <section className="max-w-[1280px] mx-auto px-10 py-10 sm:py-14 lg:py-16">
          <div className="grid grid-cols-1 gap-8 items-center md:grid-cols-2 md:gap-10">
            <div>
              <p className="text-body-md font-semibold text-text-primary tracking-wide sm:text-body-lg">
                LOST &amp; FOUND COMMUNITY
              </p>

              <h1 className="text-[22px] leading-[1.25] font-bold text-primary-dark mt-2 sm:text-[32px] md:text-[40px] lg:text-display-lg">
                Find what
                <br className="hidden sm:inline" /> you're looking for.
              </h1>

              <p className="text-body-md text-text-secondary mt-4 max-w-md sm:text-body-lg">
                Browse recently reported lost and found items. Search, filter,
                and discover a possible match in just a few clicks.
              </p>
            </div>

            {/* Illustration */}

            <div className="w-full h-auto rounded-xl flex items-center justify-center text-text-secondary text-body-sm md:h-80">
              <img
                src="https://res.cloudinary.com/d5tnusci/image/upload/v1789924308/itemlists_f7kjjr.png"
                alt=""
                className="w-full max-w-[320px] h-auto sm:max-w-[460px] lg:max-w-none lg:w-300"
              />
            </div>
          </div>

          {/* ====================================================
              SEARCH
          ==================================================== */}

          <form
            onSubmit={handleSearchSubmit}
            className="flex justify-center gap-3 mt-8 sm:gap-4 sm:mt-10"
          >
            <div className="relative w-full max-w-xl">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search for items eg. wallets, backpacks..."
                className="w-full border border-border rounded-lg pl-11 pr-10 py-3 text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
              />

              {activeSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveSearch("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* On phones the button is hidden to keep the search bar
                full-width (press Enter to search); it reappears from the
                sm breakpoint up. */}
            <button
              type="submit"
              className="hidden sm:inline-flex bg-primary hover:bg-primary-dark text-text-inverse rounded-lg px-8 py-3 text-body-md font-medium transition-colors"
            >
              Search
            </button>
          </form>
        </section>

        {/* ======================================================
            FILTERS + RESULTS
        ====================================================== */}

        <section className="max-w-[1280px] mx-auto px-10 pb-12 lg:pb-16">
          <div className="grid grid-cols-1 gap-6 items-start lg:grid-cols-[280px_1fr] lg:gap-10">
            {/* ==================================================
                FILTER SIDEBAR
                Collapsed by default on mobile (toggled by the
                "Filters" button next to the results count) and always
                visible on lg+ where it sits as a left column.
            ================================================== */}

            <div
              className={`${
                isFiltersOpen ? "block" : "hidden"
              } lg:block border border-border rounded-lg p-5 sm:p-6`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-heading-3 font-bold text-text-primary">
                  Filters
                </h2>

                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-body-sm text-text-secondary hover:text-primary"
                >
                  Clear All
                </button>
              </div>

              {/* =================================================
                  ITEM TYPES
              ================================================= */}

              <div className="mt-6">
                <h3 className="bg-background-subtle px-3 py-2 rounded text-label-md font-medium text-text-primary">
                  Item Types
                </h3>

                <div className="flex flex-col gap-3 mt-3 px-1">
                  {ITEM_TYPES.map((type) => (
                    <label
                      key={type.value}
                      className="flex items-center gap-2 text-body-md text-text-primary cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="itemType"
                        checked={pendingType === type.value}
                        onChange={() => setPendingType(type.value)}
                        className="accent-primary"
                      />

                      {type.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* =================================================
                  CATEGORY
              ================================================= */}

              <div className="mt-6">
                <h3 className="bg-background-subtle px-3 py-2 rounded text-label-md font-medium text-text-primary">
                  Category
                </h3>

                <div className="flex flex-col gap-3 mt-3 px-1">
                  {categories.map((category) => {
                    const Icon = getCategoryIcon(category.icon);

                    return (
                      <label
                        key={category.id}
                        className="flex items-center gap-2 text-body-md text-text-primary cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={pendingCategories.includes(category.name)}
                          onChange={() => toggleCategory(category.name)}
                          className="accent-primary"
                        />

                        <Icon size={16} className="text-text-secondary" />

                        {category.name}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* =================================================
                  COLOR
              ================================================= */}

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setIsColorsExpanded((value) => !value)}
                  className="w-full flex items-center justify-between bg-background-subtle px-3 py-2 rounded text-label-md font-medium text-text-primary"
                >
                  Color
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      isColorsExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isColorsExpanded && (
                  <div className="flex flex-wrap gap-2 mt-3 px-1">
                    {colors.map((color) => {
                      const isOther = color.name.toLowerCase() === "other";

                      return (
                        <button
                          key={color.id}
                          type="button"
                          title={color.name}
                          onClick={() => toggleColor(color.name)}
                          className={`w-7 h-7 rounded-full border-2 transition-all ${
                            pendingColors.includes(color.name)
                              ? "border-primary scale-110 ring-2 ring-primary/20"
                              : "border-border hover:border-text-secondary"
                          }`}
                          style={{
                            background: isOther
                              ? "conic-gradient(from 180deg, #ef4444, #f97316, #eab308, #10b981, #3b82f6, #8b5cf6, #ef4444)"
                              : color.hexCode,
                          }}
                        />
                      );
                    })}
                  </div>
                )}
              </div>

              {/* =================================================
                  DATE
              ================================================= */}

              <div className="mt-6">
                <h3 className="bg-background-subtle px-3 py-2 rounded text-label-md font-medium text-text-primary">
                  Date Lost / Found
                </h3>

                <div className="px-1 mt-3">
                  <label className="text-body-sm text-text-secondary">
                    From
                  </label>

                  <div className="relative mt-1">
                    <input
                      type="date"
                      value={pendingDateFrom}
                      onChange={(event) =>
                        setPendingDateFrom(event.target.value)
                      }
                      className="w-full border border-border rounded-lg px-3 py-2 text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <label className="text-body-sm text-text-secondary mt-3 block">
                    To
                  </label>

                  <div className="relative mt-1">
                    <input
                      type="date"
                      value={pendingDateTo}
                      onChange={(event) => setPendingDateTo(event.target.value)}
                      className="w-full border border-border rounded-lg px-3 py-2 text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* =================================================
                  APPLY
              ================================================= */}

              <button
                type="button"
                onClick={handleApplyFilters}
                className="w-full bg-primary hover:bg-primary-dark text-text-inverse rounded-lg py-2.5 text-body-md font-medium mt-6 transition-colors"
              >
                Apply Filters
              </button>

              {/* =================================================
                  CANCEL
              ================================================= */}

              <button
                type="button"
                onClick={handleCancel}
                className="w-full border border-border rounded-lg py-2.5 text-body-md text-text-primary hover:bg-background-subtle mt-3 transition-colors"
              >
                Cancel
              </button>
            </div>

            {/* ==================================================
                RESULTS
            ================================================== */}

            <div>
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-heading-3 font-bold text-primary-dark sm:text-heading-2">
                  {isLoading ? "Loading..." : `${totalItems} items found`}
                </h2>

                {/* ==========================================
                    FILTERS TOGGLE (mobile only)
                    Opens the collapsible filter panel above.
                =========================================== */}

                <button
                  type="button"
                  onClick={() => setIsFiltersOpen((open) => !open)}
                  aria-expanded={isFiltersOpen}
                  className="lg:hidden inline-flex items-center gap-2 border border-border rounded-lg px-4 py-2 text-body-md text-text-primary hover:bg-background-subtle transition-colors"
                >
                  <Filter size={16} className="text-primary" />
                  Filters
                </button>
              </div>

              {/* =================================================
                  ERROR
              ================================================= */}

              {isError && (
                <p className="text-error text-body-md mt-4">
                  Error:{" "}
                  {error?.response?.data?.message ||
                    error?.message ||
                    "Failed to load items."}
                </p>
              )}

              {/* =================================================
                  EMPTY
              ================================================= */}

              {!isLoading && !isError && items.length === 0 && (
                <p className="text-body-md text-text-secondary mt-8">
                  No items match your filters. Try adjusting or clearing them.
                </p>
              )}

              {/* =================================================
                  ITEM GRID
              ================================================= */}

              {!isLoading && !isError && items.length > 0 && (
                <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="border border-border rounded-lg overflow-hidden"
                    >
                      {/* ========================================
                            IMAGE
                        ======================================== */}
                      <div className="pt-4 px-4 rounded-lg">
                        {item.images?.length > 0 ? (
                          <img
                            src={item.images[0].imageUrl}
                            alt={item.title}
                            className="w-full h-40 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-40 bg-neutral-100 flex items-center justify-center text-text-secondary text-body-sm rounded-lg">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        {/* ======================================
                              LOST / FOUND
                          ====================================== */}

                        <span
                          className={`inline-block px-2 py-0.5 rounded text-label-sm font-medium ${
                            item.type === "LOST"
                              ? "bg-error/10 text-error"
                              : "bg-success/10 text-success"
                          }`}
                        >
                          {item.type === "LOST" ? "Lost" : "Found"}
                        </span>

                        {/* ======================================
                              TITLE
                          ====================================== */}

                        <h3 className="text-heading-3 font-bold text-text-primary mt-2 truncate">
                          {item.title}
                        </h3>

                        {/* ======================================
                              LOCATION
                          ====================================== */}

                        <div className="flex items-center gap-1 text-body-sm text-text-secondary mt-1">
                          <MapPin size={14} />

                          {item.location}
                        </div>

                        {/* ======================================
                              DATE + STATUS
                          ====================================== */}

                        <p className="text-body-sm text-text-secondary mt-1">
                          {formatDate(item.dateLostOrFound)} ·{" "}
                          {item.status === "RESOLVED"
                            ? "Resolved"
                            : "Searching"}
                        </p>

                        {/* ======================================
                              CATEGORY
                          ====================================== */}

                        <p className="text-body-sm text-text-secondary mt-1">
                          {item.category?.name}
                        </p>

                        {/* ======================================
                              MORE DETAILS
                          ====================================== */}

                        <button
                          type="button"
                          onClick={() => setSelectedItem(item)}
                          className="mt-3 inline-flex items-center justify-center border border-border rounded-lg px-4 py-2 text-body-md text-text-primary hover:bg-primary hover:text-text-inverse hover:border-primary transition-colors"
                        >
                          More Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ==================================================
                  PAGINATION
              ================================================== */}

              {totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
                  {/* Previous */}

                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((page) => page - 1)}
                    className="border border-border rounded-lg px-3 py-2 text-body-sm text-text-primary hover:bg-background-subtle disabled:opacity-40 disabled:cursor-not-allowed transition-colors sm:px-4 sm:text-body-md"
                  >
                    Previous
                  </button>

                  {/* Page numbers */}

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-lg text-body-sm font-medium transition-colors sm:w-10 sm:h-10 sm:text-body-md ${
                        currentPage === page
                          ? "bg-primary text-text-inverse"
                          : "border border-border text-text-primary hover:bg-background-subtle"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {/* Next */}

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((page) => page + 1)}
                    className="border border-border rounded-lg px-3 py-2 text-body-sm text-text-primary hover:bg-background-subtle disabled:opacity-40 disabled:cursor-not-allowed transition-colors sm:px-4 sm:text-body-md"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* ========================================================
          DETAILS MODAL
      ======================================================== */}

      {selectedItem && (
        <ItemDetailsModal
          itemId={selectedItem.id}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};

export default ItemList;
