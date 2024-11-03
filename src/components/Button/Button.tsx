import React from "react";

interface ButtonProps {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, icon, disabled }) => {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={`flex items-center justify-center gap-2 rounded-md border 
        bg-transparent text-nowrap text-slate-700 dark:text-slate-300 
        border-slate-300 dark:border-slate-600 
        py-2 px-4 transition duration-300 ease-in-out 
        shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 
        disabled:opacity-40 disabled:cursor-not-allowed 
        ${
          disabled
            ? "bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400"
            : "hover:border-slate-400 hover:dark:border-teal-500"
        }`}
      disabled={disabled}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="text-sm">{label}</span>
    </button>
  );
};

export default Button;
