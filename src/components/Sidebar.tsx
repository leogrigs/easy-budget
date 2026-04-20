import { BarChart3, Folder, Receipt, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import { cn } from "../lib/utils";

const NAV = [
  { to: "/expenses", label: "Expenses", icon: Receipt },
  { to: "/insights", label: "Insights", icon: BarChart3 },
  { to: "/categories", label: "Categories", icon: Folder },
  { to: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  variant?: "rail" | "sheet";
}

const Sidebar = ({ variant = "rail" }: SidebarProps) => {
  const containerClass =
    variant === "rail"
      ? "hidden md:flex md:w-60 shrink-0 flex-col border-r border-border bg-card"
      : "flex w-full h-full flex-col";

  return (
    <aside className={containerClass}>
      <div className="flex items-center gap-2 h-16 px-6 border-b border-border">
        <Logo size={28} />
        <span className="font-semibold tracking-tight">Easy Budget</span>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
