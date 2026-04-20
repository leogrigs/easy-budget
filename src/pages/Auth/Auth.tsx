import { onAuthStateChanged, User } from "firebase/auth";
import React, { useEffect } from "react";
import logo from "../../assets/logo.png";
import GoogleSignIn from "../../components/GoogleSignIn";
import ThemeToggle from "../../components/ThemeToggle";
import { Card, CardContent } from "../../components/ui/card";
import { useLoading } from "../../contexts/LoadingContext";
import { auth } from "../../services/firebase";

interface AuthProps {
  onUserLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onUserLogin }) => {
  const { setLoading } = useLoading();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) onUserLogin(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Easy Budget" className="h-8 w-8" />
          <span className="font-semibold tracking-tight">Easy Budget</span>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 space-y-6 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Easy Budget
              </h1>
              <p className="text-muted-foreground">
                Track your expenses, organize them by category, and understand
                where your money goes.
              </p>
            </div>
            <div className="flex justify-center">
              <GoogleSignIn onUserLogin={onUserLogin} />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Auth;
