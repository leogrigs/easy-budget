import React from "react";
import { InputOptions } from "../../interfaces/InputOptions.interface";

type OptionProps = {
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  options: InputOptions[];
};

const Select: React.FC<OptionProps> = ({ name, value, onChange, options }) => {
  return (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.name, e.target.value)}
        className={`w-full bg-transparent text-sm border rounded-md pl-4 pr-10 py-2 transition duration-300 ease-in-out focus:outline-none 
      placeholder:text-slate-400 text-slate-700 
      border-slate-300 
      focus:border-teal-500 
      hover:border-slate-400 
      shadow-sm focus:shadow-md appearance-none cursor-pointer 
      dark:text-slate-300 dark:placeholder:text-slate-500 
      dark:border-slate-600 dark:focus:border-teal-500 dark:hover:border-teal-500 
      dark:bg-slate-800`}
      >
        {options.map((option) => (
          <option key={option.id} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="h-5 w-5 ml-1 absolute top-2.5 right-2.5 text-slate-700 dark:text-slate-300"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25l3.75 3.75"
        />
      </svg>
    </div>
  );
};

export default Select;
