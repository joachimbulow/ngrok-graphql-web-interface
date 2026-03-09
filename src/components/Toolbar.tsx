import { Search, X, Braces, FileJson } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { OperationType } from "@/lib/types";

type TypeFilter = OperationType | "all";

interface ToolbarProps {
  showVariables: boolean;
  onToggleVariables: () => void;
  showResponse: boolean;
  onToggleResponse: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  typeFilter: TypeFilter;
  onTypeFilterChange: (value: TypeFilter) => void;
}

const TYPE_FILTERS: { value: TypeFilter; label: string; activeClass: string }[] = [
  { value: "all", label: "All", activeClass: "text-zinc-200 bg-zinc-700 hover:bg-zinc-600" },
  {
    value: "query",
    label: "Query",
    activeClass: "text-blue-400 bg-blue-500/15 hover:bg-blue-500/25",
  },
  {
    value: "mutation",
    label: "Mutation",
    activeClass: "text-amber-400 bg-amber-500/15 hover:bg-amber-500/25",
  },
  {
    value: "subscription",
    label: "Subscription",
    activeClass: "text-purple-400 bg-purple-500/15 hover:bg-purple-500/25",
  },
];

export function Toolbar({
  showVariables,
  onToggleVariables,
  showResponse,
  onToggleResponse,
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
}: ToolbarProps) {
  return (
    <div className="border-b border-zinc-800 bg-zinc-950">
      {/* Row 1: search + view toggles */}
      <div className="flex items-center gap-2 px-4 py-1.5">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filter by operation name…"
            className="w-full h-7 bg-zinc-900 border border-zinc-800 rounded-md pl-8 pr-7 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-0 transition-colors"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
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
            Variables
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleResponse}
            className={cn(
              "h-7 px-2.5 gap-1.5 text-xs font-normal",
              showResponse
                ? "text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 hover:text-blue-300"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <FileJson className="h-3.5 w-3.5" />
            Response
          </Button>
        </div>
      </div>

      {/* Row 2: type filter chips */}
      <div className="flex items-center gap-1 px-4 pb-1.5">
        {TYPE_FILTERS.map(({ value, label, activeClass }) => (
          <button
            key={value}
            onClick={() => onTypeFilterChange(value)}
            className={cn(
              "h-5 px-2 rounded text-xs font-medium transition-colors",
              typeFilter === value
                ? activeClass
                : "text-zinc-600 hover:text-zinc-400"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
