import {
  Book,
  Briefcase,
  Car,
  Coffee,
  Dog,
  Dumbbell,
  Gift,
  GraduationCap,
  HeartPulse,
  Home,
  LucideIcon,
  Package,
  PiggyBank,
  Plane,
  Popcorn,
  ShoppingBag,
  Smartphone,
  UtensilsCrossed,
  Wrench,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  UtensilsCrossed,
  Car,
  Home,
  Popcorn,
  HeartPulse,
  Package,
  ShoppingBag,
  Plane,
  Book,
  Coffee,
  Gift,
  Dumbbell,
  Briefcase,
  GraduationCap,
  Wrench,
  PiggyBank,
  Smartphone,
  Dog,
};

export const AVAILABLE_ICONS = Object.keys(ICON_MAP);

interface CategoryIconProps {
  name: string;
  className?: string;
}

export const CategoryIcon = ({ name, className }: CategoryIconProps) => {
  const Icon = ICON_MAP[name] ?? Package;
  return <Icon className={className} />;
};
