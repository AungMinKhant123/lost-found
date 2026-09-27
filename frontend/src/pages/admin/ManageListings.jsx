import { useEffect, useState } from "react";
import { Search, ChevronDown, Eye, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { getItems, getUsers, getClaims, deleteItem } from "../../services/api";
import ListingDetailsModal from "../../components/admin/ListingDetailsModal";
import ConfirmDeleteModal from "../../components/admin/ConfirmDeleteModal";

const CATEGORIES = [
  "Electronics",
  "Bags",
  "Clothing",
  "Accessories",
  "Keys",
  "Documents",
  "Other",
];
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
  const [users, setUsers] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Which item is being viewed in the details modal / deleted in the
  // confirm modal. Kept separate so "delete from the details modal"
  // can stack the confirm modal on top without closing the details one
  // first.
  const [viewingItemId, setViewingItemId] = useState(null);
  const [deletingItemId, setDeletingItemId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([getItems(), getUsers(), getClaims()])
      .then(([itemsData, usersData, claimsData]) => {
        setItems(itemsData);
        setUsers(usersData);
        setClaims(claimsData);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const findUser = (userId) => users.find((u) => u.id === userId);

  // "Maren O." style — first name + last initial.
  const posterNameFor = (item) => {
    const user = findUser(item.userId);
    if (!user) return "Unknown";
    const lastInitial = user.lastName ? `${user.lastName.charAt(0)}.` : "";
    return `${user.firstName} ${lastInitial}`.trim();
  };

  // Joins each item with its display-ready poster name, contact info
  // (item.postedBy takes priority if set, otherwise falls back to the
  // user's own record), and claim count — this is the shape the table
  // and filters actually work with.
  const joinedItems = items.map((item) => {
    const user = findUser(item.userId);
    return {
      ...item,
      posterName: posterNameFor(item),
      posterPhone: item.postedBy?.phone || user?.phone || null,
      posterEmail: item.postedBy?.email || user?.email || null,
      claimCount: claims.filter((c) => c.itemId === item.id).length,
    };
  });

  const filteredItems = joinedItems.filter((item) => {
    if (search) {
      const q = search.toLowerCase();
      if (
        !item.title.toLowerCase().includes(q) &&
        !item.posterName.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    if (statusFilter === "open" && item.resolved) return false;
    if (statusFilter === "resolved" && !item.resolved) return false;
    if (typeFilter !== "all" && item.status !== typeFilter) return false;
    if (categoryFilter !== "all" && item.category !== categoryFilter)
      return false;
    return true;
  });

  const totalPages = Math.ceil(filteredItems.length / ROWS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE,
  );

  // Reset to page 1 whenever a filter/search changes, so you don't get
  // stuck on an empty later page after narrowing results.
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, typeFilter, categoryFilter]);

  const viewingItem = viewingItemId
    ? (() => {
        const item = joinedItems.find((i) => i.id === viewingItemId);
        if (!item) return null;
        const itemClaims = claims
          .filter((c) => c.itemId === viewingItemId)
          .map((c) => ({
            ...c,
            claimantName: (() => {
              const u = findUser(c.userId);
              return u ? `${u.firstName} ${u.lastName}` : "Unknown";
            })(),
          }));
        return { ...item, claims: itemClaims };
      })()
    : null;

  const deletingItemTitle = deletingItemId
    ? items.find((i) => i.id === deletingItemId)?.title
    : null;

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteItem(deletingItemId);
      toast.success("Listing Deleted!");
      setDeletingItemId(null);
      setViewingItemId(null); // close the details modal too, if it was open
      loadData();
    } catch (err) {
      toast.error("Failed to delete listing. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;

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
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none border border-border rounded-lg pl-4 pr-9 py-2.5 text-body-md"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="resolved">Resolved</option>
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
          />
        </div>

        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="appearance-none border border-border rounded-lg pl-4 pr-9 py-2.5 text-body-md"
          >
            <option value="all">All Type</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
          />
        </div>

        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="appearance-none border border-border rounded-lg pl-4 pr-9 py-2.5 text-body-md"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
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
                        onClick={() => setViewingItemId(item.id)}
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
          onClose={() => setViewingItemId(null)}
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
