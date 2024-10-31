import { onAuthStateChanged, User } from "firebase/auth";
import React, { useEffect } from "react";
import GoogleSignIn from "../../components/GoogleSignIn";
import { useLoading } from "../../contexts/LoadingContext";
import { auth } from "../../services/firebase";
import { initializeUserDocument } from "../../services/firestore";

interface AuthProps {
  onUserLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onUserLogin }) => {
  const { setLoading } = useLoading();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        onUserLogin(currentUser);
        await initializeUserDocument(currentUser.uid);
      }
    });
    setLoading(false);
    return () => unsubscribe();
  }, []);

  return (
    <div className="my-4">
      <GoogleSignIn onUserLogin={onUserLogin} />
    </div>
  );
};

export default Auth;
