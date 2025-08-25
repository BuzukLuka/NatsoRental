"use client";
import { ReactNode } from "react";

export default function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h3 className="text-lg font-bold">{title}</h3>}
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}
