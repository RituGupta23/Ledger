import Badge from "@/components/shared/Badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Trash2 } from "lucide-react";

export default function TxRow({ transaction, isAdmin, onDelete, onClick }) {
  const { merchant, category, type, amount, date } = transaction;
  const isIncome = type === "income";

  return (
    <tr
      className="border-b border-gray-100 hover:bg-gray-50 transition-colors group cursor-pointer"
      onClick={() => onClick?.(transaction)}
    >
      <td className="py-3 px-4 text-sm text-muted-gray whitespace-nowrap">
        {formatDate(date)}
      </td>
      <td className="py-3 px-4 text-sm text-near-black font-medium">
        {merchant}
      </td>
      <td className="py-3 px-4">
        <Badge category={category} />
      </td>
      <td className="py-3 px-4">
        <span
          className={[
            "text-xs font-medium capitalize px-2 py-0.5",
            isIncome ? "text-income" : "text-expense",
          ].join(" ")}
        >
          {type}
        </span>
      </td>
      <td className="py-3 px-4 text-right">
        <span
          className={[
            "text-sm font-medium tabular-nums",
            isIncome ? "text-income" : "text-expense",
          ].join(" ")}
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          {isIncome ? "+" : "-"}{formatCurrency(amount)}
        </span>
      </td>
      {isAdmin && (
        <td className="py-3 px-4 text-right w-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(transaction.id);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-expense cursor-pointer"
            aria-label={`Delete ${merchant}`}
          >
            <Trash2 size={14} />
          </button>
        </td>
      )}
    </tr>
  );
}
