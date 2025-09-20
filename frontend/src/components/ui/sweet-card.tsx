import * as React from "react";
import { cn } from "@/lib/utils";

const SweetCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "gradient" | "featured" | "hover";
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-card text-card-foreground shadow-soft border border-border/10",
    gradient: "bg-gradient-card text-card-foreground shadow-warm border-0",
    featured: "bg-card text-card-foreground shadow-glow border border-primary/20 ring-1 ring-primary/10",
    hover: "bg-card text-card-foreground shadow-soft border border-border/10 sweet-hover cursor-pointer",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl p-6 transition-all duration-300",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
SweetCard.displayName = "SweetCard";

const SweetCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-0", className)}
    {...props}
  />
));
SweetCardHeader.displayName = "SweetCardHeader";

const SweetCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-heading text-2xl font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
SweetCardTitle.displayName = "SweetCardTitle";

const SweetCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
SweetCardDescription.displayName = "SweetCardDescription";

const SweetCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0", className)} {...props} />
));
SweetCardContent.displayName = "SweetCardContent";

const SweetCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-0", className)}
    {...props}
  />
));
SweetCardFooter.displayName = "SweetCardFooter";

export {
  SweetCard,
  SweetCardHeader,
  SweetCardFooter,
  SweetCardTitle,
  SweetCardDescription,
  SweetCardContent,
};