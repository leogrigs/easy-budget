import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="bg-white/85 fixed top-0 left-0 flex justify-center items-center h-screen w-screen">
      <div className="rounded-md h-8 w-8 border-4 border-t-4 border-blue-200 bg-blue-500 animate-spin absolute"></div>
    </div>
  );
};

export default Loader;
