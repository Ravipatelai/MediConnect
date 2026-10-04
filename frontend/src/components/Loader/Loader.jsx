import React from 'react';

const Loader = ({ size = "md", color = "blue" }) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  };

  return (
    <div className="flex items-center justify-center py-8">
      <div
        role="status"
        className={`animate-spin rounded-full border-4 border-${color}-500 border-t-transparent ${sizeClasses[size]}`}
      />
    </div>
  );
};

export default Loader;
