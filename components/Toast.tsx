"use client";

import { useEffect } from "react";

export default function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
      <div
        className={`px-5 py-3 rounded-xl shadow-lg text-sm font-medium ${
          type === "success"
            ? "bg-green-600"
            : "bg-red-600"
        }`}
      >
        {message}
      </div>
    </div>
  );
}
