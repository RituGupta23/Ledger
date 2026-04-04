"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

const INCOME_COLOR = "var(--theme-income)";
const EXPENSE_COLOR = "var(--theme-expense)";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="bg-white border border-gray-200 px-3 py-2 text-sm min-w-[140px] max-w-[calc(100vw-2rem)]"
      style={{ borderRadius: "4px" }}
    >
      <p className="text-muted-gray text-xs mb-1.5 font-medium">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4 mb-0.5">
          <span style={{ color: p.fill }} className="font-medium capitalize">{p.name}</span>
          <span className="text-near-black">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function MonthlyBar({ data }) {
  if (!data?.length) return (
    <div className="flex items-center justify-center h-40 text-sm text-muted-gray">No data available</div>
  );

  return (
    <div>
      {/* Custom legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3" style={{ backgroundColor: INCOME_COLOR }} />
          <span className="text-xs text-near-black">Income</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3" style={{ backgroundColor: EXPENSE_COLOR }} />
          <span className="text-xs text-near-black">Expenses</span>
        </div>
      </div>

      <div className="h-[200px] sm:h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="30%" barGap={4} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "var(--theme-muted-text)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              tick={{ fontSize: 11, fill: "var(--theme-muted-text)" }}
              axisLine={false}
              tickLine={false}
              width={44}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--theme-gray-50)" }} />
            <Bar dataKey="income" name="income" fill={INCOME_COLOR} radius={[2, 2, 0, 0]} />
            <Bar dataKey="expenses" name="expenses" fill={EXPENSE_COLOR} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
