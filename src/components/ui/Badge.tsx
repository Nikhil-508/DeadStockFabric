import { ReactNode } from "react";

type BadgeVariant = "green" | "cream" | "sky" | "mint" | "lavender" | "sage";

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
};

const variantStyles: Record<BadgeVariant, string> = {
  green: "bg-primary-muted text-primary-dark",
  cream: "bg-cream-dark text-foreground",
  sky: "bg-sky text-sky-dark",
  mint: "bg-mint text-primary-dark",
  lavender: "bg-lavender text-foreground",
  sage: "bg-sage text-foreground",
};

const dotColors: Record<BadgeVariant, string> = {
  green: "bg-primary-dark",
  cream: "bg-cream-deeper",
  sky: "bg-sky-dark",
  mint: "bg-primary",
  lavender: "bg-[#9b8ec0]",
  sage: "bg-sage-dark",
};

export default function Badge({
  children,
  variant = "green",
  dot = false,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-full px-2.5 py-0.5
        text-xs font-medium leading-5
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {dot && (
        <span className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
}
