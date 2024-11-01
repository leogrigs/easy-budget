import { signInWithPopup, User } from "firebase/auth";
import React from "react";
import googleImage from "../../assets/google.svg";
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
      className="flex items-center bg-white border rounded-lg shadow-md px-6 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
    >
      <img className="h-6 w-6 mr-2" src={googleImage} />
      <span>Continue with Google</span>
    </button>
  );
};

export default GoogleSignIn;
