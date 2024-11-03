import { signInWithPopup, User } from "firebase/auth";
import React from "react";
import googleImage from "../../assets/google.svg";
import { auth, googleProvider } from "../../services/firebase";
import Button from "../Button";

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
    <Button
      label="Continue with Google"
      onClick={signInWithGoogle}
      icon={<img className="h-6 w-6 mr-2" src={googleImage} />}
    />
  );
};

export default GoogleSignIn;
