import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
  as?: "div" | "article" | "section";
};

const paddingMap = {
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export default function Card({
  children,
  className = "",
  hover = false,
  padding = "md",
  as: Tag = "div",
}: CardProps) {
  return (
    <Tag
      className={`
        rounded-2xl border border-border bg-card
        shadow-[var(--shadow-card)]
        ${hover ? "cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] hover:bg-card-hover" : ""}
        ${paddingMap[padding]}
        ${className}
      `}
    >
      {children}
    </Tag>
  );
}
