"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown, Trash2 } from "lucide-react";
import Badge from "@/components/shared/Badge";
import TxRow from "./TxRow";
import EmptyState from "@/components/shared/EmptyState";
import { sortTransactions } from "@/lib/utils";

const COLUMNS = [
  { key: "date", label: "Date" },
  { key: "merchant", label: "Merchant" },
  { key: "category", label: "Category", sortable: false },
  { key: "type", label: "Type", sortable: false },
  { key: "amount", label: "Amount" },
];

function SortIcon({ direction }) {
  if (!direction) {
    return <ChevronsUpDown size={10} className="opacity-30" />;
  }
  return direction === "asc" ? (
    <ChevronUp size={10} className="text-near-black" />
  ) : (
    <ChevronDown size={10} className="text-near-black" />
  );
}

export default function TxTable({ transactions, isAdmin, onDelete, onRowClick }) {
  const [sort, setSort] = useState({ key: "date", direction: "desc" });

  const handleSort = (key) => {
    if (COLUMNS.find((c) => c.key === key)?.sortable === false) return;
    setSort((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "desc" }
    );
  };

  const sorted = sortTransactions(transactions, sort.key, sort.direction);

  if (!transactions.length) {
    return (
      <EmptyState
        message="No transactions match your current filters. Try clearing some filters to see more results."
        action="Clear filters"
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      {/* Desktop table */}
      <table className="hidden md:table w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            {COLUMNS.map(({ key, label, sortable }) => (
              <th
                key={key}
                className={[
                  "text-left py-2.5 px-4 text-xs font-medium text-muted-gray uppercase tracking-wide",
                  sortable !== false ? "cursor-pointer select-none hover:text-near-black transition-colors" : "",
                  key === "amount" ? "text-right" : "",
                ].join(" ")}
                onClick={() => handleSort(key)}
              >
                <span className="inline-flex items-center gap-1">
                  {label}
                  {sortable !== false && <SortIcon direction={sort.key === key ? sort.direction : null} />}
                </span>
              </th>
            ))}
            {isAdmin && <th className="py-2.5 px-4 w-10" />}
          </tr>
        </thead>
        <tbody>
          {sorted.map((tx) => (
            <TxRow
              key={tx.id}
              transaction={tx}
              isAdmin={isAdmin}
              onDelete={onDelete}
              onClick={onRowClick}
            />
          ))}
        </tbody>
      </table>

      {/* Mobile card layout */}
      <div className="md:hidden space-y-2">
        {sorted.map((tx) => {
          const isIncome = tx.type === "income";
          return (
            <div
              key={tx.id}
              onClick={() => onRowClick?.(tx)}
              className="border border-gray-200 p-3 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
              style={{ borderRadius: "6px" }}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-sm font-medium text-near-black leading-tight min-w-0 break-words">{tx.merchant}</span>
                <span
                  className={[
                    "text-sm font-medium tabular-nums flex-shrink-0",
                    isIncome ? "text-income" : "text-expense",
                  ].join(" ")}
                  style={{ fontFamily: "'DM Serif Display', serif" }}
                >
                  {isIncome ? "+" : "-"}₹{tx.amount.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-gray">
                    {new Date(tx.date + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                  </span>
                  <span className="text-gray-300">·</span>
                  <Badge category={tx.category} />
                </div>
                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.(tx.id);
                    }}
                    className="p-1.5 text-gray-400 hover:text-expense transition-colors cursor-pointer"
                    aria-label={`Delete ${tx.merchant}`}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
