import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function StatCard({ label, value, delta, deltaLabel, prefix = "", valueTone = "default", note }) {
  const isPositive = delta > 0;
  const isNegative = delta < 0;
  const emphasizeNegativeValue = valueTone === "balance" && value < 0;

  return (
    <div className="border border-gray-200 p-5 bg-off-white flex flex-col gap-1">
      <p className="text-xs text-muted-gray uppercase tracking-widest font-medium">{label}</p>
      <p
        className={cn(
          "font-serif text-3xl leading-none mt-1",
          emphasizeNegativeValue ? "text-expense" : "text-near-black"
        )}
        style={{ fontFamily: "'DM Serif Display', serif" }}
      >
        {prefix}{formatCurrency(value)}
      </p>
      {note && <p className="text-xs text-muted-gray mt-1">{note}</p>}
      {delta !== undefined && (
        <div className="flex items-center gap-1.5 mt-2">
          <span
            className={cn(
              "text-xs font-medium",
              isPositive && "text-income",
              isNegative && "text-expense",
              !isPositive && !isNegative && "text-muted-gray"
            )}
          >
            {isPositive ? "+" : ""}{delta.toFixed(1)}%
          </span>
          {deltaLabel && (
            <span className="text-xs text-muted-gray">{deltaLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
