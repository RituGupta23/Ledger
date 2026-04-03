"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import MobileNav from "./MobileNav";
import ThemeToggle from "@/components/shared/ThemeToggle";

const PAGE_TITLES = {
  "/": "Overview",
  "/transactions": "Transactions",
  "/insights": "Insights",
};

export default function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Ledger";

  return (
    <>
      <header className="lg:hidden fixed top-0 left-0 right-0 z-20 bg-off-white border-b border-gray-200 flex items-center justify-between px-3 sm:px-4 h-14">
        <button
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open navigation"
          className="p-2 -ml-2 text-near-black hover:bg-gray-100 rounded cursor-pointer"
        >
          <Menu size={20} />
        </button>
        <span
          className="text-sm sm:text-base font-medium text-near-black truncate px-2"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          {title}
        </span>
        <div className="flex items-center gap-1">
          <ThemeToggle />
        </div>
      </header>
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </>
  );
}
