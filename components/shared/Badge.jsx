const CATEGORY_COLORS = {
  "Food & Dining": { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
  "Transport": { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200" },
  "Housing": { bg: "bg-zinc-100", text: "text-zinc-800", border: "border-zinc-300" },
  "Entertainment": { bg: "bg-violet-50", text: "text-violet-800", border: "border-violet-200" },
  "Healthcare": { bg: "bg-teal-50", text: "text-teal-800", border: "border-teal-200" },
  "Income": { bg: "bg-green-50", text: "text-green-800", border: "border-green-200" },
};

const DEFAULT_COLORS = { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" };

export const CATEGORY_HEX = {
  "Food & Dining": "var(--cat-food)",
  Transport: "var(--cat-trans)",
  Housing: "var(--cat-house)",
  Entertainment: "var(--cat-ent)",
  Healthcare: "var(--cat-health)",
  Income: "var(--cat-inc)",
};

export default function Badge({ category }) {
  const colors = CATEGORY_COLORS[category] ?? DEFAULT_COLORS;
  return (
    <span
      className={[
        "inline-flex items-center px-2 py-0.5 text-xs font-medium border",
        colors.bg,
        colors.text,
        colors.border,
      ].join(" ")}
      style={{ borderRadius: "4px" }}
    >
      {category}
    </span>
  );
}
