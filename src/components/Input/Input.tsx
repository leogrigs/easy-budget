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
      className={`w-full bg-transparent placeholder:text-slate-400 text-sm rounded-md px-3 py-2 transition duration-300 ease focus:outline-none 
      border shadow-sm 
      ${value ? "text-slate-700" : "text-slate-400"} 
      border-slate-200 focus:border-slate-400 hover:border-slate-300 
      dark:text-slate-300 dark:placeholder:text-slate-500 
      dark:border-slate-600 dark:focus:border-slate-500 dark:hover:border-slate-500 dark:bg-slate-800 appearance-none`}
      value={value}
      onChange={(e) => onChange(e.target.name, getInputValue(e.target.value))}
      placeholder={placeholder}
      style={{
        // This will remove the default calendar icon
        background: "none",
        color: "inherit",
      }}
    />
  );
};

export default Input;
