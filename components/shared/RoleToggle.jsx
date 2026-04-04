"use client";

import { Eye, Lock } from "lucide-react";
import useAppStore from "@/store/useAppStore";

export default function RoleToggle() {
  const role = useAppStore((s) => s.role);
  const setRole = useAppStore((s) => s.setRole);

  return (
    <div
      className="inline-flex items-center border border-gray-200 overflow-hidden"
      style={{ borderRadius: "6px" }}
    >
      <button
        onClick={() => setRole("viewer")}
        className={[
          "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
          role === "viewer"
            ? "bg-near-black text-off-white"
            : "bg-white text-gray-500 hover:bg-gray-50",
        ].join(" ")}
      >
        <Eye size={12} strokeWidth={2.5} />
        Viewer
      </button>
      <button
        onClick={() => setRole("admin")}
        className={[
          "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
          role === "admin"
            ? "bg-near-black text-off-white"
            : "bg-white text-gray-500 hover:bg-gray-50",
        ].join(" ")}
      >
        <Lock size={12} strokeWidth={2.5} />
        Admin
      </button>
    </div>
  );
}
