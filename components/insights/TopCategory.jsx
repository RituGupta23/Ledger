import { formatCurrency } from "@/lib/utils";

export default function TopCategory({ topCategory }) {
  if (!topCategory) {
    return (
      <div className="text-sm text-muted-gray">No expense data for this month.</div>
    );
  }

  const { name, amount, count, breakdown } = topCategory;
  const maxAmount = breakdown[0]?.amount ?? 1;

  return (
    <div>
      <p className="text-sm text-near-black mb-4">
        Your top spending category this month is{" "}
        <span className="font-medium">{name}</span> — {formatCurrency(amount)} across{" "}
        <span className="font-medium">{count} transaction{count !== 1 ? "s" : ""}</span>.
      </p>
      <div className="space-y-2.5">
        {breakdown.map((cat) => {
          const pct = Math.round((cat.amount / maxAmount) * 100);
          return (
            <div key={cat.name}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-near-black font-medium">{cat.name}</span>
                <span className="text-muted-gray">{formatCurrency(cat.amount)}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-near-black transition-all duration-500"
                  style={{ width: `${pct}%`, borderRadius: "2px" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
