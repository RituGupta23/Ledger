"use client";

import { useEffect, useState } from "react";
import useAppStore from "@/store/useAppStore";
import { calcInsights } from "@/lib/utils";
import TopCategory from "@/components/insights/TopCategory";
import MonthComparison from "@/components/insights/MonthComparison";
import SpendingAlert from "@/components/insights/SpendingAlert";

export default function InsightsPage() {
  const [mounted, setMounted] = useState(false);
  const transactions = useAppStore((s) => s.transactions);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const insights = calcInsights(transactions);

  const TITLE_CLASS = "text-lg sm:text-xl text-near-black mb-4 sm:mb-5 pb-3 border-b border-gray-100";
  const CARD_CLASS = "border border-gray-200 p-4 sm:p-6 bg-white";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl text-near-black" style={{ fontFamily: "'DM Serif Display', serif" }}>
          Financial Insights
        </h1>
        <button
          onClick={() => useAppStore.getState().resetData()}
          className="w-full sm:w-auto text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded border border-amber-200 hover:bg-amber-100 transition-colors uppercase tracking-wide cursor-pointer"
        >
          Reset Demo Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={CARD_CLASS}>
          <h2 className={TITLE_CLASS} style={{ fontFamily: "'DM Serif Display', serif" }}>
            Top Category
          </h2>
          <TopCategory topCategory={insights.topCategory} />
        </div>

        <div className={CARD_CLASS}>
          <h2 className={TITLE_CLASS} style={{ fontFamily: "'DM Serif Display', serif" }}>
            Monthly Variance
          </h2>
          <MonthComparison
            currentTotal={insights.currentTotalExpense}
            lastTotal={insights.lastTotalExpense}
            monthlyDeltas={insights.monthlyDeltas}
          />
        </div>

        <div className={`${CARD_CLASS} md:col-span-2`}>
          <h2 className={TITLE_CLASS} style={{ fontFamily: "'DM Serif Display', serif" }}>
            Spending Alerts
          </h2>
          <SpendingAlert alerts={insights.alerts} />
        </div>
      </div>
    </div>
  );
}
