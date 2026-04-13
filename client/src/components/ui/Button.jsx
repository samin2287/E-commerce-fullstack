import React from "react";

const variants = {
  primary:
    "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-600/20",
  secondary:
    "bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50",
  outline:
    "border border-zinc-300 bg-transparent text-zinc-800 hover:border-emerald-400 hover:text-emerald-800",
  ghost: "text-zinc-700 hover:bg-emerald-50 hover:text-emerald-900",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-4 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3 text-base rounded-xl",
};

export default function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  type = "button",
  disabled,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:pointer-events-none disabled:opacity-50 ${variants[variant] ?? variants.primary} ${sizes[size] ?? sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
