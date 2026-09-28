import { useMemo, useState } from "react";
import ManagePageHeader from "./ManagePageHeader";
import ManageTabs from "./ManageTabs";
import AttributePanel from "./AttributePanel";

const ManageAttributesLayout = ({
  title = "Manage Attributes",
  description = "Categories, locations, and colours used across the app",
  tabs = [],
  data = {},
  panelConfig = {},
  onAdd,
  onEdit,
  onDelete,
}) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.value || "");

  const [search, setSearch] = useState("");

  const activeItems = data[activeTab] || [];

  const filteredItems = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return activeItems;
    }

    return activeItems.filter((item) =>
      item.name.toLowerCase().includes(value),
    );
  }, [activeItems, search]);

  const config = panelConfig[activeTab] || {};

  return (
    <div className="min-h-full w-full bg-[#F8FAFC] px-5 py-5 pb-20 lg:px-10">
      {/* HEADER */}
      <ManagePageHeader
        title={title}
        description={description}
        searchValue={search}
        onSearchChange={setSearch}
        onSearch={() => {}}
      />

      {/* TABS */}
      <div className="mt-[90px]">
        <ManageTabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(value) => {
            setActiveTab(value);
            setSearch("");
          }}
        />
      </div>

      {/* PANEL */}
      <div className="mt-[43px]">
        <AttributePanel
          title={config.title || activeTab}
          subtitle={config.subtitle || `shown as a filter on Browse Items`}
          items={filteredItems}
          showColor={config.showColor}
          showCategoryIcon={config.showCategoryIcon}
          onAdd={() => onAdd?.(activeTab)}
          onEdit={(item) => onEdit?.(activeTab, item)}
          onDelete={(item) => onDelete?.(activeTab, item)}
        />
      </div>
    </div>
  );
};

export default ManageAttributesLayout;
