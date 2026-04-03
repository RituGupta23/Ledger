"use client";

import useAppStore from "@/store/useAppStore";
import SearchInput from "@/components/shared/SearchInput";
import { groupByMonth } from "@/lib/utils";

const CATEGORIES = ["all", "Food & Dining", "Transport", "Housing", "Entertainment", "Healthcare", "Income"];
const TYPES = ["all", "income", "expense"];

function getMonthOptions(transactions) {
  const byMonth = groupByMonth(transactions);
  return Object.keys(byMonth)
    .sort()
    .reverse()
    .map((key) => {
      const [year, month] = key.split("-");
      const label = new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleString("en-IN", {
        month: "long",
        year: "numeric",
      });
      return { value: key, label };
    });
}

const SELECT_CLASS = [
  "w-full py-2 px-3 text-sm border border-gray-200 bg-white text-near-black",
  "outline-none focus:border-near-black transition-colors cursor-pointer",
].join(" ");

export default function Filters({ transactions }) {
  const filters = useAppStore((s) => s.filters);
  const setFilter = useAppStore((s) => s.setFilter);
  const resetFilters = useAppStore((s) => s.resetFilters);

  const hasActiveFilters =
    filters.search !== "" ||
    filters.category !== "all" ||
    filters.type !== "all" ||
    filters.month !== "all";

  const monthOptions = getMonthOptions(transactions);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 py-3">
      <div className="w-full sm:col-span-2 lg:col-span-2">
        <SearchInput
          value={filters.search}
          onChange={(val) => setFilter("search", val)}
        />
      </div>

      <select
        value={filters.category}
        onChange={(e) => setFilter("category", e.target.value)}
        className={SELECT_CLASS}
        style={{ borderRadius: "6px" }}
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c === "all" ? "All Categories" : c}
          </option>
        ))}
      </select>

      <select
        value={filters.type}
        onChange={(e) => setFilter("type", e.target.value)}
        className={SELECT_CLASS}
        style={{ borderRadius: "6px" }}
      >
        {TYPES.map((t) => (
          <option key={t} value={t}>
            {t === "all" ? "All Types" : t.charAt(0).toUpperCase() + t.slice(1)}
          </option>
        ))}
      </select>

      <select
        value={filters.month}
        onChange={(e) => setFilter("month", e.target.value)}
        className={SELECT_CLASS}
        style={{ borderRadius: "6px" }}
      >
        <option value="all">All Months</option>
        {monthOptions.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="text-sm text-muted-gray hover:text-near-black transition-colors underline underline-offset-2 cursor-pointer justify-self-start lg:self-center"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
