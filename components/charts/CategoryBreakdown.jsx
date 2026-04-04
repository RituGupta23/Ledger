"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CATEGORY_HEX } from "@/components/shared/Badge";
import { formatCurrency } from "@/lib/utils";

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0].payload;
  return (
    <div
      className="bg-white border border-gray-200 px-3 py-2 text-sm"
      style={{ borderRadius: "4px" }}
    >
      <p className="text-muted-gray text-xs mb-0.5">{name}</p>
      <p className="font-medium text-near-black">{formatCurrency(value)}</p>
    </div>
  );
}

export default function CategoryBreakdown({ data }) {
  if (!data?.length) return (
    <div className="flex items-center justify-center h-40 text-sm text-muted-gray">No expense data</div>
  );

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div>
      <div className="h-[190px] sm:h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={CATEGORY_HEX[entry.name] ?? "#9CA3AF"}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Custom */}
      <div className="mt-3 space-y-1.5">
        {data.map((entry) => {
          const pct = total > 0 ? ((entry.value / total) * 100).toFixed(1) : "0";
          return (
            <div key={entry.name} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: CATEGORY_HEX[entry.name] ?? "#9CA3AF" }}
                />
                <span className="text-near-black truncate">{entry.name}</span>
              </div>
              <div className="flex items-center gap-2 sm:ml-3 flex-shrink-0">
                <span className="text-muted-gray">{pct}%</span>
                <span className="text-near-black font-medium">{formatCurrency(entry.value)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
