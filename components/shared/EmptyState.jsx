import { FolderOpen } from "lucide-react";

export default function EmptyState({ message, action, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <FolderOpen
        size={64}
        className="mb-4 opacity-30 text-muted-gray"
        aria-hidden="true"
      />
      <p className="text-sm text-gray-500 max-w-xs">{message}</p>
      {action && onAction && (
        <button
          onClick={onAction}
          className="mt-4 text-sm text-near-black underline underline-offset-2 hover:opacity-70 transition-opacity cursor-pointer"
        >
          {action}
        </button>
      )}
    </div>
  );
}
