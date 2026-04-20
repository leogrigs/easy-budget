import { User } from "firebase/auth";
import { LogOut } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

interface TopbarProps {
  user: User;
  onLogout: () => void;
}

const Topbar = ({ user, onLogout }: TopbarProps) => {
  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-border bg-card/50 backdrop-blur">
      <div className="flex items-center gap-2 md:hidden">
        <span className="font-semibold">Easy Budget</span>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <span className="hidden sm:inline text-sm text-muted-foreground">
          {user.displayName ?? user.email}
        </span>
        <ThemeToggle />
        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
