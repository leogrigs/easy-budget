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
      className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
      value={value}
      onChange={(e) => onChange(e.target.name, getInputValue(e.target.value))}
      placeholder={placeholder}
    />
  );
};

export default Input;
