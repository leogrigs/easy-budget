import { onAuthStateChanged, User } from "firebase/auth";
import {
  BarChart3,
  Filter,
  Folder,
  Receipt,
  Repeat,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import React, { useEffect } from "react";
import logo from "../../assets/logo.png";
import GoogleSignIn from "../../components/GoogleSignIn";
import ThemeToggle from "../../components/ThemeToggle";
import { useLoading } from "../../contexts/LoadingContext";
import { auth } from "../../services/firebase";

interface AuthProps {
  onUserLogin: (user: User) => void;
}

const FEATURES = [
  {
    Icon: Receipt,
    title: "Fast entry",
    body: "Log an expense in seconds. Search, filter, sort, edit — no friction.",
  },
  {
    Icon: Folder,
    title: "Your categories",
    body: "Build a palette that fits your life. Colors, icons, easy reassignment.",
  },
  {
    Icon: Filter,
    title: "Powerful filters",
    body: "Combine date ranges, categories, and text search. See what you spent.",
  },
  {
    Icon: Repeat,
    title: "Recurring expenses",
    body: "Set it once. Easy Budget keeps the ledger honest automatically.",
  },
  {
    Icon: Upload,
    title: "CSV in & out",
    body: "Import a year of expenses. Export filtered rows. Your data, your rules.",
  },
  {
    Icon: ShieldCheck,
    title: "Yours only",
    body: "Firestore security rules scoped to your account. Nobody else sees a thing.",
  },
];

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
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <BackgroundDecor />

      <header className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-4">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Easy Budget" className="h-8 w-8" />
          <span className="font-semibold tracking-tight">Easy Budget</span>
        </div>
        <ThemeToggle />
      </header>

      <main className="relative z-10">
        <section className="mx-auto max-w-6xl px-6 lg:px-12 pt-10 pb-20 lg:pt-20 lg:pb-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 fill-mode-both">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                The expense tracker that respects your time
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
                Know exactly{" "}
                <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
                  where your money
                </span>{" "}
                goes.
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Easy Budget is a focused, minimalist expense tracker. No
                complicated flows, no income side-quests — just the cleanest
                way to log spending, organize it your way, and understand the
                pattern.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <div className="w-full sm:w-auto">
                  <GoogleSignIn onUserLogin={onUserLogin} />
                </div>
                <span className="text-xs text-muted-foreground">
                  Free. Takes ~10 seconds.
                </span>
              </div>
              <ul className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Dot /> End-to-end private
                </li>
                <li className="flex items-center gap-2">
                  <Dot /> No credit card
                </li>
                <li className="flex items-center gap-2">
                  <Dot /> Works on mobile
                </li>
              </ul>
            </div>

            <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
              <DashboardPreview />
            </div>
          </div>
        </section>

        <section className="relative bg-muted/30 border-y border-border py-20">
          <div className="mx-auto max-w-6xl px-6 lg:px-12">
            <div className="max-w-2xl mb-10 space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight">
                Everything you need. Nothing you don&apos;t.
              </h2>
              <p className="text-muted-foreground">
                Built around the idea that a budget app should stay out of your
                way. Powerful when you need it, quiet the rest of the time.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(({ Icon, title, body }, i) => (
                <div
                  key={title}
                  className="rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-md animate-in fade-in-0 slide-in-from-bottom-3 duration-500 fill-mode-both"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-20">
          <div className="mx-auto max-w-3xl px-6 lg:px-12 text-center space-y-6">
            <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Start tracking in 10 seconds.
            </h2>
            <p className="text-muted-foreground">
              Sign in with Google, get your default categories, log your first
              expense. That&apos;s it.
            </p>
            <div className="flex justify-center pt-2">
              <div className="w-full sm:w-auto max-w-xs">
                <GoogleSignIn onUserLogin={onUserLogin} />
              </div>
            </div>
          </div>
        </section>

        <footer className="relative z-10 border-t border-border py-8">
          <div className="mx-auto max-w-6xl px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <img src={logo} alt="" className="h-5 w-5" />
              <span>
                © {new Date().getFullYear()} Easy Budget. Built with React +
                Firebase.
              </span>
            </div>
            <span>Your data stays in your Firestore account.</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

const Dot = () => (
  <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
);

const BackgroundDecor = () => (
  <>
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.15] dark:opacity-[0.08]"
      style={{
        backgroundImage:
          "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    />
    <div
      aria-hidden
      className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[700px] w-[1100px] rounded-full blur-3xl opacity-30 dark:opacity-40"
      style={{
        background:
          "radial-gradient(closest-side, hsl(var(--primary) / 0.35), transparent)",
      }}
    />
    <div
      aria-hidden
      className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[600px] rounded-full blur-3xl opacity-20 dark:opacity-30"
      style={{
        background:
          "radial-gradient(closest-side, hsl(var(--primary) / 0.25), transparent)",
      }}
    />
  </>
);

const DashboardPreview = () => {
  const rows = [
    { name: "Grocery run", amount: "R$ 184,20", cat: "Food", color: "#eab308" },
    { name: "Uber", amount: "R$ 42,00", cat: "Transport", color: "#06b6d4" },
    { name: "Rent", amount: "R$ 1.850,00", cat: "Housing", color: "#8b5cf6" },
    { name: "Cinema", amount: "R$ 55,00", cat: "Entertainment", color: "#ec4899" },
    { name: "Pharmacy", amount: "R$ 32,50", cat: "Health", color: "#10b981" },
  ];
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-primary/20 to-transparent blur-2xl"
      />
      <div className="relative rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
        <div className="flex items-center gap-1.5 px-4 h-9 border-b border-border bg-muted/50">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
          <span className="ml-3 text-xs text-muted-foreground">
            Expenses · April 2026
          </span>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <KpiCard label="Total spent" value="R$ 2.163,70" />
            <KpiCard label="Entries" value="5" />
            <KpiCard label="Avg / entry" value="R$ 432,74" />
          </div>
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="px-4 py-2 text-xs text-muted-foreground border-b border-border bg-muted/30 grid grid-cols-[1fr_auto_auto] gap-4">
              <span>Name</span>
              <span>Category</span>
              <span className="text-right">Amount</span>
            </div>
            {rows.map((r, i) => (
              <div
                key={i}
                className="px-4 py-2 text-sm grid grid-cols-[1fr_auto_auto] gap-4 items-center border-b last:border-b-0 border-border"
              >
                <span className="font-medium truncate">{r.name}</span>
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor: `${r.color}22`,
                    color: r.color,
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: r.color }}
                  />
                  {r.cat}
                </span>
                <span className="text-right font-medium tabular-nums">
                  {r.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const KpiCard = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border border-border bg-background p-3">
    <div className="text-xs text-muted-foreground">{label}</div>
    <div className="mt-1 text-lg font-semibold tracking-tight">{value}</div>
  </div>
);

export default Auth;
