import { cn } from "@/lib/utils";

interface LiveIndicatorProps {
  active: boolean;
  className?: string;
}

export function LiveIndicator({ active, className }: LiveIndicatorProps) {
  return (
    <span className={cn("flex items-center gap-1.5", className)}>
      <span className="relative flex h-2 w-2">
        {active && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        )}
        <span
          className={cn(
            "relative inline-flex h-2 w-2 rounded-full",
            active ? "bg-emerald-500" : "bg-zinc-600"
          )}
        />
      </span>
      <span className={cn("text-xs", active ? "text-emerald-400" : "text-zinc-500")}>
        {active ? "Live" : "Paused"}
      </span>
    </span>
  );
}
