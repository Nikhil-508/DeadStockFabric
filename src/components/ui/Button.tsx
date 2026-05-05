import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-dark text-white shadow-md hover:bg-primary hover:shadow-lg active:scale-[0.96]",
  secondary:
    "bg-primary-muted/40 text-primary-dark hover:bg-primary-muted/60 active:scale-[0.96]",
  ghost:
    "bg-transparent text-muted hover:bg-cream hover:text-foreground",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-[11px] uppercase tracking-wider rounded-lg",
  md: "px-6 py-3 text-sm font-bold rounded-xl",
  lg: "px-10 py-4 text-base font-black uppercase tracking-widest rounded-2xl",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold tracking-tight
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
