import { Braces } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  showVariables: boolean;
  onToggleVariables: () => void;
}

export function Toolbar({ showVariables, onToggleVariables }: ToolbarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-1.5 border-b border-zinc-800 bg-zinc-950">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleVariables}
          className={cn(
            "h-7 px-2.5 gap-1.5 text-xs font-normal",
            showVariables
              ? "text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 hover:text-blue-300"
              : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          <Braces className="h-3.5 w-3.5" />
          Show variables
        </Button>
      </div>
    </div>
  );
}
