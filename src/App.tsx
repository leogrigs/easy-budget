import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import AppShell from "./components/AppShell";
import FullScreenLoader from "./components/FullScreenLoader";
import { Toaster } from "./components/ui/sonner";
import { useLoading } from "./contexts/LoadingContext";
import Auth from "./pages/Auth";
import Categories from "./pages/Categories";
import Expenses from "./pages/Expenses";
import Insights from "./pages/Insights";
import Settings from "./pages/Settings";
import { auth } from "./services/firebase";
import { migrateUserIfNeeded } from "./services/migration";
import { materializePendingRecurring } from "./services/recurring";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const { isLoading, setLoading } = useLoading();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          await migrateUserIfNeeded(currentUser.uid);
          await materializePendingRecurring(currentUser.uid);
        } catch (err) {
          console.error("post-login tasks failed", err);
        }
      }
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
    return <FullScreenLoader />;
  }

  return (
    <>
      {user ? (
        <Routes>
          <Route element={<AppShell user={user} onLogout={logout} />}>
            <Route index element={<Navigate to="/expenses" replace />} />
            <Route path="/expenses" element={<Expenses uid={user.uid} />} />
            <Route path="/insights" element={<Insights uid={user.uid} />} />
            <Route path="/categories" element={<Categories uid={user.uid} />} />
            <Route path="/settings" element={<Settings uid={user.uid} />} />
            <Route path="*" element={<Navigate to="/expenses" replace />} />
          </Route>
        </Routes>
      ) : (
        <Auth onUserLogin={setUser} />
      )}

      {isLoading && <FullScreenLoader />}
      <Toaster />
    </>
  );
}

export default App;
