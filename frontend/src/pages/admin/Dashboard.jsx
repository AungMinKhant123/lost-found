import { useState } from "react";
import { Flag, Search, AlertCircle, FilePlus } from "lucide-react";

import AdminSelect from "../../components/admin/AdminSelect";
import { useAdminDashboard } from "../../hooks/useAdminDashboard";

function formatTimeAgo(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";

  if (diffMins < 60) {
    return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  }

  const diffHours = Math.floor(diffMins / 60);

  if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);

  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

const ACTIVITY_ICONS = {
  CLAIM_SUBMITTED: FilePlus,
  ITEM_POSTED: Search,
  ITEM_RESOLVED: Flag,
};

const Dashboard = () => {
  const [categoryPeriod, setCategoryPeriod] = useState("ALL_TIME");

  const { data, isLoading, isError } = useAdminDashboard(categoryPeriod);

  if (isLoading) {
    return <div className="p-10">Loading...</div>;
  }

  if (isError || !data) {
    return <div className="p-10">Failed to load dashboard.</div>;
  }

  const stats = data.summary;

  const categories = Object.fromEntries(
    data.itemsByCategory.map((category) => [category.name, category.count]),
  );

  const activity = data.recentActivity;

  const maxCategoryCount = Math.max(...Object.values(categories), 1);

  return (
    <div className="px-10 py-3">
      {/* Header + search */}
      <div className="flex items-center justify-between gap-6">
        <div>
          <h1 className="text-heading-1 font-bold text-text-primary">
            Dashboard
          </h1>
          <p className="text-body-md text-text-secondary mt-1">
            Overview of everything happening on LostFound
          </p>
        </div>

        <div className="flex gap-3 flex-1 max-w-xl">
          <input
            type="text"
            placeholder="Search listings or Users..."
            className="w-full border border-border rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <button className="bg-primary hover:bg-primary-dark text-text-inverse rounded-lg px-6 py-2.5 text-body-md font-medium transition-colors shrink-0">
            Search
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-6 mt-8">
        <div className="bg-primary text-white rounded-xl p-6">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <Flag size={18} className="text-primary" />
          </div>

          <p className="text-heading-1 font-bold mt-4">
            {stats.totalClaimsMade}
          </p>

          <p className="text-body-md mt-1">Total Claims Made</p>
        </div>

        <div className="bg-info text-white rounded-xl p-6">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <Search size={18} className="text-info" />
          </div>

          <p className="text-heading-1 font-bold mt-4">{stats.resolvedItems}</p>

          <p className="text-body-md mt-1">Resolved items</p>
        </div>

        <div className="bg-success text-white rounded-xl p-6">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <AlertCircle size={18} className="text-success" />
          </div>

          <p className="text-heading-1 font-bold mt-4">{stats.openItems}</p>

          <p className="text-body-md mt-1">Open Items</p>
        </div>

        <div className="bg-warning text-white rounded-xl p-6">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <FilePlus size={18} className="text-warning" />
          </div>

          <p className="text-heading-1 font-bold mt-4">
            {stats.totalItemsPosted}
          </p>

          <p className="text-body-md mt-1">Total Items Posted</p>
        </div>
      </div>

      {/* Category + activity panels */}
      <div className="grid grid-cols-2 gap-6 mt-8">
        <div className="border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-3 font-bold text-text-primary">
              Items by category
            </h2>

            <AdminSelect
              value={categoryPeriod}
              onChange={setCategoryPeriod}
              className="w-36"
              options={[
                {
                  value: "ALL_TIME",
                  label: "All Time",
                },
                {
                  value: "THIS_YEAR",
                  label: "This Year",
                },
                {
                  value: "THIS_MONTH",
                  label: "This Month",
                },
                {
                  value: "THIS_WEEK",
                  label: "This Week",
                },
                {
                  value: "TODAY",
                  label: "Today",
                },
              ]}
            />
          </div>

          <p className="text-body-sm text-primary mt-1">
            Share of total listings, all-time
          </p>

          <div className="flex flex-col gap-4 mt-5">
            {Object.entries(categories).map(([category, count]) => (
              <div key={category} className="flex items-center gap-4">
                <span className="text-body-md text-text-primary w-40 shrink-0">
                  {category}
                </span>

                <div className="flex-1 h-2 bg-primary/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{
                      width: `${(count / maxCategoryCount) * 100}%`,
                    }}
                  />
                </div>

                <span className="text-body-md text-text-primary w-8 text-right">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-border rounded-lg p-6">
          <h2 className="text-heading-3 font-bold text-text-primary">
            Recent activity
          </h2>

          <p className="text-body-sm text-primary mt-1">
            Last 12 platform events
          </p>

          <div className="flex flex-col gap-3 mt-5 max-h-64 overflow-y-auto pr-2 admin-scrollbar">
            {activity.map((event) => {
              const Icon = ACTIVITY_ICONS[event.type] || Flag;

              return (
                <div
                  key={event.id}
                  className="flex items-center gap-3 border border-border rounded-lg p-3"
                >
                  <div className="w-9 h-9 rounded-full border border-border flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-primary" />
                  </div>

                  <div>
                    <p className="text-body-sm text-text-primary">
                      {event.message}
                    </p>

                    <p className="text-label-sm text-text-secondary mt-0.5">
                      {formatTimeAgo(event.occurredAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
