// src/components/ui/Card.jsx
export const Card = ({ children, className = "", title, ...props }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md border border-gray-200 ${className}`}
      {...props}
    >
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};
