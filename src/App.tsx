import { User } from "firebase/auth";
import { useState } from "react";
import "./App.css";
import Auth from "./pages/Auth";
import System from "./pages/System";
import { auth } from "./services/firebase";

function App() {
  const [user, setUser] = useState<User | null>(null);

  const logout = async () => {
    await auth.signOut();
    setUser(null);
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
    </>
  );
}

export default App;
