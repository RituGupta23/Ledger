"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, List, Activity, RotateCcw } from "lucide-react";
import RoleToggle from "@/components/shared/RoleToggle";
import ThemeToggle from "@/components/shared/ThemeToggle";
import useAppStore from "@/store/useAppStore";

const NAV_LINKS = [
  {
    href: "/",
    label: "Overview",
    icon: <LayoutDashboard size={16} />,
  },
  {
    href: "/transactions",
    label: "Transactions",
    icon: <List size={16} />,
  },
  {
    href: "/insights",
    label: "Insights",
    icon: <Activity size={16} />,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const resetData = useAppStore((s) => s.resetData);

  return (
    <aside className="hidden lg:flex flex-col w-56 border-r border-gray-200 bg-off-white h-screen overflow-y-auto fixed left-0 top-0 z-30">
      <div className="px-6 pt-7 pb-5 border-b border-gray-200 shrink-0 flex items-center justify-between">
        <span
          className="text-2xl text-near-black tracking-tight"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          Ledger
        </span>
        <ThemeToggle />
      </div>
      <nav className="flex-1 py-4 px-3">
        {NAV_LINKS.map(({ href, label, icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex items-center gap-3 px-3 py-2.5 text-sm mb-0.5 transition-colors",
                isActive
                  ? "text-near-black font-medium border-l-2 border-amber-600 pl-[10px] bg-gray-100"
                  : "text-gray-500 hover:text-near-black hover:bg-gray-50",
              ].join(" ")}
              style={{ borderRadius: "0 4px 4px 0" }}
            >
              <span className={isActive ? "text-near-black" : "text-gray-400"}>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-5 border-t border-gray-200 shrink-0">
        <p className="text-xs text-muted-gray mb-2 font-medium">View Mode</p>
        <RoleToggle />
        <button
          onClick={resetData}
          className="mt-6 text-xs text-muted-gray hover:text-near-black flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw size={12} />
          Reset Demo Data
        </button>
      </div>
    </aside>
  );
}
