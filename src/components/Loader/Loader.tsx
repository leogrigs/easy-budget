import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen w-screen fixed top-0 left-0 z-50 bg-gray-900/90 dark:bg-gray-800/90">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-teal-500 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 rounded-full bg-teal-500 shadow-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
