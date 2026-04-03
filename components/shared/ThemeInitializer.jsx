"use client";

import { useEffect } from "react";
import useAppStore from "@/store/useAppStore";

export default function ThemeInitializer() {
  const theme = useAppStore((state) => state.theme);

  useEffect(() => {
    // Only run this when theme changes and on initial mount
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return null;
}
