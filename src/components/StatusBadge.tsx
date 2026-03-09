import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  statusCode: number;
  className?: string;
}

function getStatusColor(code: number): string {
  if (code === 0) return "text-zinc-500";
  if (code < 300) return "text-emerald-400";
  if (code < 400) return "text-blue-400";
  if (code < 500) return "text-amber-400";
  return "text-red-400";
}

export function StatusBadge({ statusCode, className }: StatusBadgeProps) {
  return (
    <span className={cn("font-mono text-xs font-semibold", getStatusColor(statusCode), className)}>
      {statusCode === 0 ? "—" : statusCode}
    </span>
  );
}
