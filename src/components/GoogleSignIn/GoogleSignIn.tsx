import React from "react";
import { signInWithPopup, User } from "firebase/auth";
import { auth, googleProvider } from "../../services/firebase";

interface GoogleSignInProps {
  onUserLogin: (user: User) => void;
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({ onUserLogin }) => {
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onUserLogin(result.user);
    } catch (error) {
      console.error("Google sign-in error", error);
    }
  };

  return (
    <button
      onClick={signInWithGoogle}
      className="bg-blue-500 text-white px-4 py-2 rounded-md"
    >
      Sign in with Google
    </button>
  );
};

export default GoogleSignIn;
