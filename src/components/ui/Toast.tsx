"use client";

import { useEffect, useState } from "react";

type ToastProps = {
  message: string;
  visible: boolean;
  onClose: () => void;
  duration?: number;
  icon?: React.ReactNode;
};

export default function Toast({
  message,
  visible,
  onClose,
  duration = 2500,
  icon,
}: ToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      // Small delay so the enter animation plays
      requestAnimationFrame(() => setShow(true));
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300); // wait for exit animation
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [visible, duration, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-8 left-1/2 z-[100] -translate-x-1/2">
      <div
        className={`
          flex items-center gap-3 rounded-2xl border border-white/40
          bg-white/80 px-6 py-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.1)]
          backdrop-blur-xl transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)
          ${show ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-90"}
        `}
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-muted/50 text-primary-dark">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
        <span className="whitespace-nowrap text-sm font-bold tracking-tight text-foreground">
          {message}
        </span>
      </div>
    </div>
  );
}
