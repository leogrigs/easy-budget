import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import AppShell from "./components/AppShell";
import Loader from "./components/Loader";
import { Toaster } from "./components/ui/sonner";
import { useLoading } from "./contexts/LoadingContext";
import Auth from "./pages/Auth";
import System from "./pages/System";
import { auth } from "./services/firebase";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const { isLoading, setLoading } = useLoading();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    setLoading(true);
    await auth.signOut();
    setUser(null);
    setLoading(false);
  };

  if (!authReady) {
    return <Loader />;
  }

  return (
    <>
      {user ? (
        <Routes>
          <Route element={<AppShell user={user} onLogout={logout} />}>
            <Route index element={<Navigate to="/expenses" replace />} />
            <Route path="/expenses" element={<System user={user} />} />
            <Route
              path="/categories"
              element={<div className="p-4">Categories (coming soon)</div>}
            />
            <Route
              path="/settings"
              element={<div className="p-4">Settings (coming soon)</div>}
            />
            <Route path="*" element={<Navigate to="/expenses" replace />} />
          </Route>
        </Routes>
      ) : (
        <Auth onUserLogin={setUser} />
      )}

      {isLoading && <Loader />}
      <Toaster />
    </>
  );
}

export default App;
