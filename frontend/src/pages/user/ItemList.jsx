import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Search,
  MapPin,
  ChevronDown,
  Smartphone,
  ShoppingBag,
  Shirt,
  Watch,
  Key,
  FileText,
  MoreHorizontal,
  Calendar,
  X,
} from "lucide-react";
import { getItems } from "../../services/api";
import DecorativeBackground from "../../components/DecorativeBackground/DecorativeBackground";

// Item type radio options — single select.
const ITEM_TYPES = [
  { label: "All Items", value: "all" },
  { label: "Lost Items", value: "lost" },
  { label: "Found Items", value: "found" },
  { label: "Resolved", value: "resolved" },
];

// Category checkboxes — multi-select, each paired with a lucide icon.
const CATEGORIES = [
  { label: "Electronics", icon: Smartphone },
  { label: "Bags", icon: ShoppingBag },
  { label: "Clothing", icon: Shirt },
  { label: "Accessories", icon: Watch },
  { label: "Keys", icon: Key },
  { label: "Documents", icon: FileText },
  { label: "Other", icon: MoreHorizontal },
];

// Color swatches — multi-select. Hex values are just for the visual dot;
// filtering matches against the "name", which must match each item's
// "color" field in db.json exactly.
const COLORS = [
  { name: "Black", hex: "#1F2933" },
  { name: "Brown", hex: "#8B5E3C" },
  { name: "Grey", hex: "#9CA3AF" },
  { name: "Silver", hex: "#C0C0C0" },
  { name: "Blue", hex: "#2F80ED" },
  { name: "Red", hex: "#EB5757" },
];

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const ItemList = () => {
  // All items fetched once from json-server; filtering happens entirely
  // in JavaScript against this array (same approach used elsewhere in
  // the app, since json-server's own query filtering wasn't reliable).
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  // The search bar's own text, applied immediately (not staged like the
  // sidebar filters below) — typing and hitting Search/Enter updates
  // results right away.
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  // ===== STAGED FILTERS =====
  // The sidebar uses a "stage, then Apply" pattern, matching the
  // wireframe's "Applied Filters" / "Cancel" buttons: changing a
  // checkbox/radio/date only updates the PENDING state below. Nothing
  // actually filters the results until "Applied Filters" is clicked,
  // which copies pending -> applied. "Cancel" discards pending changes
  // by resetting it back to whatever's currently applied.
  const [pendingType, setPendingType] = useState("all");
  const [pendingCategories, setPendingCategories] = useState([]);
  const [pendingColors, setPendingColors] = useState([]);
  const [pendingDateFrom, setPendingDateFrom] = useState("");
  const [pendingDateTo, setPendingDateTo] = useState("");

  const [appliedType, setAppliedType] = useState("all");
  const [appliedCategories, setAppliedCategories] = useState([]);
  const [appliedColors, setAppliedColors] = useState([]);
  const [appliedDateFrom, setAppliedDateFrom] = useState("");
  const [appliedDateTo, setAppliedDateTo] = useState("");

  const [isColorsExpanded, setIsColorsExpanded] = useState(true);

  useEffect(() => {
    getItems()
      .then((data) => setAllItems(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

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

  // Toggles one category in/out of the PENDING selection (multi-select).
  const toggleCategory = (label) => {
    setPendingCategories((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label],
    );
  };

  // Toggles one color in/out of the PENDING selection (multi-select).
  const toggleColor = (name) => {
    setPendingColors((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name],
    );
  };

  // "Applied Filters" button: commits every pending value to applied,
  // which is what the actual filtering logic below reads from.
  const handleApplyFilters = () => {
    setAppliedType(pendingType);
    setAppliedCategories(pendingCategories);
    setAppliedColors(pendingColors);
    setAppliedDateFrom(pendingDateFrom);
    setAppliedDateTo(pendingDateTo);
  };

  // "Cancel" button: discards any unsaved pending changes by resetting
  // pending back to whatever's currently applied (not to empty/defaults —
  // that's what "Clear All" is for).
  const handleCancel = () => {
    setPendingType(appliedType);
    setPendingCategories(appliedCategories);
    setPendingColors(appliedColors);
    setPendingDateFrom(appliedDateFrom);
    setPendingDateTo(appliedDateTo);
  };

  // "Clear All": resets everything (pending AND applied) back to
  // defaults immediately — this one takes effect right away rather than
  // needing a separate "Apply" click, since "clear everything" has no
  // ambiguity to stage.
  const handleClearAll = () => {
    setPendingType("all");
    setPendingCategories([]);
    setPendingColors([]);
    setPendingDateFrom("");
    setPendingDateTo("");
    setAppliedType("all");
    setAppliedCategories([]);
    setAppliedColors([]);
    setAppliedDateFrom("");
    setAppliedDateTo("");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveSearch(searchQuery.trim().toLowerCase());
  };

  // The actual filtering: combines the search bar's activeSearch with
  // every APPLIED (not pending) filter. An empty categories/colors array
  // means "no restriction on this field" — i.e. don't filter by it at all.
  const filteredItems = allItems.filter((item) => {
    if (activeSearch && !item.title.toLowerCase().includes(activeSearch)) {
      return false;
    }

    if (appliedType === "resolved" && !item.resolved) return false;
    if (
      (appliedType === "lost" || appliedType === "found") &&
      (item.status !== appliedType || item.resolved)
    ) {
      return false;
    }

    if (
      appliedCategories.length > 0 &&
      !appliedCategories.includes(item.category)
    ) {
      return false;
    }

    if (appliedColors.length > 0 && !appliedColors.includes(item.color)) {
      return false;
    }

    if (appliedDateFrom && item.date < appliedDateFrom) return false;
    if (appliedDateTo && item.date > appliedDateTo) return false;

    return true;
  });

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="relative w-full">
      <DecorativeBackground variant="itemList" />

      <div className="relative z-10">
        {/* ================= HERO ================= */}
        {/* NOTE: wireframe has organic purple shapes behind this section —
          deferred per team decision, same as Home and How It Works. */}
        <section className="max-w-[1280px] mx-auto px-10 py-16">
          <div className="grid grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-body-lg font-semibold text-text-primary tracking-wide">
                LOST &amp; FOUND COMMUNITY
              </p>
              <h1 className="text-display-lg font-bold text-primary-dark mt-2">
                Find what
                <br /> you're looking for.
              </h1>
              <p className="text-body-lg text-text-secondary mt-4 max-w-md">
                Browse recently reported lost and found items. Search, filter,
                and discover a possible match in just a few clicks.
              </p>
            </div>

            {/* Illustration placeholder — swap for the real box/items image later */}
            <div className="w-full h-80 rounded-xl  flex items-center justify-center text-text-secondary text-body-sm">
              <img
                src="https://res.cloudinary.com/d5tnusci/image/upload/v1789924308/itemlists_f7kjjr.png"
                alt=""
                className="w-300 h-auto"
              />
            </div>
          </div>

          {/* Search bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex justify-center gap-4 mt-10"
          >
            <div className="relative w-full max-w-xl">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="(Search for items eg. wallets,backpacks..)"
                className="w-full border border-border rounded-lg pl-11 pr-10 py-3 text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {/* Clear button — only shows once a search is actually active.
        Resets both the input text AND the applied search filter, so
        results immediately return to their unfiltered state. */}
              {activeSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveSearch("");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-text-inverse rounded-lg px-8 py-3 text-body-md font-medium transition-colors"
            >
              Search
            </button>
          </form>
        </section>

        {/* ================= FILTERS + RESULTS ================= */}
        <section className="max-w-[1280px] mx-auto px-10 pb-16">
          <div className="grid grid-cols-[280px_1fr] gap-10 items-start">
            {/* ===== FILTER SIDEBAR ===== */}
            <div className="border border-border rounded-lg p-6">
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

              {/* Item Types — single select radio group */}
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

              {/* Category — multi-select checkboxes with icons */}
              <div className="mt-6">
                <h3 className="bg-background-subtle px-3 py-2 rounded text-label-md font-medium text-text-primary">
                  Category
                </h3>
                <div className="flex flex-col gap-3 mt-3 px-1">
                  {CATEGORIES.map(({ label, icon: Icon }) => (
                    <label
                      key={label}
                      className="flex items-center gap-2 text-body-md text-text-primary cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={pendingCategories.includes(label)}
                        onChange={() => toggleCategory(label)}
                        className="accent-primary"
                      />
                      <Icon size={16} className="text-text-secondary" />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Color — multi-select swatches */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setIsColorsExpanded((v) => !v)}
                  className="w-full flex items-center justify-between bg-background-subtle px-3 py-2 rounded text-label-md font-medium text-text-primary"
                >
                  Color
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${isColorsExpanded ? "rotate-180" : ""}`}
                  />
                </button>
                {isColorsExpanded && (
                  <div className="flex flex-wrap gap-2 mt-3 px-1">
                    {COLORS.map((color) => (
                      <button
                        key={color.name}
                        type="button"
                        title={color.name}
                        onClick={() => toggleColor(color.name)}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${
                          pendingColors.includes(color.name)
                            ? "border-primary scale-110"
                            : "border-border"
                        }`}
                        style={{ backgroundColor: color.hex }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Expired Date — date range */}
              <div className="mt-6">
                <h3 className="bg-background-subtle px-3 py-2 rounded text-label-md font-medium text-text-primary">
                  Expired Date
                </h3>
                <div className="px-1 mt-3">
                  <label className="text-body-sm text-text-secondary">
                    From
                  </label>
                  <div className="relative mt-1">
                    <input
                      type="date"
                      value={pendingDateFrom}
                      onChange={(e) => setPendingDateFrom(e.target.value)}
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
                      onChange={(e) => setPendingDateTo(e.target.value)}
                      className="w-full border border-border rounded-lg px-3 py-2 text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleApplyFilters}
                className="w-full bg-primary hover:bg-primary-dark text-text-inverse rounded-lg py-2.5 text-body-md font-medium mt-6 transition-colors"
              >
                Apply Filters
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="w-full border border-border rounded-lg py-2.5 text-body-md text-text-primary hover:bg-background-subtle mt-3 transition-colors"
              >
                Cancel
              </button>
            </div>

            {/* ===== RESULTS ===== */}
            <div>
              <h2 className="text-heading-2 font-bold text-primary-dark">
                {loading ? "Loading..." : `${filteredItems.length} items found`}
              </h2>

              {error && (
                <p className="text-error text-body-md mt-4">Error: {error}</p>
              )}

              {!loading && !error && filteredItems.length === 0 && (
                <p className="text-body-md text-text-secondary mt-8">
                  No items match your filters. Try adjusting or clearing them.
                </p>
              )}

              {!loading && !error && filteredItems.length > 0 && (
                <div className="grid grid-cols-3 gap-6 mt-6">
                  {paginatedItems.map((item) => (
                    <div
                      key={item.id}
                      className="border border-border rounded-lg overflow-hidden"
                    >
                      {/* Image placeholder — swap for the real uploaded photo
                        once the Report Item feature exists. */}
                      <div className="w-full h-40 bg-neutral-100 flex items-center justify-center text-text-secondary text-body-sm">
                        Image Placeholder
                      </div>

                      <div className="p-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-label-sm font-medium ${
                            item.status === "lost"
                              ? "bg-error/10 text-error"
                              : "bg-success/10 text-success"
                          }`}
                        >
                          {item.status === "lost" ? "Lost" : "Found"}
                        </span>

                        <h3 className="text-heading-3 font-bold text-text-primary mt-2 truncate">
                          {item.title}
                        </h3>

                        <div className="flex items-center gap-1 text-body-sm text-text-secondary mt-1">
                          <MapPin size={14} />
                          {item.location}
                        </div>

                        <p className="text-body-sm text-text-secondary mt-1">
                          {formatDate(item.date)} ·{" "}
                          {item.resolved ? "Resolved" : "Searching"}
                        </p>

                        <Link
                          to={`/items/${item.id}`}
                          className="mt-3 inline-flex items-center justify-center w-full border border-border rounded-lg px-4 py-2 text-body-md text-text-primary hover:bg-primary hover:text-text-inverse hover:border-primary transition-colors"
                        >
                          More Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="border border-border rounded-lg px-4 py-2 text-body-md text-text-primary hover:bg-background-subtle disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg text-body-md font-medium transition-colors ${
                          currentPage === page
                            ? "bg-primary text-text-inverse"
                            : "border border-border text-text-primary hover:bg-background-subtle"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="border border-border rounded-lg px-4 py-2 text-body-md text-text-primary hover:bg-background-subtle disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ItemList;
