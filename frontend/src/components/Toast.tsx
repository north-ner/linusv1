import React from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

export default function Toast({ message, type = "info", onClose }: ToastProps) {
  const base =
    "px-4 py-2 rounded shadow-lg flex items-center gap-2 text-white animate-fade-in";
  const color =
    type === "success"
      ? "bg-green-600"
      : type === "error"
      ? "bg-red-600"
      : "bg-blue-600";

  return (
    <div className={`${base} ${color}`}>
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        className="font-bold ml-2 px-2 hover:text-gray-200"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
}