import React from "react";

const NoResults: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full p-4 space-y-4">
      <img
        className="w-48 max-w-xs mb-4 bg-slate-100 dark:bg-slate-800 p-4 rounded-full"
        src="https://cdn-icons-png.flaticon.com/512/7409/7409366.png"
        alt="no results"
      />
      <h3 className="text-center text-slate-800 dark:text-slate-200 text-xl lg:text-3xl font-semibold leading-snug">
        No Records Found!
      </h3>
      <p className="text-center text-slate-600 dark:text-slate-400 text-base lg:text-lg max-w-3xl">
        Please adjust your search criteria or add a new record to get started.
      </p>
    </div>
  );
};

export default NoResults;
