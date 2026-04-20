import { forwardRef } from "react";
import { cn } from "../lib/utils";
import { Input } from "./ui/input";

type InputProps = React.ComponentPropsWithoutRef<typeof Input>;

interface CurrencyInputProps extends Omit<InputProps, "type" | "prefix"> {
  currencyLabel?: string;
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, currencyLabel = "R$", ...props }, ref) => (
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
        {currencyLabel}
      </span>
      <Input
        ref={ref}
        type="number"
        step="0.01"
        min="0"
        inputMode="decimal"
        className={cn(
          "pl-10 text-right tabular-nums",
          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0",
          className
        )}
        {...props}
      />
    </div>
  )
);
CurrencyInput.displayName = "CurrencyInput";

export default CurrencyInput;
