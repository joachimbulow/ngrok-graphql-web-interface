import { formatDistanceToNow } from "date-fns";
import { OperationBadge } from "./OperationBadge";
import { StatusBadge } from "./StatusBadge";
import { cn } from "@/lib/utils";
import type { GraphQLRequest } from "@/lib/types";

interface RequestRowProps {
  request: GraphQLRequest;
  selected: boolean;
  onClick: () => void;
}

export function RequestRow({ request, selected, onClick }: RequestRowProps) {
  const latency =
    request.latencyMs >= 1000
      ? `${(request.latencyMs / 1000).toFixed(1)}s`
      : `${request.latencyMs}ms`;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-4 py-3 border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors flex items-start gap-3",
        selected && "bg-zinc-800 border-l-2 border-l-blue-500"
      )}
    >
      <div className="flex-shrink-0 pt-0.5">
        <OperationBadge type={request.operationType} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-zinc-100 truncate font-medium">
          {request.operationName ?? (
            <span className="italic text-zinc-500">anonymous</span>
          )}
        </p>
        <p className="text-xs text-zinc-500 mt-0.5">
          {formatDistanceToNow(request.timestamp, { addSuffix: true })}
        </p>
      </div>
      <div className="flex-shrink-0 flex flex-col items-end gap-1">
        <StatusBadge statusCode={request.statusCode} />
        <span className="text-xs text-zinc-500 font-mono">{latency}</span>
      </div>
    </button>
  );
}
