type SkeletonProps = {
  className?: string;
  variant?: "rect" | "circle" | "text";
};

export default function Skeleton({ className = "", variant = "rect" }: SkeletonProps) {
  const variantClasses = {
    rect: "rounded-lg",
    circle: "rounded-full",
    text: "rounded h-4 w-full",
  };

  return (
    <div 
      className={`skeleton bg-black/[0.03] ${variantClasses[variant]} ${className}`} 
    />
  );
}
