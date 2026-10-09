import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  getAllUsersWithStats,
  getUserFullDetails,
  promoteToAdmin,
  demoteToUser,
  deleteUserByAdmin,
} from "../../services/api";
import UserRow from "../../components/admin/UserRow";
import UserDetailsModal from "../../components/admin/UserDetailsModal";
import DeleteUserModal from "../../components/admin/DeleteUserModal";

const TABS = [
  { value: "users", label: "Users" },
  { value: "admins", label: "Admins" },
];

const isAdminRole = (role) => role === "ADMIN" || role === "SUPERADMIN";

const ManageUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");

  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const [viewingUserId, setViewingUserId] = useState(null);
  const [viewingDetails, setViewingDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [deletingUser, setDeletingUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    setAllUsers(await getAllUsersWithStats());
  };

  useEffect(() => {
    fetchUsers()
      .catch((err) => {
        console.error("Failed to load users:", err);
        toast.error("Couldn't load users. Is the mock API running?");
      })
      .finally(() => setLoading(false));
  }, []);

  // Loads the full detail (items + claims) only once a user is selected.
  useEffect(() => {
    if (!viewingUserId) {
      setViewingDetails(null);
      return;
    }
    setDetailsLoading(true);
    getUserFullDetails(viewingUserId)
      .then(setViewingDetails)
      .catch(() => toast.error("Couldn't load this user's details."))
      .finally(() => setDetailsLoading(false));
  }, [viewingUserId]);

  const visible = allUsers
    .filter((u) =>
      activeTab === "admins" ? isAdminRole(u.role) : !isAdminRole(u.role),
    )
    .filter((u) => {
      if (!activeSearch) return true;
      const q = activeSearch.toLowerCase();
      const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
      return fullName.includes(q) || u.email.toLowerCase().includes(q);
    });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveSearch(searchInput.trim().toLowerCase());
  };

  const clearSearch = () => {
    setSearchInput("");
    setActiveSearch("");
  };

  const handlePromote = async (user) => {
    try {
      await promoteToAdmin(user.id);
      await fetchUsers();
      toast.success(`${user.firstName} promoted to Admin.`);
    } catch (err) {
      toast.error(err.message || "Failed to promote user.");
    }
  };

  const handleDemote = async (user) => {
    try {
      await demoteToUser(user.id);
      await fetchUsers();
      toast.success(`${user.firstName} demoted to User.`);
    } catch (err) {
      toast.error(err.message || "Failed to demote admin.");
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteUserByAdmin(deletingUser.id);
      toast.success(`${deletingUser.firstName}'s account deleted.`);
      setDeletingUser(null);
      setViewingUserId(null);
      await fetchUsers();
    } catch (err) {
      toast.error(err.message || "Failed to delete account.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-10">
      <div className="flex items-start justify-between gap-8">
        <div>
          <h1 className="text-heading-1 font-bold text-text-primary">
            Manage Users
          </h1>
          <p className="text-body-md text-text-primary mt-1 max-w-sm">
            View, promote, demote, and remove accounts across the app
          </p>
        </div>

        <form
          onSubmit={handleSearchSubmit}
          className="flex gap-3 w-full max-w-md"
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
              placeholder="Search by name or email..."
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

      <div className="flex gap-2.5 mt-10">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
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

      <section className="border border-border rounded-lg p-6 mt-6">
        <div>
          <h2 className="text-heading-3 font-bold text-text-primary">
            {activeTab === "admins" ? "Admins" : "Users"}
          </h2>
          <p className="text-body-sm text-text-secondary mt-1">
            {visible.length} accounts
          </p>
        </div>

        {/* Scrollable list container showing ~7 items */}
        <div className="flex flex-col mt-5 max-h-[340px] overflow-y-auto admin-scrollbar pr-1">
          {visible.length === 0 ? (
            <p className="py-8 text-center text-body-md text-text-secondary">
              {activeSearch
                ? `No accounts match "${activeSearch}".`
                : "No accounts here yet."}
            </p>
          ) : (
            visible.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                onView={() => setViewingUserId(user.id)}
                onDelete={() => setDeletingUser(user)}
                onPromote={() => handlePromote(user)}
                onDemote={() => handleDemote(user)}
              />
            ))
          )}
        </div>
      </section>

      {viewingUserId && !detailsLoading && viewingDetails && (
        <UserDetailsModal
          details={viewingDetails}
          onClose={() => setViewingUserId(null)}
          onDeleteClick={() => setDeletingUser(viewingDetails.user)}
        />
      )}

      {deletingUser && (
        <DeleteUserModal
          userName={`${deletingUser.firstName} ${deletingUser.lastName}`}
          isDeleting={isDeleting}
          onCancel={() => setDeletingUser(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default ManageUsers;
