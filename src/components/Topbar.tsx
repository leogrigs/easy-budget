import { User } from "firebase/auth";
import { LogOut, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import ThemeToggle from "./ThemeToggle";
import Sidebar from "./Sidebar";

interface TopbarProps {
  user: User;
  onLogout: () => void;
}

const ROUTE_TITLES: Record<string, string> = {
  "/expenses": "Expenses",
  "/categories": "Categories",
  "/settings": "Settings",
};

const Topbar = ({ user, onLogout }: TopbarProps) => {
  const { pathname } = useLocation();
  const title = ROUTE_TITLES[pathname] ?? "Easy Budget";
  const initial = (user.displayName ?? user.email ?? "?")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <header className="h-16 shrink-0 flex items-center gap-2 px-4 sm:px-6 lg:px-8 border-b border-border bg-background/80 backdrop-blur">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Sidebar variant="sheet" />
        </SheetContent>
      </Sheet>

      <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      <div className="flex-1" />
      <ThemeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="Account menu"
          >
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt=""
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <span className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                {initial}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span className="text-sm font-medium truncate">
                {user.displayName ?? "Signed in"}
              </span>
              {user.email && (
                <span className="text-xs text-muted-foreground truncate">
                  {user.email}
                </span>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={onLogout} className="text-destructive">
            <LogOut className="h-4 w-4" /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default Topbar;
