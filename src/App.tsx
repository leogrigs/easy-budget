// App.tsx
import { User } from "firebase/auth";
import { useState } from "react";
import "./App.css";
import Loader from "./components/Loader";
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
      <div className="p-4">
        <div className="border">
          <h1>Easy Budget</h1>
          <button onClick={logout}>Logout</button>
        </div>
        {!user ? <Auth onUserLogin={setUser} /> : <System user={user} />}
      </div>

      {isLoading && <Loader />}
    </>
  );
}

export default App;
