import { User } from "firebase/auth";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface AppShellProps {
  user: User;
  onLogout: () => void;
}

const AppShell = ({ user, onLogout }: AppShellProps) => {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar user={user} onLogout={onLogout} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <div
            key={pathname}
            className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppShell;
