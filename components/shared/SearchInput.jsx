"use client";

import { useRef, useEffect } from "react";
import { Search } from "lucide-react";

const DEBOUNCE_MS = 300;

export default function SearchInput({ value, onChange, placeholder = "Search merchants…" }) {
  const timerRef = useRef(null);

  const handleChange = (e) => {
    const val = e.target.value;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChange(val);
    }, DEBOUNCE_MS);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="relative flex items-center">
      <span className="absolute left-3 text-gray-400 pointer-events-none">
        <Search size={16} />
      </span>
      <input
        type="text"
        defaultValue={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={[
          "pl-9 pr-3 py-2 text-sm bg-white border border-gray-200",
          "text-near-black placeholder-gray-400 outline-none",
          "focus:border-near-black transition-colors w-full",
        ].join(" ")}
        style={{ borderRadius: "6px" }}
      />
    </div>
  );
}
