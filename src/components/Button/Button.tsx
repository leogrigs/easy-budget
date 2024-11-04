import React from "react";

interface ButtonProps {
  label?: string;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  icon,
  disabled = false,
}) => {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={`flex items-center justify-center transition duration-300 ease-in-out 
        bg-transparent border text-slate-700 dark:text-slate-300 
        border-slate-300 dark:border-slate-600 shadow-sm focus:outline-none 
        ${
          disabled
            ? "bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed"
            : "hover:border-slate-400 hover:dark:border-teal-500 focus:ring-1 focus:ring-teal-500"
        } ${label ? "w-full rounded-md py-2 px-4" : "rounded-full p-2"}`}
      disabled={disabled}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {label && <span className="text-sm text-nowrap">{label}</span>}
    </button>
  );
};

export default Button;
