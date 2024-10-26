import React from "react";

const NoResults: React.FC = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-2">
      <img
        className="size-1/2 mb-2"
        src="https://img.freepik.com/free-vector/no-data-concept-illustration_114360-2506.jpg"
        alt="no results"
      />
      <h3 className="leading-snug tracking-normal text-center text-slate-600 mx-auto w-full text-xl max-w-lg lg:max-w-2xl lg:text-3xl">
        No records!
      </h3>
      <p className="font-normal leading-relaxed mx-auto text-slate-500 lg:text-lg text-base max-w-3xl">
        Please try to change your search criteria or add a new record.
      </p>
    </div>
  );
};

export default NoResults;
