const VARIANT_STYLES = {
  primary: "bg-primary text-text-inverse hover:bg-primary-dark",
  secondary:
    "bg-transparent border border-primary text-primary hover:bg-primary hover:text-text-inverse",
};

const Button = ({
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  onClick,
  className = "",
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg px-6 py-3 text-label-lg font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2";

  const disabledStyles =
    "disabled:bg-neutral-300 disabled:text-text-inverse disabled:border-neutral-300 disabled:cursor-not-allowed disabled:hover:bg-neutral-300";

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${VARIANT_STYLES[variant]} ${disabledStyles} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
