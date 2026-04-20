import { ReactNode, useEffect, useState } from "react";
import { cn } from "../lib/utils";

interface SelectionActionBarProps {
  visible: boolean;
  children: ReactNode;
}

/**
 * Floating toolbar that slides up from the bottom when `visible` is true.
 * Stays mounted through the exit transition so the fade-out isn't cut.
 * Does not take layout space — sits over page content.
 */
const SelectionActionBar = ({ visible, children }: SelectionActionBarProps) => {
  const [mounted, setMounted] = useState(visible);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      return;
    }
    const t = setTimeout(() => setMounted(false), 200);
    return () => clearTimeout(t);
  }, [visible]);

  if (!mounted && !visible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4">
      <div
        className={cn(
          "pointer-events-auto transition-all duration-200 ease-out will-change-transform",
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
        )}
      >
        <div className="flex items-center gap-2 rounded-full border border-border bg-card/95 backdrop-blur-md shadow-lg px-2 py-1.5 min-w-[18rem]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SelectionActionBar;
