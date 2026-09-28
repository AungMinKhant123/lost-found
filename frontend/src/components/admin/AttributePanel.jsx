import { Plus } from "lucide-react";
import AttributeRow from "./AttributeRow";

const AttributePanel = ({
  title,
  subtitle,
  items,
  onAdd,
  onEdit,
  onDelete,
  showColor = false,
  showCategoryIcon = false,
}) => {
  return (
    <section
      className="
        w-full
        overflow-hidden
        rounded-md
        border
        border-[#8191A3]
        bg-transparent
      "
    >
      {/* Panel Header */}

      <div
        className="
          flex
          flex-col
          gap-5
          px-7
          pt-2
          sm:flex-row
          sm:items-start
          sm:justify-between
        "
      >
        <div>
          <h2
            className="
              m-0
              text-[32px]
              font-semibold
              leading-[40px]
              text-text-primary
            "
          >
            {title}
          </h2>

          <p
            className="
              mt-2
              m-0
              text-body-md
              text-text-primary
            "
          >
            {items.length} values · {subtitle}
          </p>
        </div>

        {/* Add Button */}

        <button
          type="button"
          onClick={onAdd}
          className="
            flex
            h-[48px]
            shrink-0
            items-center
            justify-center
            gap-5
            rounded-lg
            border
            border-border
            bg-primary
            px-4
            text-body-md
            font-medium
            text-text-inverse
            transition
            hover:bg-primary-dark
            active:scale-[0.98]
          "
        >
          <Plus size={28} strokeWidth={2} />

          <span>Add {title.replace(/s$/, "")}</span>
        </button>
      </div>

      {/* Rows */}

      <div
        className="
            mt-5
            h-[360px]
            overflow-y-auto
            space-y-1
            px-3
            pb-5
            pr-5
        "
      >
        {items.map((item) => (
          <AttributeRow
            key={item.id}
            item={item}
            showColor={showColor}
            showCategoryIcon={showCategoryIcon}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
};

export default AttributePanel;
