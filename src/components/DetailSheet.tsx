import { useState } from "react";
import { format } from "date-fns";
import { RotateCcw, Loader2, ChevronDown, ChevronRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { OperationBadge } from "./OperationBadge";
import { StatusBadge } from "./StatusBadge";
import { VariablesPanel } from "./VariablesPanel";
import { useRequestDetail } from "@/hooks/useRequestDetail";
import { replayRequest } from "@/lib/ngrok";
import type { GraphQLRequest } from "@/lib/types";

interface DetailSheetProps {
  request: GraphQLRequest | null;
  onClose: () => void;
}

function SectionHeader({
  title,
  open,
  onToggle,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider hover:text-zinc-200 transition-colors w-full text-left"
    >
      {open ? (
        <ChevronDown className="h-3 w-3" />
      ) : (
        <ChevronRight className="h-3 w-3" />
      )}
      {title}
    </button>
  );
}

function HeadersTable({ headers }: { headers: Record<string, string> }) {
  const entries = Object.entries(headers);
  if (entries.length === 0)
    return <p className="text-xs text-zinc-500 italic">none</p>;
  return (
    <div className="rounded-md border border-zinc-800 overflow-hidden">
      <table className="w-full text-xs">
        <tbody>
          {entries.map(([key, value]) => (
            <tr key={key} className="border-b border-zinc-800 last:border-0">
              <td className="px-3 py-1.5 font-mono text-zinc-400 bg-zinc-900/50 w-2/5 break-all">
                {key}
              </td>
              <td className="px-3 py-1.5 font-mono text-zinc-300 break-all">
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function JsonBlock({ value }: { value: string }) {
  if (!value.trim()) return <p className="text-xs text-zinc-500 italic">empty</p>;
  let formatted = value;
  try {
    formatted = JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    // leave as-is if not valid JSON
  }
  return (
    <pre className="rounded-md bg-zinc-900 border border-zinc-800 p-3 text-xs text-zinc-300 overflow-auto max-h-80 font-mono whitespace-pre-wrap break-all">
      {formatted}
    </pre>
  );
}

export function DetailSheet({ request, onClose }: DetailSheetProps) {
  const { data: detail, isLoading } = useRequestDetail(request?.id ?? null);
  const [replayState, setReplayState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [reqHeadersOpen, setReqHeadersOpen] = useState(false);
  const [resHeadersOpen, setResHeadersOpen] = useState(false);

  async function handleReplay() {
    if (!request) return;
    setReplayState("loading");
    try {
      await replayRequest(request.id);
      setReplayState("done");
      setTimeout(() => setReplayState("idle"), 2000);
    } catch {
      setReplayState("error");
      setTimeout(() => setReplayState("idle"), 2000);
    }
  }

  const latency = request
    ? request.latencyMs >= 1000
      ? `${(request.latencyMs / 1000).toFixed(1)}s`
      : `${request.latencyMs}ms`
    : null;

  return (
    <Sheet open={request !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl flex flex-col p-0 bg-zinc-950 border-zinc-800"
      >
        {request && (
          <>
            <SheetHeader className="px-6 pt-6 pb-4 border-b border-zinc-800 shrink-0">
              <div className="flex items-start justify-between gap-3 pr-8">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <OperationBadge type={request.operationType} />
                    {request.statusCode > 0 && (
                      <StatusBadge statusCode={request.statusCode} />
                    )}
                    {latency && (
                      <span className="text-xs font-mono text-zinc-500">{latency}</span>
                    )}
                  </div>
                  <SheetTitle className="text-zinc-100 font-mono text-base">
                    {request.operationName ?? (
                      <span className="italic text-zinc-400 font-sans font-normal text-sm">
                        anonymous operation
                      </span>
                    )}
                  </SheetTitle>
                  <SheetDescription className="text-xs text-zinc-500">
                    {format(request.timestamp, "MMM d, yyyy HH:mm:ss.SSS")}
                  </SheetDescription>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleReplay}
                  disabled={replayState === "loading"}
                  className={
                    replayState === "done"
                      ? "border-emerald-500/50 text-emerald-400"
                      : replayState === "error"
                      ? "border-red-500/50 text-red-400"
                      : "border-zinc-700 text-zinc-300 hover:border-zinc-500"
                  }
                >
                  {replayState === "loading" ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <RotateCcw className="h-3.5 w-3.5" />
                  )}
                  {replayState === "done"
                    ? "Replayed!"
                    : replayState === "error"
                    ? "Failed"
                    : "Replay"}
                </Button>
              </div>
            </SheetHeader>

            <ScrollArea className="flex-1 min-h-0">
              <div className="px-6 py-4 space-y-6">
                {/* Variables */}
                <section>
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Variables
                  </p>
                  <VariablesPanel variables={request.variables} />
                </section>

                <Separator className="bg-zinc-800" />

                {/* Request body */}
                <section>
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Request body
                  </p>
                  {isLoading ? (
                    <div className="flex items-center gap-2 text-zinc-500 text-xs">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Loading…
                    </div>
                  ) : (
                    <JsonBlock value={detail?.requestBody ?? ""} />
                  )}
                </section>

                {/* Request headers */}
                <section>
                  <Collapsible open={reqHeadersOpen} onOpenChange={setReqHeadersOpen}>
                    <SectionHeader
                      title="Request headers"
                      open={reqHeadersOpen}
                      onToggle={() => setReqHeadersOpen((v) => !v)}
                    />
                    <CollapsibleContent className="mt-2">
                      {isLoading ? (
                        <div className="flex items-center gap-2 text-zinc-500 text-xs">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Loading…
                        </div>
                      ) : (
                        <HeadersTable headers={detail?.requestHeaders ?? {}} />
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                </section>

                <Separator className="bg-zinc-800" />

                {/* Response body */}
                <section>
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Response body
                  </p>
                  {isLoading ? (
                    <div className="flex items-center gap-2 text-zinc-500 text-xs">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Loading…
                    </div>
                  ) : (
                    <JsonBlock value={detail?.responseBody ?? ""} />
                  )}
                </section>

                {/* Response headers */}
                <section className="pb-6">
                  <Collapsible open={resHeadersOpen} onOpenChange={setResHeadersOpen}>
                    <SectionHeader
                      title="Response headers"
                      open={resHeadersOpen}
                      onToggle={() => setResHeadersOpen((v) => !v)}
                    />
                    <CollapsibleContent className="mt-2">
                      {isLoading ? (
                        <div className="flex items-center gap-2 text-zinc-500 text-xs">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Loading…
                        </div>
                      ) : (
                        <HeadersTable headers={detail?.responseHeaders ?? {}} />
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                </section>
              </div>
            </ScrollArea>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
