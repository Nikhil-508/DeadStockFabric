"use client";

import React, { useEffect } from "react";
import { Button } from "./index";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
};

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
}: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] bg-white p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] animate-in fade-in zoom-in-95 duration-300 ease-out">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 rounded-full p-2 text-muted-light transition-colors hover:bg-cream hover:text-foreground"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>

        <h3 className="mb-6 text-3xl font-black tracking-tighter text-foreground">
          {title}
        </h3>
        
        <div className="mb-10 text-lg text-muted leading-relaxed">
          {children}
        </div>
        
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button 
            variant="ghost" 
            fullWidth 
            onClick={onClose}
            disabled={loading}
            className="order-2 sm:order-1"
          >
            {cancelText}
          </Button>
          <Button 
            variant="primary" 
            size="lg"
            fullWidth 
            onClick={onConfirm}
            disabled={loading}
            className="order-1 sm:order-2"
          >
            {loading ? "Processing..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
