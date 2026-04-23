import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "../lib/utils";
import { AVAILABLE_ICONS, CategoryIcon } from "./CategoryIcon";
import { COLOR_PALETTE } from "../lib/categoryPalette";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Color must be a hex value"),
  icon: z.string().min(1, "Pick an icon"),
});

export type GroupFormValues = z.infer<typeof schema>;

interface GroupFormProps {
  open: boolean;
  initialValue?: Partial<GroupFormValues>;
  title: string;
  submitLabel: string;
  onSubmit: (values: GroupFormValues) => Promise<void> | void;
  onOpenChange: (open: boolean) => void;
}

const DEFAULTS: GroupFormValues = {
  name: "",
  color: COLOR_PALETTE[0],
  icon: AVAILABLE_ICONS[0],
};

const GroupForm = ({
  open,
  initialValue,
  title,
  submitLabel,
  onSubmit,
  onOpenChange,
}: GroupFormProps) => {
  const form = useForm<GroupFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { ...DEFAULTS, ...initialValue },
  });

  useEffect(() => {
    if (open) {
      form.reset({ ...DEFAULTS, ...initialValue });
    }
  }, [open, initialValue, form]);

  const color = form.watch("color");
  const icon = form.watch("icon");

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Group expenses by occasion — a trip, an event, a project.
          </DialogDescription>
        </DialogHeader>
        <form id="group-form" onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="group-name">Name</Label>
            <Input
              id="group-name"
              placeholder="e.g. Japan Trip"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {COLOR_PALETTE.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    form.setValue("color", option, { shouldValidate: true })
                  }
                  className={cn(
                    "h-8 w-8 rounded-full border-2 flex items-center justify-center transition",
                    color === option
                      ? "border-foreground scale-110"
                      : "border-transparent hover:scale-105"
                  )}
                  style={{ backgroundColor: option }}
                  aria-label={`Color ${option}`}
                >
                  {color === option && (
                    <Check className="h-4 w-4 text-white drop-shadow" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="grid grid-cols-6 gap-2 sm:grid-cols-9">
              {AVAILABLE_ICONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    form.setValue("icon", option, { shouldValidate: true })
                  }
                  className={cn(
                    "h-9 w-9 rounded-md border flex items-center justify-center transition",
                    icon === option
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:bg-muted"
                  )}
                  aria-label={`Icon ${option}`}
                >
                  <CategoryIcon name={option} className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="group-form"
            disabled={form.formState.isSubmitting}
          >
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GroupForm;
