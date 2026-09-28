const SuccessModal = ({ isOpen, message, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
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
          flex
          min-h-[100px]
          w-full
          max-w-[500px]
          flex-col
          items-center
          justify-center
          gap-4
          rounded-lg
          border
          border-primary
          bg-primary
          px-6
          py-3
          text-center
          shadow-[0_4px_12px_rgba(0,0,0,0.12)]
        "
      >
        <p
          className="
            m-0
            text-[16px]
            font-medium
            leading-6
            text-white
          "
        >
          {message}
        </p> 
      </div>
    </div>
  );
};

export default SuccessModal;
