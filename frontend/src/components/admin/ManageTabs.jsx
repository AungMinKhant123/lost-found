const ManageTabs = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const active = activeTab === tab.value;

        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={`
              h-[51px]
              rounded-md
              px-10
              text-body-md
              font-medium
              transition-all
              duration-200

              ${
                active
                  ? "bg-primary text-text-inverse shadow-sm"
                  : "bg-[#F1F3F5] text-text-primary hover:bg-[#E5E7EB]"
              }
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default ManageTabs;
