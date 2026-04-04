import { AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";

export default function SpendingAlert({ alerts }) {
  if (!alerts?.length) {
    return (
      <p className="text-sm text-muted-gray">No alerts for this month. Your spending looks healthy.</p>
    );
  }

  const ALERT_STYLES = {
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-800",
      icon: <AlertTriangle size={16} />,
    },
    danger: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      icon: <AlertCircle size={16} />,
    },
    positive: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800",
      icon: <CheckCircle2 size={16} />,
    },
  };

  return (
    <div className="space-y-3">
      {alerts.map((alert, i) => {
        const s = ALERT_STYLES[alert.type] ?? ALERT_STYLES.warning;
        return (
          <div
            key={i}
            className={`flex items-start gap-3 px-4 py-3 border ${s.bg} ${s.border}`}
            style={{ borderRadius: "6px" }}
          >
            <span className={`flex-shrink-0 mt-0.5 ${s.text}`}>{s.icon}</span>
            <p className={`text-sm ${s.text}`}>{alert.message}</p>
          </div>
        );
      })}
    </div>
  );
}
