import { formatCurrency } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";

function DeltaArrow({ delta }) {
  if (delta > 0) return <ChevronUp size={12} strokeWidth={2.5} className="text-expense inline" />;
  if (delta < 0) return <ChevronDown size={12} strokeWidth={2.5} className="text-income inline" />;
  return <span className="text-muted-gray">—</span>;
}

export default function MonthComparison({ currentTotal, lastTotal, monthlyDeltas }) {
  const overallDelta = lastTotal > 0 ? ((currentTotal - lastTotal) / lastTotal) * 100 : 0;
  const isUp = overallDelta > 0;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-4">
        <span
          className="text-2xl text-near-black"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          {formatCurrency(currentTotal)}
        </span>
        <span className={`text-sm font-medium ${isUp ? "text-expense" : "text-income"}`}>
          <DeltaArrow delta={overallDelta} />
          {" "}{Math.abs(overallDelta).toFixed(1)}% vs last month
        </span>
      </div>

      <div className="space-y-1 border-t border-gray-100 pt-3">
        {monthlyDeltas
          .filter((d) => d.category !== "Income")
          .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
          .map(({ category, current, previous, delta }) => (
          <div key={category} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-1.5">
            <span className="text-sm text-near-black">{category}</span>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="text-xs text-muted-gray">{formatCurrency(previous)} → {formatCurrency(current)}</span>
              <span className={`text-xs font-medium flex items-center gap-0.5 ${delta > 0 ? "text-expense" : delta < 0 ? "text-income" : "text-muted-gray"}`}>
                <DeltaArrow delta={delta} />
                {Math.abs(delta).toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
