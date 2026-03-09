import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { OperationType } from "@/lib/types";

interface OperationBadgeProps {
  type: OperationType;
  className?: string;
}

const CONFIG: Record<OperationType, { label: string; className: string }> = {
  query: {
    label: "query",
    className:
      "border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20",
  },
  mutation: {
    label: "mutation",
    className:
      "border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20",
  },
  subscription: {
    label: "subscription",
    className:
      "border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20",
  },
  unknown: {
    label: "unknown",
    className:
      "border-zinc-500/30 bg-zinc-500/10 text-zinc-400 hover:bg-zinc-500/20",
  },
};

export function OperationBadge({ type, className }: OperationBadgeProps) {
  const { label, className: colorClass } = CONFIG[type];
  return (
    <Badge variant="outline" className={cn("font-mono text-xs", colorClass, className)}>
      {label}
    </Badge>
  );
}
