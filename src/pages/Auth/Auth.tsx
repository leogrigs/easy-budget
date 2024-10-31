import { onAuthStateChanged, User } from "firebase/auth";
import React, { useEffect } from "react";
import GoogleSignIn from "../../components/GoogleSignIn";
import { auth } from "../../services/firebase";
import { initializeUserDocument } from "../../services/firestore";

interface AuthProps {
  onUserLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onUserLogin }) => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        onUserLogin(currentUser);
        await initializeUserDocument(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="my-4">
      <GoogleSignIn onUserLogin={onUserLogin} />
    </div>
  );
};

export default Auth;
