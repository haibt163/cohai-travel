import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "shine-button inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-[transform,box-shadow,opacity] duration-200 disabled:pointer-events-none disabled:opacity-40 hover:-translate-y-0.5 active:translate-y-0",
  {
    variants: {
      variant: {
        primary: "bg-ink text-paper shadow-soft hover:shadow-lift min-h-12 px-6",
        ghost: "text-ink hover:bg-paper-2 min-h-11 px-4",
        outline: "border border-border bg-surface text-ink shadow-border hover:bg-paper-2 min-h-12 px-6",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

export function Button({ className, variant, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />;
}
