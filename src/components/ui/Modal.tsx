"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 ease-out">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">
            {title}
          </h3>
        </div>
        
        <div className="px-6 py-8 text-gray-600 leading-relaxed">
          {children}
        </div>
        
        <div className="flex justify-end gap-3 bg-gray-50 px-6 py-4">
          <button 
            onClick={onConfirm}
            disabled={loading}
            className="rounded-md bg-red-600 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : confirmText}
          </button>
          <button 
            onClick={onClose}
            disabled={loading}
            className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
