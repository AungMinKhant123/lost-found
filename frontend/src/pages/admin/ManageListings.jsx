import { useCallback, useEffect, useState } from "react";
import { Search, Eye, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  deleteAdminListing,
  getAdminListing,
  getAdminListings,
} from "../../api/adminApi";
import ListingDetailsModal from "../../components/admin/ListingDetailsModal";
import ConfirmDeleteModal from "../../components/admin/ConfirmDeleteModal";
import AdminSelect from "../../components/admin/AdminSelect";
import { useAttributes } from "../../hooks/useAttributes";

const ROWS_PER_PAGE = 8;

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const ManageListings = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Which item is being viewed in the details modal / deleted in the
  // confirm modal. Kept separate so "delete from the details modal"
  // can stack the confirm modal on top without closing the details one
  // first.
  const [viewingItem, setViewingItem] = useState(null);
  const [deletingItemId, setDeletingItemId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { categories } = useAttributes();
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const categoryId =
    categoryFilter === "all"
      ? undefined
      : categories.find((category) => category.name === categoryFilter)?.id;

  const loadData = useCallback(async (signal) => {
    setLoading(true);
    try {
      const result = await getAdminListings({
        page: currentPage,
        limit: ROWS_PER_PAGE,
        ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
        ...(statusFilter !== "all" && {
          status: statusFilter.toUpperCase(),
        }),
        ...(typeFilter !== "all" && { type: typeFilter.toUpperCase() }),
        ...(categoryId && { categoryId }),
      }, { signal });
      if (signal?.aborted) return;
      setItems(
        result.data.map((item) => ({
          ...item,
          status: item.type.toLowerCase(),
          resolved: item.status === "RESOLVED",
          category: item.category.name,
          date: item.createdAt,
          posterName: `${item.user.firstName} ${item.user.lastName?.charAt(0) ? `${item.user.lastName.charAt(0)}.` : ""}`.trim(),
        })),
      );
      setTotalPages(result.pagination.totalPages);
    } catch (error) {
      if (signal?.aborted) return;
      console.error("Failed to load admin listings:", error);
      setItems([]);
      setTotalPages(0);
      toast.error(error.message || "Failed to load listings.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [categoryId, currentPage, debouncedSearch, statusFilter, typeFilter]);

  useEffect(() => {
    const controller = new AbortController();
    loadData(controller.signal);
    return () => controller.abort();
  }, [loadData]);

  const paginatedItems = items;

  // Reset to page 1 whenever a filter/search changes, so you don't get
  // stuck on an empty later page after narrowing results.
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, typeFilter, categoryFilter]);

  const deletingItemTitle = deletingItemId
    ? items.find((i) => i.id === deletingItemId)?.title
    : null;

  const handleViewItem = async (itemId) => {
    setViewingItem(null);
    try {
      const item = await getAdminListing(itemId);
      setViewingItem({
        ...item,
        status: item.type.toLowerCase(),
        resolved: item.status === "RESOLVED",
        category: item.category.name,
        color: item.color.name,
        date: item.dateLostOrFound,
        posterName: item.poster.name,
        posterPhone: item.poster.phone,
        posterEmail: item.poster.email,
        claims: item.claims.map((claim) => ({
          ...claim,
          status: claim.status.toLowerCase(),
          claimantName: `${claim.claimant.firstName} ${claim.claimant.lastName}`.trim(),
          claimedAt: claim.createdAt,
        })),
      });
    } catch (error) {
      console.error("Failed to load admin listing details:", error);
      toast.error(error.message || "Failed to load listing details.");
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAdminListing(deletingItemId);
      toast.success("Listing Deleted!");
      setDeletingItemId(null);
      setViewingItem(null);
      await loadData();
    } catch (error) {
      toast.error(error.message || "Failed to delete listing. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading && items.length === 0) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="p-10">
      <h1 className="text-heading-1 font-bold text-text-primary">
        Manage Listings
      </h1>
      <p className="text-body-md text-text-secondary mt-1">
        Review, moderate, and resolve reported items
      </p>

      {/* Search + filters */}
      <div className="flex gap-3 mt-6">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search listings or Users..."
            className="w-full border border-border rounded-lg pl-11 pr-4 py-2.5 text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="relative">
          <AdminSelect
            value={statusFilter}
            onChange={setStatusFilter}
            className="w-40"
            options={[
              { value: "all", label: "All Status" },
              { value: "open", label: "Open" },
              { value: "resolved", label: "Resolved" },
            ]}
          />
        </div>

        <div className="relative">
          <AdminSelect
            value={typeFilter}
            onChange={setTypeFilter}
            className="w-36"
            options={[
              { value: "all", label: "All Type" },
              { value: "lost", label: "Lost" },
              { value: "found", label: "Found" },
            ]}
          />
        </div>

        <div className="relative">
          <AdminSelect
            value={categoryFilter}
            onChange={setCategoryFilter}
            className="w-44"
            options={[
              { value: "all", label: "All Categories" },
              ...categories.map((c) => ({ value: c.name, label: c.name })),
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg mt-6 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-background-subtle">
            <tr>
              <th className="px-4 py-3 text-body-sm font-medium text-text-secondary">
                Title
              </th>
              <th className="px-4 py-3 text-body-sm font-medium text-text-secondary">
                Type
              </th>
              <th className="px-4 py-3 text-body-sm font-medium text-text-secondary">
                Category
              </th>
              <th className="px-4 py-3 text-body-sm font-medium text-text-secondary">
                Status
              </th>
              <th className="px-4 py-3 text-body-sm font-medium text-text-secondary">
                Poster
              </th>
              <th className="px-4 py-3 text-body-sm font-medium text-text-secondary">
                Date posted
              </th>
              <th className="px-4 py-3 text-body-sm font-medium text-text-secondary">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-body-md text-text-secondary"
                >
                  No listings match your filters.
                </td>
              </tr>
            ) : (
              paginatedItems.map((item) => (
                <tr key={item.id} className="border-t border-border">
                  <td className="px-4 py-3 text-body-md text-text-primary">
                    {item.title}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-body-sm font-medium ${item.status === "lost" ? "text-error" : "text-success"}`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-body-md text-text-primary">
                    {item.category || "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-body-sm font-medium ${item.resolved ? "text-success" : "text-warning"}`}
                    >
                      {item.resolved ? "Resolved" : "Open"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-body-md text-text-primary">
                    {item.posterName}
                  </td>
                  <td className="px-4 py-3 text-body-md text-text-secondary">
                    {formatDate(item.date)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleViewItem(item.id)}
                        className="text-success hover:opacity-70"
                        title="View details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingItemId(item.id)}
                        className="text-error hover:opacity-70"
                        title="Delete listing"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="border border-border rounded-lg px-4 py-2 text-body-md text-text-primary hover:bg-background-subtle disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
          ))}
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

      {/* Details modal */}
      {viewingItem && (
        <ListingDetailsModal
          item={viewingItem}
          onClose={() => setViewingItem(null)}
          onDeleteClick={() => setDeletingItemId(viewingItem.id)}
        />
      )}

      {/* Delete confirmation — shared between row delete and modal delete */}
      {deletingItemId && (
        <ConfirmDeleteModal
          itemTitle={deletingItemTitle}
          onCancel={() => setDeletingItemId(null)}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default ManageListings;
