import { Search } from "lucide-react";

const ManagePageHeader = ({
  title,
  description,
  searchValue,
  onSearchChange,
  onSearch,
  placeholder = "Search listings or Users...",
}) => {
  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
      {/* Title */}
      <div>
        <h1 className="text-heading-1 font-bold leading-tight text-text-primary">
          {title}
        </h1>

        <p className="mt-1 max-w-[450px] text-body-md leading-6 text-text-secondary">
          {description}
        </p>
      </div>

      {/* Search */}
      <div className="flex w-full max-w-[470px] gap-3">
        <div className="relative flex-1">
          <Search
            size={27}
            strokeWidth={2}
            className="
              absolute
              left-5
              top-1/2
              -translate-y-1/2
              text-primary
            "
          />

          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearch?.();
              }
            }}
            placeholder={placeholder}
            className="
              h-[57px]
              w-full
              rounded-lg
              border
              border-border
              bg-white
              pl-[62px]
              pr-4
              text-body-md
              text-text-primary
              shadow-sm
              outline-none
              placeholder:text-text-secondary
              focus:border-primary
              focus:ring-2
              focus:ring-primary/20
            "
          />
        </div>

        <button
          type="button"
          onClick={onSearch}
          className="
            h-[57px]
            rounded-lg
            bg-primary
            px-7
            text-body-md
            font-medium
            text-text-inverse
            transition
            hover:bg-primary-dark
            active:scale-[0.98]
          "
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default ManagePageHeader;
