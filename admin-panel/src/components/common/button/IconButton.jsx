import Spinner from "./Spinner";

export const IconButton = ({
  icon,
  loading,
  disabled,
  className = "",
  ...props
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={`w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 ${className}`}
      {...props}>
      {loading ? <Spinner /> : icon}
    </button>
  );
};
