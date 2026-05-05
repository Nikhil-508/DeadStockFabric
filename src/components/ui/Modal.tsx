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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/40 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300 border border-border/50">
        <h3 className="mb-4 text-2xl font-black tracking-tighter text-foreground">
          {title}
        </h3>
        
        <div className="mb-8 text-muted leading-relaxed">
          {children}
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="ghost" 
            fullWidth 
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button 
            variant="primary" 
            fullWidth 
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Processing..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
