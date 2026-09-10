import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-[transform,box-shadow,background-color,opacity] duration-250 disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        primary: "shine-button bg-accent text-accent-fg shadow-soft hover:-translate-y-0.5 hover:shadow-lift min-h-11 px-5",
        ghost: "text-ink hover:bg-paper-2 min-h-11 px-4",
        outline: "bg-surface text-ink shadow-border hover:-translate-y-0.5 hover:bg-paper-2 min-h-11 px-5",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

export function Button({ className, variant, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />;
}
