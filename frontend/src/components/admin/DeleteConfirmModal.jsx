import { AlertTriangle } from "lucide-react";

const DeleteConfirmModal = ({ isOpen, item, onClose, onConfirm }) => {
  if (!isOpen || !item) {
    return null;
  }

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
          w-full
          max-w-[400px]
          rounded-lg
          border
          border-[#B8C2CC]
          bg-[#F8FAFC]
          px-[18px]
          pb-[34px]
          pt-[35px]
          shadow-[0_4px_12px_rgba(0,0,0,0.12)]
        "
      >
        {/* TITLE */}

        <h2
          className="
            m-0
            text-[23px]
            font-bold
            leading-[30px]
            text-black
          "
        >
          Delete this value?
        </h2>

        {/* DESCRIPTION */}

        <p
          className="
            mt-[10px]
            mb-0
            text-[14px]
            leading-[20px]
            text-black
          "
        >
          "{item.name}" is currently used by{" "}
          <span className="font-medium">{item.itemCount ?? 0}</span> items.
        </p>

        {/* WARNING */}

        <div
          className="
            mt-[17px]
            flex
            min-h-[62px]
            items-center
            justify-center
            rounded-lg
            bg-[#FBE8C8]
            px-5
            py-2
            text-center
            text-[16px]
            leading-[23px]
            text-black
          "
        >
          <p className="m-0">
            Those items will be reassigned to "Other" automatically — they won't
            be deleted.
          </p>
        </div>

        {/* BUTTONS */}

        <div
          className="
            mt-[12px]
            flex
            justify-center
            gap-[15px]
          "
        >
          {/* CANCEL */}

          <button
            type="button"
            onClick={onClose}
            className="
              h-[45px]
              min-w-[152px]
              rounded-lg
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

          {/* DELETE */}

          <button
            type="button"
            onClick={() => onConfirm(item)}
            className="
              h-[45px]
              min-w-[150px]
              rounded-lg
              bg-[#E3262E]
              px-5
              text-[16px]
              font-normal
              text-white
              transition
              hover:bg-[#C91E26]
            "
          >
            Delete & Resigned
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
