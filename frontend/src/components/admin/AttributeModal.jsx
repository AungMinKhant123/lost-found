import { useEffect, useState } from "react";
import { X } from "lucide-react";

const AttributeModal = ({
  isOpen,
  onClose,
  onSave,
  type = "colour",
  editingItem = null,
}) => {
  const isColour = type === "colour";

  const [name, setName] = useState("");
  const [color, setColor] = useState("#000000");

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name || "");
      setColor(editingItem.color || "#000000");
    } else {
      setName("");
      setColor("#000000");
    }
  }, [editingItem, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    const data = {
      name: name.trim(),
    };

    if (isColour) {
      data.color = color;
    }

    onSave(data);
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/10
        px-5
      "
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="
          relative
          w-full
          max-w-[465px]
          rounded-lg
          border
          border-[#B8C2CC]
          bg-[#F8FAFC]
          px-[49px]
          pb-[24px]
          pt-[25px]
          shadow-[0_4px_12px_rgba(0,0,0,0.12)]
        "
      >
        {/* Close */}

        <button
          type="button"
          onClick={onClose}
          className="
            absolute
            right-4
            top-4
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            text-gray-500
            transition
            hover:bg-gray-200
            hover:text-black
          "
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Title */}

        <h2
          className="
            m-0
            text-[23px]
            font-bold
            leading-[30px]
            text-black
          "
        >
          {editingItem
            ? `Edit ${isColour ? "Colour" : "Category"}`
            : `Add ${isColour ? "Colour" : "Category"}`}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Label */}

          <label
            htmlFor="attribute-name"
            className="
              mt-[12px]
              block
              text-[16px]
              font-normal
              text-black
            "
          >
            {isColour ? "Color Name" : "Category Name"}
          </label>

          {/* Colour input */}

          {isColour ? (
            <div className="mt-[11px]">
              <div
                className="
                  flex
                  h-[58px]
                  w-full
                  items-center
                  justify-center
                  gap-3
                  rounded-md
                  border
                  border-[#B8C2CC]
                  bg-transparent
                "
              >
                {/* Native color picker */}

                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="
                    h-[29px]
                    w-[37px]
                    cursor-pointer
                    appearance-none
                    rounded-[4px]
                    border-0
                    bg-transparent
                    p-0
                  "
                  aria-label="Choose colour"
                />

                {/* Colour name */}

                <input
                  id="attribute-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Black"
                  className="
                    w-[150px]
                    border-none
                    bg-transparent
                    text-[23px]
                    font-semibold
                    text-black
                    outline-none
                    placeholder:text-black
                  "
                />
              </div>
            </div>
          ) : (
            /* Category input */

            <input
              id="attribute-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
              autoFocus
              className="
                mt-[11px]
                h-[58px]
                w-full
                rounded-md
                border
                border-[#B8C2CC]
                bg-transparent
                px-4
                text-[17px]
                text-black
                outline-none
                focus:border-primary
                focus:ring-1
                focus:ring-primary
              "
            />
          )}

          {/* Buttons */}

          <div className="mt-[15px] flex justify-center gap-[15px]">
            <button
              type="button"
              onClick={onClose}
              className="
                h-[43px]
                min-w-[108px]
                rounded-md
                border
                border-[#B8C2CC]
                bg-transparent
                px-5
                text-[16px]
                font-normal
                text-black
                transition
                hover:bg-gray-100
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!name.trim()}
              className="
                h-[43px]
                min-w-[106px]
                rounded-md
                bg-primary
                px-5
                text-[16px]
                font-normal
                text-text-inverse
                transition
                hover:bg-primary-dark
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttributeModal;
