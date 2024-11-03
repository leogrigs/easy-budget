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
    <main className="flex-grow flex items-baseline md:items-center justify-center px-4 sm:px-6 md:px-8">
      {/* Hero Section */}
      <section className="max-w-3xl md:max-w-4xl lg:max-w-5xl flex flex-col gap-6 md:gap-12 justify-center mx-auto text-center">
        <h2 className="font-extrabold text-slate-800 dark:text-slate-100 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight">
          Want to start managing your budget?
          <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl mt-6 md:mt-10 text-slate-800 dark:text-slate-100">
            <span className="text-teal-600 dark:text-teal-400">
              Easy Budget{" "}
            </span>
            is the app for you!
          </span>
        </h2>
        <h3 className="text-slate-500 dark:text-slate-400 text-base sm:text-lg md:text-xl max-w-2xl lg:max-w-3xl mx-auto font-medium">
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
