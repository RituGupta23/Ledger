"use client";

import useAppStore from "@/store/useAppStore";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-8 h-8" />;

  return (
    <button 
      onClick={toggleTheme}
      className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-muted-gray hover:text-near-black transition-colors cursor-pointer flex items-center justify-center w-8 h-8"
      aria-label="Toggle Dark Mode"
    >
      {theme === "dark" ? (
        <Sun size={18} />
      ) : (
        <Moon size={18} />
      )}
    </button>
  );
}
