"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

const STROKE_COLOR = "var(--theme-fg)";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="bg-white border border-gray-200 px-3 py-2 text-sm"
      style={{ borderRadius: "4px" }}
    >
      <p className="text-muted-gray text-xs mb-0.5">{label}</p>
      <p className="font-medium text-near-black">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

export default function BalanceLine({ data }) {
  if (!data?.length) return (
    <div className="flex items-center justify-center h-48 text-sm text-muted-gray">No data available</div>
  );

  return (
    <div className="h-[200px] sm:h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
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
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--theme-border)", strokeWidth: 1 }} />
          <Line
            type="monotone"
            dataKey="balance"
            stroke={STROKE_COLOR}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: STROKE_COLOR, stroke: "var(--theme-bg)", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
