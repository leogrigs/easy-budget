// src/components/GoogleSignIn.tsx
import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../services/firebase";
import { User } from "../../interfaces/User.interface";

interface GoogleSignInProps {
  onUserLogin: (user: User) => void;
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({ onUserLogin }) => {
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("result", result);

      const user = result.user;

      const userData: User = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        lastLogin: new Date(),
      };

      onUserLogin(userData); // Pass user data to parent
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
