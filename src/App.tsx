import { User } from "firebase/auth";
import { useState } from "react";
import "./App.css";
import logo from "./assets/logo.png";
import Loader from "./components/Loader";
import ThemeToggle from "./components/ThemeToggle";
import { useLoading } from "./contexts/LoadingContext";
import Auth from "./pages/Auth";
import System from "./pages/System";
import { auth } from "./services/firebase";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const { isLoading, setLoading } = useLoading();

  const logout = async () => {
    setLoading(true);
    await auth.signOut();
    setUser(null);
    setLoading(false);
  };

  return (
    <>
      <div className="h-screen flex flex-col bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-gray-800">
        {/* Header */}
        <header className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 py-4 px-8 shadow-md">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Easy Budget Logo" className="h-12" />
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Easy Budget
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {user && (
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 dark:bg-teal-500 rounded-md hover:bg-teal-500 dark:hover:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400 dark:focus:ring-offset-gray-800"
                onClick={logout}
              >
                Logout
              </button>
            )}
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-grow flex px-8">
          {/* Check if user is authenticated */}
          {!user ? <Auth onUserLogin={setUser} /> : <System user={user} />}
        </div>
      </div>

      {isLoading && <Loader />}
    </>
  );
}

export default App;
