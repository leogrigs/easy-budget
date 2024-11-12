import React from "react";

const Input: React.FC<{
  name: string;
  value: string | number;
  type?: string;
  onChange: (name: string, value: string | number) => void;
  placeholder?: string;
}> = ({ name, type = "text", value, onChange, placeholder }) => {
  const getInputValue = (value: string): string | number => {
    if (type === "number") return Number(value);
    return value;
  };

  return (
    <input
      name={name}
      type={type}
      className={`w-full bg-transparent placeholder:text-slate-400 text-sm rounded-md px-4 py-2 transition duration-300 ease-in-out focus:outline-none 
  border shadow-sm 
  ${value ? "text-slate-700" : "text-slate-400"} 
  border-slate-300 focus:border-teal-500 hover:border-slate-400 
  dark:text-slate-300 dark:placeholder:text-slate-400 
  dark:border-slate-600 dark:focus:border-teal-500 dark:hover:border-teal-500 appearance-none`}
      value={value}
      onChange={(e) => onChange(e.target.name, getInputValue(e.target.value))}
      placeholder={placeholder}
    />
  );
};

export default Input;
