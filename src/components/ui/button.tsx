import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold font-display uppercase tracking-wider ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_20px_hsl(276_100%_50%_/_0.5)]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-2 border-primary bg-transparent text-primary hover:bg-primary/10 hover:shadow-[0_0_20px_hsl(276_100%_50%_/_0.3)]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-[0_0_20px_hsl(184_100%_48%_/_0.5)]",
        ghost: "hover:bg-primary/10 hover:text-primary",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "relative overflow-hidden border-2 border-primary bg-transparent text-foreground px-8 py-4 text-lg hover:border-secondary hover:text-secondary transition-all duration-500 before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/20 before:to-secondary/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 hover:shadow-[0_0_30px_hsl(276_100%_50%_/_0.5),0_0_60px_hsl(184_100%_48%_/_0.3)] hover:scale-105",
        neon: "relative bg-transparent border-2 border-secondary text-secondary hover:bg-secondary/10 hover:shadow-[0_0_20px_hsl(184_100%_48%_/_0.5),0_0_40px_hsl(184_100%_48%_/_0.3)] transition-all duration-300",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90 hover:shadow-[0_0_20px_hsl(330_100%_59%_/_0.5)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-md px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
