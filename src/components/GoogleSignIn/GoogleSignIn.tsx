import { signInWithPopup, User } from "firebase/auth";
import googleImage from "../../assets/google.svg";
import { auth, googleProvider } from "../../services/firebase";
import { Button } from "../ui/button";

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
      variant="outline"
      size="lg"
      onClick={signInWithGoogle}
      className="w-full"
    >
      <img src={googleImage} alt="" className="h-5 w-5" />
      Continue with Google
    </Button>
  );
};

export default GoogleSignIn;
