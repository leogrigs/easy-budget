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
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <main className="flex-grow px-8 flex items-center justify-center">
      {/* Hero Section */}
      <section className="max-w-4xl flex flex-col gap-8 justify-center mx-auto text-center">
        <h2 className="font-extrabold text-slate-800 lg:text-7xl md:text-6xl leading-tight">
          Want to start managing your budget?
          <span className="block lg:text-5xl mt-4">
            <span className="text-teal-600">Easy Budget </span>
            is the app for you!
          </span>
        </h2>
        <h3 className="text-slate-500 lg:text-xl max-w-3xl mx-auto font-medium">
          Track your income and expenses, view all transactions, and understand
          how your spending is divided.
        </h3>
        <div className="mt-6 flex justify-center">
          <GoogleSignIn onUserLogin={onUserLogin} />
        </div>
      </section>
    </main>
  );
};

export default Auth;
