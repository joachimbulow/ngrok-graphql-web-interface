import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { JsonViewer } from "./JsonViewer";
import { cn } from "@/lib/utils";

interface VariablesPanelProps {
  variables: Record<string, unknown> | null;
  className?: string;
}

export function VariablesPanel({ variables, className }: VariablesPanelProps) {
  const [open, setOpen] = useState(true);

  if (!variables || Object.keys(variables).length === 0) {
    return <span className="text-xs text-zinc-500 italic">no variables</span>;
  }

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className={cn("w-full", className)}
    >
      <CollapsibleTrigger className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors">
        {open ? (
          <ChevronDown className="h-3 w-3" />
        ) : (
          <ChevronRight className="h-3 w-3" />
        )}
        {open
          ? "hide variables"
          : `show variables (${Object.keys(variables).length})`}
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <JsonViewer value={variables} className="max-h-64" />
      </CollapsibleContent>
    </Collapsible>
  );
}
