import { useEffect, useState } from "react";
import { Link } from "react-router";
import { MapPin } from "lucide-react";
import { getCurrentUser, getItemsByUser } from "../../services/api";

// The four filter tabs, in display order.
// "value" matches how we'll filter the items array below.
const TABS = [
  { label: "All Items", value: "all" },
  { label: "Lost Items", value: "lost" },
  { label: "Found Items", value: "found" },
  { label: "Resolved", value: "resolved" },
];

// Formats an ISO date string ("2026-09-06") into "Sep 6, 2026",
// matching the wireframe's date display.
function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const MyPosts = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // Two-step fetch: first find out who's logged in, then fetch only
    // that user's items. (Same mock-user approach as AccountSidebar —
    // hardcoded to user id "1" until real auth/login exists.)
    getCurrentUser()
      .then((user) => getItemsByUser(user.id))
      .then((data) => setItems(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Filters the fetched items based on which tab is active.
  const filteredItems = items.filter((item) => {
    if (activeTab === "all") return true;
    if (activeTab === "resolved") return item.resolved;
    return item.status === activeTab && !item.resolved;
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1 className="text-heading-1 font-bold text-text-primary">My Posts</h1>
      <p className="text-body-md text-text-secondary mt-2">
        Manage the items you've reported lost or found
      </p>

      {/* Tab bar */}
      <div className="inline-flex bg-neutral-100 rounded-full p-1 mt-6">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-full text-body-sm font-medium transition-colors ${
              activeTab === tab.value
                ? "bg-background text-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Item grid */}
      {filteredItems.length === 0 ? (
        <p className="text-body-md text-text-secondary mt-8">
          No items in this category yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="border border-border rounded-lg overflow-hidden"
            >
              {/* Image placeholder — swap for the real uploaded photo once
                  the Report Item feature exists and items have a real image URL. */}
              <div className="w-full h-40 bg-neutral-100 flex items-center justify-center text-text-secondary text-body-sm">
                Image Placeholder
              </div>

              <div className="p-4">
                {/* Status badge: red for lost, green for found */}
                <span
                  className={`inline-block px-2 py-0.5 rounded text-label-sm font-medium ${
                    item.status === "lost"
                      ? "bg-error/10 text-error"
                      : "bg-success/10 text-success"
                  }`}
                >
                  {item.status === "lost" ? "Lost" : "Found"}
                </span>

                <h3 className="text-heading-3 font-bold text-text-primary mt-2">
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
                  className="mt-3 inline-flex items-center justify-center w-full border border-border rounded-lg px-4 py-2 text-body-md text-text-primary hover:bg-background-subtle transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPosts;
