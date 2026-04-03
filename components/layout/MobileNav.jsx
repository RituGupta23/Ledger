"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { X, RotateCcw } from "lucide-react";
import useAppStore from "@/store/useAppStore";
import RoleToggle from "@/components/shared/RoleToggle";
import ThemeToggle from "@/components/shared/ThemeToggle";

const NAV_LINKS = [
  { href: "/", label: "Overview" },
  { href: "/transactions", label: "Transactions" },
  { href: "/insights", label: "Insights" },
];

export default function MobileNav({ isOpen, onClose }) {
  const pathname = usePathname();
  const resetData = useAppStore((s) => s.resetData);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/30 transition-opacity duration-200"
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
        aria-hidden="true"
      />
      {/* Drawer */}
      <nav
        className="fixed top-0 left-0 z-50 h-full w-[260px] max-w-[82vw] bg-off-white border-r border-gray-200 flex flex-col transition-transform duration-200"
        style={{ transform: isOpen ? "translateX(0)" : "translateX(-100%)" }}
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between px-5 h-14 border-b border-gray-200">
          <span
            className="text-xl text-near-black"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Ledger
          </span>
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="p-1 hover:bg-gray-100 rounded cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 py-4 px-3">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={[
                  "flex items-center px-3 py-3 text-sm mb-0.5 transition-colors",
                  isActive
                    ? "text-near-black font-medium border-l-2 border-amber-600 pl-[10px] bg-gray-100"
                    : "text-gray-500 hover:text-near-black hover:bg-gray-50",
                ].join(" ")}
              >
                {label}
              </Link>
            );
          })}
        </div>
        <div className="px-4 py-5 border-t border-gray-200 mt-auto space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-gray font-medium">Theme</p>
            <ThemeToggle />
          </div>
          <div>
            <p className="text-xs text-muted-gray mb-2 font-medium">View Mode</p>
            <RoleToggle />
          </div>
          <button
            onClick={() => {
              resetData();
              onClose();
            }}
            className="text-xs text-muted-gray hover:text-near-black flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw size={12} />
            Reset Demo Data
          </button>
        </div>
      </nav>
    </>
  );
}
