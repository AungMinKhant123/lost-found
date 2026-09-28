import {
  Pencil,
  Trash2,
  Shirt,
  BookOpen,
  Package,
  Watch,
  Cable,
  Handbag,
  Key,
  FileText,
  BookHeart,
} from "lucide-react";

const categoryIcons = {
  accessories: Watch,
  electronics: Cable,
  bags: Handbag,
  clothing: Shirt,
  books: BookOpen,
  other: BookHeart,
  keys: Key,
  documents: FileText,
};

const AttributeRow = ({
  item,
  onEdit,
  onDelete,
  showColor = false,
  showCategoryIcon = false,
}) => {
  const CategoryIcon = categoryIcons[item.name?.toLowerCase()] || Package;

  return (
    <div
      className="
        flex
        min-h-[80px]
        w-full
        items-center
        gap-4
        px-3
        py-2
      "
    >
      {/* Colour preview */}

      {showColor && (
        <div
          className="
            h-[64px]
            w-[64px]
            shrink-0
            rounded-[4px]
            border
            border-border
          "
          style={{
            backgroundColor: item.color,
          }}
        />
      )}

      {/* Category icon */}

      {showCategoryIcon && (
        <div
          className="
            flex
            h-[48px]
            w-[48px]
            shrink-0
            items-center
            justify-center 
          "
        >
          <CategoryIcon
            size={26}
            strokeWidth={2}
            className="text-primary"
          />
        </div>
      )}

      {/* Name */}

      <div className="min-w-0 flex-1">
        <p
          className="
            m-0
            truncate
            text-[27px]
            font-semibold
            leading-8
            text-text-primary
          "
        >
          {item.name}
        </p>
      </div>

      {/* Item count */}

      <div
        className="
          hidden
          min-w-[124px]
          rounded-full
          bg-[#DED8FF]
          px-5
          py-2
          text-center
          text-body-sm
          font-normal
          text-text-primary
          sm:block
        "
      >
        {item.itemCount} {item.itemCount === 1 ? "item" : "items"}
      </div>

      {/* Edit */}

      <button
        type="button"
        onClick={() => onEdit?.(item)}
        aria-label={`Edit ${item.name}`}
        className="
          flex
          h-[46px]
          w-[46px]
          shrink-0
          items-center
          justify-center
          rounded-md
          border
          border-[#8191A3]
          bg-transparent
          text-text-primary
          transition
          hover:bg-[#F1F3F5]
          hover:text-primary
        "
      >
        <Pencil size={27} strokeWidth={2} />
      </button>

      {/* Delete */}

      <button
        type="button"
        onClick={() => onDelete?.(item)}
        aria-label={`Delete ${item.name}`}
        className="
          flex
          h-[46px]
          w-[46px]
          shrink-0
          items-center
          justify-center
          rounded-md
          border
          border-[#8191A3]
          bg-transparent
          text-text-primary
          transition
          hover:bg-red-50
          hover:text-red-600
        "
      >
        <Trash2 size={27} strokeWidth={2} />
      </button>
    </div>
  );
};

export default AttributeRow;
