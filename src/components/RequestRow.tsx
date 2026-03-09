import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { RotateCcw, Loader2, Check, X } from "lucide-react";
import { OperationBadge } from "./OperationBadge";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { replayRequest } from "@/lib/ngrok";
import type { GraphQLRequest } from "@/lib/types";

type ReplayState = "idle" | "loading" | "done" | "error";

interface RequestRowProps {
  request: GraphQLRequest;
  selected: boolean;
  showVariables: boolean;
  onClick: () => void;
}

export function RequestRow({
  request,
  selected,
  showVariables,
  onClick,
}: RequestRowProps) {
  const [replayState, setReplayState] = useState<ReplayState>("idle");

  const latency =
    request.latencyMs >= 1000
      ? `${(request.latencyMs / 1000).toFixed(1)}s`
      : `${request.latencyMs}ms`;

  const hasVariables =
    request.variables !== null && Object.keys(request.variables).length > 0;

  async function handleReplay(e: React.MouseEvent) {
    e.stopPropagation();
    if (replayState === "loading") return;
    setReplayState("loading");
    try {
      await replayRequest(request.id);
      setReplayState("done");
    } catch {
      setReplayState("error");
    }
    setTimeout(() => setReplayState("idle"), 2000);
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "w-full text-left px-4 py-3 border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors cursor-pointer",
        selected && "bg-zinc-800 border-l-2 border-l-blue-500"
      )}
    >
      <div className="flex items-start gap-3">
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
        <div className="flex-shrink-0 flex items-center gap-1">
          <div className="flex flex-col items-end gap-1 min-w-[3rem]">
            <StatusBadge statusCode={request.statusCode} />
            <span className="text-xs text-zinc-500 font-mono">{latency}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReplay}
            className={cn(
              "h-7 w-7 shrink-0",
              replayState === "done" && "text-emerald-400 hover:text-emerald-300",
              replayState === "error" && "text-red-400 hover:text-red-300",
              replayState === "idle" && "text-zinc-600 hover:text-zinc-300"
            )}
          >
            {replayState === "loading" && (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            )}
            {replayState === "done" && <Check className="h-3.5 w-3.5" />}
            {replayState === "error" && <X className="h-3.5 w-3.5" />}
            {replayState === "idle" && <RotateCcw className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>

      {showVariables && hasVariables && (
        <div className="mt-2 ml-[calc(theme(spacing.3)+4.5rem)]">
          <pre className="rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-zinc-400 overflow-auto max-h-40 font-mono whitespace-pre-wrap break-all">
            {JSON.stringify(request.variables, null, 2)}
          </pre>
        </div>
      )}

      {showVariables && !hasVariables && (
        <p className="mt-1.5 ml-[calc(theme(spacing.3)+4.5rem)] text-xs text-zinc-600 italic">
          no variables
        </p>
      )}
    </div>
  );
}
