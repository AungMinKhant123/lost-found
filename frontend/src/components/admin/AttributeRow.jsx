import { Pencil, Trash2 } from "lucide-react";
import { getCategoryIcon } from "../../utils/categoryIcons";
import { isFallbackAttribute } from "../../services/api";

// One row in the Colours or Categories list. variant decides whether the
// left side shows a colour swatch or a category icon.
const AttributeRow = ({ variant, attribute, itemCount, onEdit, onDelete }) => {
  const isColour = variant === "colours";
  const isProtected = isFallbackAttribute(attribute.name);
  const Icon = getCategoryIcon(attribute.icon);

  return (
    <div className="flex items-center gap-3.5 px-2 py-2 border-b border-border/40 last:border-b-0 hover:bg-neutral-50/50 rounded-lg transition-colors">
      {isColour ? (
        <div
          className="w-8 h-8 rounded-md shrink-0 border border-border shadow-sm"
          style={{ backgroundColor: attribute.hex }}
        />
      ) : (
        <div className="w-8 h-8 shrink-0 flex items-center justify-center">
          <Icon size={20} strokeWidth={1.75} className="text-primary-dark" />
        </div>
      )}

      <p className="flex-1 min-w-0 truncate text-[18px] font-semibold text-text-primary">
        {attribute.name}
      </p>

      <span className="shrink-0 rounded-full bg-primary/15 px-3.5 py-1 text-center text-body-sm font-medium text-text-primary mr-4">
        {itemCount} {itemCount === 1 ? "item" : "items"}
      </span>

      <button
        type="button"
        onClick={onDelete}
        disabled={isProtected}
        aria-label={`Delete ${attribute.name}`}
        title={
          isProtected
            ? `"${attribute.name}" is the fallback value and can't be deleted`
            : `Delete ${attribute.name}`
        }
        className="w-8 h-8 shrink-0 flex items-center justify-center rounded-md border border-border-strong text-text-primary transition-colors hover:bg-error/10 hover:text-error disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-text-primary"
      >
        <Trash2 size={16} />
      </button>

      <button
        type="button"
        onClick={onEdit}
        aria-label={`Edit ${attribute.name}`}
        title={`Edit ${attribute.name}`}
        className="w-8 h-8 shrink-0 flex items-center justify-center rounded-md border border-border-strong text-text-primary transition-colors hover:bg-background-subtle hover:text-primary"
      >
        <Pencil size={16} />
      </button>
    </div>
  );
};

export default AttributeRow;
