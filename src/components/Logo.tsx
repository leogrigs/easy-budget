import { cn } from "../lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * Inline SVG brand mark — gradient rounded square with ascending bars.
 * Crisp at any size, works in light and dark mode.
 */
const Logo = ({ className, size = 32 }: LogoProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("shrink-0", className)}
    aria-hidden
  >
    <defs>
      <linearGradient id="eb-logo-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="hsl(173 80% 45%)" />
        <stop offset="100%" stopColor="hsl(160 84% 45%)" />
      </linearGradient>
    </defs>
    <rect width="32" height="32" rx="8" fill="url(#eb-logo-bg)" />
    <rect
      x="7"
      y="18"
      width="4"
      height="8"
      rx="1.5"
      fill="white"
      fillOpacity="0.95"
    />
    <rect
      x="14"
      y="13"
      width="4"
      height="13"
      rx="1.5"
      fill="white"
      fillOpacity="0.95"
    />
    <rect
      x="21"
      y="8"
      width="4"
      height="18"
      rx="1.5"
      fill="white"
      fillOpacity="0.95"
    />
  </svg>
);

export default Logo;
