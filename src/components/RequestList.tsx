import { Loader2, Inbox } from "lucide-react";
import { RequestRow } from "./RequestRow";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { GraphQLRequest } from "@/lib/types";

interface RequestListProps {
  requests: GraphQLRequest[];
  isFetching: boolean;
  selectedId: string | null;
  showVariables: boolean;
  showResponse: boolean;
  onSelect: (request: GraphQLRequest) => void;
}

export function RequestList({
  requests,
  isFetching,
  selectedId,
  showVariables,
  showResponse,
  onSelect,
}: RequestListProps) {
  if (isFetching && requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-zinc-500">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Connecting to ngrok…</span>
      </div>
    );
  }

  if (!isFetching && requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-zinc-500">
        <Inbox className="h-8 w-8 opacity-40" />
        <div className="text-center">
          <p className="text-sm">No GraphQL requests yet</p>
          <p className="text-xs mt-1 opacity-60">
            Send a request through your ngrok tunnel to see it here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div>
        {requests.map((request) => (
          <RequestRow
            key={request.id}
            request={request}
            selected={request.id === selectedId}
            showVariables={showVariables}
            showResponse={showResponse}
            onClick={() => onSelect(request)}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
