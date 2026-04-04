"use client";

import { useEffect, useState } from "react";
import useAppStore from "@/store/useAppStore";
import StatCard from "@/components/cards/StatCard";
import BalanceLine from "@/components/charts/BalanceLine";
import CategoryBreakdown from "@/components/charts/CategoryBreakdown";
import MonthlyBar from "@/components/charts/MonthlyBar";
import { formatCurrency, getRunningBalance } from "@/lib/utils";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const transactions = useAppStore((s) => s.transactions);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; 

  const now = new Date();
  const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const currentMonthTxs = transactions.filter((tx) => tx.date.startsWith(currentMonthPrefix));
  const currentIncome = currentMonthTxs.filter((tx) => tx.type === "income").reduce((s, tx) => s + tx.amount, 0);
  const currentExpense = currentMonthTxs.filter((tx) => tx.type === "expense").reduce((s, tx) => s + tx.amount, 0);
  
  const totalIncome = transactions.filter((tx) => tx.type === "income").reduce((s, tx) => s + tx.amount, 0);
  const totalExpense = transactions.filter((tx) => tx.type === "expense").reduce((s, tx) => s + tx.amount, 0);
  const totalBalance = totalIncome - totalExpense;
  const hasDeficit = totalBalance < 0;

  const largestCurrentExpense = currentMonthTxs
    .filter((tx) => tx.type === "expense")
    .sort((a, b) => b.amount - a.amount)[0];
  const suspiciousExpenseThreshold = 200000;
  const hasSuspiciousExpense = (largestCurrentExpense?.amount ?? 0) >= suspiciousExpenseThreshold;

  const runningBalanceData = getRunningBalance(transactions);

  // Category breakdown Data
  const catMap = {};
  for (const tx of currentMonthTxs.filter((tx) => tx.type === "expense")) {
    catMap[tx.category] = (catMap[tx.category] ?? 0) + tx.amount;
  }
  const breakdownData = Object.entries(catMap)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));

  // monthly bar data
  const monthlyBarMap = {};
  for (const tx of transactions) {
    const key = tx.date.slice(0, 7);
    if (!monthlyBarMap[key]) monthlyBarMap[key] = { income: 0, expenses: 0 };
    if (tx.type === "income") monthlyBarMap[key].income += tx.amount;
    else monthlyBarMap[key].expenses += tx.amount;
  }
  const monthlyBarData = Object.keys(monthlyBarMap).sort().map((key) => {
    const [year, month] = key.split("-");
    const label = new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleString("en-IN", { month: "short", year: "2-digit" });
    return { label, ...monthlyBarMap[key] };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl text-near-black tracking-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
          Overview
        </h1>
        <button
          onClick={() => useAppStore.getState().resetData()}
          className="w-full sm:w-auto text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded border border-amber-200 hover:bg-amber-100 transition-colors uppercase tracking-wide cursor-pointer"
        >
          Reset Demo Data
        </button>
      </div>

      {hasDeficit && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm" style={{ borderRadius: "6px" }}>
          Overall expenses are higher than income by <span className="font-medium">{formatCurrency(Math.abs(totalBalance))}</span>.
        </div>
      )}

      {hasSuspiciousExpense && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 text-sm" style={{ borderRadius: "6px" }}>
          Large expense detected this month: <span className="font-medium">{largestCurrentExpense.merchant}</span> ({formatCurrency(largestCurrentExpense.amount)}). Please verify if this was intentional.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label={hasDeficit ? "Net Deficit" : "Total Balance"}
          value={hasDeficit ? Math.abs(totalBalance) : totalBalance}
          valueTone="balance"
          note={hasDeficit ? "Expenses are ahead of income overall." : "Income is currently ahead of expenses."}
        />
        <StatCard label="This Month Income" value={currentIncome} />
        <StatCard label="This Month Expenses" value={currentExpense} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 sm:gap-6">
        <div className="lg:col-span-6 border border-gray-200 p-4 sm:p-5 bg-white">
          <h2 className="text-sm font-medium text-near-black mb-4 uppercase tracking-wider">Running Balance</h2>
          <BalanceLine data={runningBalanceData} />
        </div>
        <div className="lg:col-span-4 border border-gray-200 p-4 sm:p-5 bg-white">
          <h2 className="text-sm font-medium text-near-black mb-4 uppercase tracking-wider">Category Breakdown</h2>
          <CategoryBreakdown data={breakdownData} />
        </div>
      </div>

      <div className="border border-gray-200 p-4 sm:p-5 bg-white">
        <h2 className="text-sm font-medium text-near-black mb-4 uppercase tracking-wider">Income vs Expenses</h2>
        <MonthlyBar data={monthlyBarData} />
      </div>
    </div>
  );
}
