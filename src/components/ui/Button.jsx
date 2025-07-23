// src/components/ui/Button.jsx
export const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  className = "",
  ...props
}) => {
  const baseClasses =
    "relative inline-flex items-center justify-center font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group";

  const variants = {
    primary:
      "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg hover:shadow-emerald-500/25 focus:ring-emerald-500 hover:scale-105 transform",
    secondary:
      "bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white shadow-lg hover:shadow-slate-500/25 focus:ring-slate-500 hover:scale-105 transform",
    outline:
      "border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white backdrop-blur-sm focus:ring-emerald-500 hover:scale-105 transform shadow-lg hover:shadow-emerald-500/25",
    danger:
      "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-red-500/25 focus:ring-red-500 hover:scale-105 transform",
    ghost:
      "text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:ring-gray-500",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const shimmerEffect =
    variant === "primary" || variant === "secondary" ? (
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
    ) : null;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {shimmerEffect}
      <span className="relative z-10 flex items-center">
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Chargement...
          </>
        ) : (
          children
        )}
      </span>
    </button>
  );
};

// src/components/ui/Card.jsx
export const Card = ({ children, className = "", title, ...props }) => {
  return (
    <div
      className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300 ${className}`}
      {...props}
    >
      {title && (
        <div className="px-8 py-6 border-b border-gray-200/50 bg-gradient-to-r from-emerald-50/50 to-green-50/50">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
            {title}
          </h3>
        </div>
      )}
      <div className="p-8">{children}</div>
    </div>
  );
};
