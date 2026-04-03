"use client";

import { useState, useRef, useEffect } from "react";

export default function ExportMenu({ transactions }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  const exportJSON = () => {
    const data = JSON.stringify(transactions, null, 2);
    downloadFile(data, "ledger_export.json", "application/json");
  };

  const exportCSV = () => {
    if (!transactions.length) return;
    const headers = ["Date", "Merchant", "Amount", "Category", "Type", "ID"];
    const rows = transactions.map((t) => [
      t.date,
      `"${t.merchant.replace(/"/g, '""')}"`, // escape quotes
      t.amount,
      `"${t.category}"`,
      t.type,
      t.id,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    downloadFile(csvContent, "ledger_export.csv", "text/csv;charset=utf-8;");
  };

  return (
    <div className="relative inline-block text-left w-full sm:w-auto" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full sm:w-auto justify-center sm:justify-start flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-near-black bg-white text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
        style={{ borderRadius: "6px" }}
        disabled={transactions.length === 0}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Export
      </button>

      {isOpen && (
        <div
          className="absolute right-0 z-10 w-36 origin-top-right mt-1 border border-gray-200 bg-white shadow-lg focus:outline-none overflow-hidden"
          style={{ borderRadius: "6px" }}
        >
          <div className="py-1">
            <button
              onClick={exportCSV}
              className="w-full text-left block px-4 py-2 text-sm text-near-black hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Export to CSV
            </button>
            <button
              onClick={exportJSON}
              className="w-full text-left block px-4 py-2 text-sm text-near-black hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Export to JSON
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
