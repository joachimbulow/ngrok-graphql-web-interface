import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface VariablesPanelProps {
  variables: Record<string, unknown> | null;
  className?: string;
}

export function VariablesPanel({ variables, className }: VariablesPanelProps) {
  const [open, setOpen] = useState(false);

  if (!variables || Object.keys(variables).length === 0) {
    return (
      <span className="text-xs text-zinc-500 italic">no variables</span>
    );
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen} className={cn("w-full", className)}>
      <CollapsibleTrigger className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors">
        {open ? (
          <ChevronDown className="h-3 w-3" />
        ) : (
          <ChevronRight className="h-3 w-3" />
        )}
        {open ? "hide variables" : `show variables (${Object.keys(variables).length})`}
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <pre className="rounded-md bg-zinc-900 p-3 text-xs text-zinc-300 overflow-auto max-h-64 border border-zinc-800">
          {JSON.stringify(variables, null, 2)}
        </pre>
      </CollapsibleContent>
    </Collapsible>
  );
}
