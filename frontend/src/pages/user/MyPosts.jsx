import { useState } from "react";
import { MapPin } from "lucide-react";
import { Link } from "react-router";
import { useMyPosts } from "../../hooks/useMyPosts";

// The five filter tabs, in display order.
const TABS = [
  { label: "All Items", value: "all" },
  { label: "Lost Items", value: "lost" },
  { label: "Found Items", value: "found" },
  { label: "Resolved", value: "resolved" },
  { label: "Pending Claims", value: "pending" },
];

// Formats an ISO date string into "Sep 6, 2026".
function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const MyPosts = () => {
  const [activeTab, setActiveTab] = useState("all");

  const {
    data: postsData,
    isLoading: postsLoading,
    error: postsError,
  } = useMyPosts();

  const items = postsData?.data ?? [];

  const filteredItems = items.filter((item) => {
    if (activeTab === "all") {
      return true;
    }

    if (activeTab === "lost") {
      return item.type === "LOST";
    }

    if (activeTab === "found") {
      return item.type === "FOUND";
    }

    if (activeTab === "resolved") {
      return item.status === "RESOLVED";
    }

    if (activeTab === "pending") {
      return item.pendingClaimsCount > 0;
    }

    return true;
  });

  if (postsLoading) {
    return <div>Loading...</div>;
  }

  if (postsError) {
    return <div>Error: {postsError.message}</div>;
  }

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
          {filteredItems.map((item) => {
            const pendingCount = item.pendingClaimsCount ?? 0;

            const isLost = item.type === "LOST";
            const isResolved = item.status === "RESOLVED";

            return (
              <div
                key={item.id}
                className="border border-border rounded-lg overflow-hidden"
              >
                {/* Item image */}
                <div className="w-full h-40 bg-neutral-100 flex items-center justify-center overflow-hidden">
                  {item.images?.[0]?.imageUrl ? (
                    <img
                      src={item.images[0].imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-text-secondary text-body-sm">
                      No Image
                    </span>
                  )}
                </div>

                <div className="p-4">
                  {/* Status badges */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-label-sm font-medium ${
                        isLost
                          ? "bg-error/10 text-error"
                          : "bg-success/10 text-success"
                      }`}
                    >
                      {isLost ? "Lost" : "Found"}
                    </span>

                    {pendingCount > 0 && (
                      <span className="inline-block px-2 py-0.5 rounded text-label-sm font-medium bg-warning/10 text-warning">
                        {pendingCount} pending claim
                        {pendingCount > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-heading-3 font-bold text-text-primary mt-2">
                    {item.title}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-1 text-body-sm text-text-secondary mt-1">
                    <MapPin size={14} />
                    {item.location}
                  </div>

                  {/* Date + status */}
                  <p className="text-body-sm text-text-secondary mt-1">
                    {formatDate(item.dateLostOrFound)} ·{" "}
                    {isResolved ? "Resolved" : "Searching"}
                  </p>

                  {/* Details */}

                  <Link
                    to={`/account/posts/${item.id}`}
                    className="mt-3 inline-flex items-center justify-center w-full border border-border rounded-lg px-4 py-2 text-body-md text-text-primary hover:bg-background-subtle transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyPosts;
