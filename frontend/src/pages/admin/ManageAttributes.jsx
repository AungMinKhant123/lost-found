import { useEffect, useState } from "react";

import { Search, X, Plus } from "lucide-react";

import toast from "react-hot-toast";

import {
  isFallbackAttribute,
  fetchAdminCategoriesWithFallback as getAdminCategories,
  fetchAdminColorsWithFallback as getAdminColors,
  createAdminCategoryWithFallback as createAdminCategory,
  updateAdminCategoryWithFallback as updateAdminCategory,
  deleteAdminCategoryWithFallback as deleteAdminCategory,
  createAdminColorWithFallback as createAdminColor,
  updateAdminColorWithFallback as updateAdminColor,
  deleteAdminColorWithFallback as deleteAdminColor,
} from "../../services/api";

import AttributeRow from "../../components/admin/AttributeRow";

import AttributeModal from "../../components/admin/AttributeModal";

import DeleteConfirmModal from "../../components/admin/DeleteConfirmModal";

const TABS = [
  { value: "colours", label: "Colours" },

  { value: "categories", label: "Categories" },
];

// Everything that differs between the two tabs lives here, so the rest

// of the page is written once and works for both.

const CONFIG = {
  colours: {
    title: "Colours",

    singular: "Colour",

    modalType: "colour",

    subtitle: "shown as a filter on Browse Items",

    create: createAdminColor,

    update: updateAdminColor,

    remove: deleteAdminColor,
  },

  categories: {
    title: "Categories",

    singular: "Category",

    modalType: "category",

    subtitle: "used to tag every listing",

    create: createAdminCategory,

    update: updateAdminCategory,

    remove: deleteAdminCategory,
  },
};

const ManageAttributes = () => {
  const [colours, setColours] = useState([]);

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("colours");

  // Search works like Item List's: type, then press Enter / Search.

  const [searchInput, setSearchInput] = useState("");

  const [activeSearch, setActiveSearch] = useState("");

  // Add/Edit modal

  const [modalOpen, setModalOpen] = useState(false);

  const [editing, setEditing] = useState(null); // null = adding

  // Delete confirmation

  const [deleting, setDeleting] = useState(null);

  const [isDeleting, setIsDeleting] = useState(false);

  const config = CONFIG[activeTab];

  const source = activeTab === "colours" ? colours : categories;

  // Reload both lists and their backend-calculated usage counts after a change.

  const fetchData = async () => {
    const [colourData, categoryData] = await Promise.all([
      getAdminColors(),
      getAdminCategories(),
    ]);

    const fallbackLast = (list) =>
      [...list].sort(
        (a, b) =>
          Number(isFallbackAttribute(a.name)) -
          Number(isFallbackAttribute(b.name)),
      );

    setColours(
      fallbackLast(
        colourData.map((colour) => ({
          ...colour,
          hex: colour.hexCode,
        })),
      ),
    );
    setCategories(fallbackLast(categoryData));
  };

  useEffect(() => {
    fetchData()
      .catch((err) => {
        console.error("Failed to load attributes:", err);

        toast.error(err.message || "Couldn't load attributes.");
      })

      .finally(() => setLoading(false));
  }, []);

  const countFor = (attribute) => attribute.itemCount ?? 0;

  const visible = source.filter(
    (attribute) =>
      !activeSearch || attribute.name.toLowerCase().includes(activeSearch),
  );

  const switchTab = (tab) => {
    setActiveTab(tab);

    setSearchInput("");

    setActiveSearch("");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    setActiveSearch(searchInput.trim().toLowerCase());
  };

  const clearSearch = () => {
    setSearchInput("");

    setActiveSearch("");
  };

  const openAdd = () => {
    setEditing(null);

    setModalOpen(true);
  };

  const openEdit = (attribute) => {
    setEditing(attribute);

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);

    setEditing(null);
  };

  // Called by the modal. If this throws (e.g. duplicate name), the

  // modal shows the message inline and stays open.

  const handleSave = async (data) => {
    if (editing) {
      await config.update(editing.id, data);
    } else {
      await config.create(data);
    }

    await fetchData();

    toast.success(editing ? `Updated "${data.name}"` : `Added "${data.name}"`);

    closeModal();
  };

  const handleConfirmDelete = async () => {
    const target = deleting;

    setIsDeleting(true);

    try {
      const { reassigned } = await config.remove(target.id);

      await fetchData();

      toast.success(
        reassigned > 0
          ? `Deleted "${target.name}" — ${reassigned} item${reassigned === 1 ? "" : "s"} reassigned to Other`
          : `Deleted "${target.name}"`,
      );

      setDeleting(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-10">
      {/* Header + search */}

      <div className="flex items-start justify-between gap-8">
        <div>
          <h1 className="text-heading-1 font-bold text-text-primary">
            Manage Attributes
          </h1>

          <p className="text-body-md text-text-secondary mt-1 max-w-sm">
            Categories, locations, and colours used across the app
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between gap-4 mt-10">
        <div className="flex gap-2.5 ">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => switchTab(tab.value)}
              className={`px-8 py-2.5 rounded-md text-body-sm font-medium transition-colors ${
                activeTab === tab.value
                  ? "bg-primary text-text-inverse"
                  : "bg-neutral-100 text-text-primary hover:bg-neutral-300/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Box */}

        <form
          onSubmit={handleSearchSubmit}
          className="flex gap-3 w-full max-w-md ml-auto"
        >
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-primary"
            />

            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={`Search ${config.title.toLowerCase()}...`}
              className="w-full border border-border rounded-lg pl-11 pr-10 py-2.5 text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {activeSearch && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="bg-primary hover:bg-primary-dark text-text-inverse rounded-lg px-6 py-2.5 text-body-md font-medium transition-colors shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      {/* Panel */}

      <section className="border border-border rounded-lg p-6 mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-heading-3 font-bold text-text-primary">
              {config.title}
            </h2>
            <p className="text-body-sm text-text-secondary mt-1">
              {source.length} values · {config.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={openAdd}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-text-inverse rounded-lg px-5 py-2.5 text-body-md font-medium transition-colors"
          >
            <Plus size={18} />
            Add {config.singular}
          </button>
        </div>

        {/* Scrollable list container showing ~7 items */}
        <div className="flex flex-col mt-5 max-h-[340px] overflow-y-auto admin-scrollbar pr-1">
          {visible.length === 0 ? (
            <p className="py-8 text-center text-body-md text-text-secondary">
              {activeSearch
                ? `No ${config.title.toLowerCase()} match "${activeSearch}".`
                : `No ${config.title.toLowerCase()} yet — add one above.`}
            </p>
          ) : (
            visible.map((attribute) => (
              <AttributeRow
                key={attribute.id}
                variant={activeTab}
                attribute={attribute}
                itemCount={countFor(attribute)}
                onEdit={() => openEdit(attribute)}
                onDelete={() => setDeleting(attribute)}
              />
            ))
          )}
        </div>
      </section>

      <AttributeModal
        isOpen={modalOpen}
        type={config.modalType}
        editing={editing}
        onClose={closeModal}
        onSave={handleSave}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deleting)}
        item={deleting}
        itemCount={deleting ? countFor(deleting) : 0}
        isDeleting={isDeleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default ManageAttributes;
