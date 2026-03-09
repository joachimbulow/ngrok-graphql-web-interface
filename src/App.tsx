import { useState, useCallback } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";
import { Toolbar } from "@/components/Toolbar";
import { RequestList } from "@/components/RequestList";
import { DetailSheet } from "@/components/DetailSheet";
import { queryClient } from "@/lib/query-client";
import { useGraphQLRequests } from "@/hooks/useGraphQLRequests";
import type { GraphQLRequest } from "@/lib/types";

function Inspector() {
  const { data: requests = [], isFetching } = useGraphQLRequests();
  const [selectedRequest, setSelectedRequest] = useState<GraphQLRequest | null>(null);
  const [showVariables, setShowVariables] = useState(true);

  const handleSelect = useCallback((request: GraphQLRequest) => {
    setSelectedRequest(request);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100">
      <Header isPolling={isFetching} requestCount={requests.length} />
      <Toolbar
        showVariables={showVariables}
        onToggleVariables={() => setShowVariables((v) => !v)}
      />
      <div className="flex-1 min-h-0">
        <RequestList
          requests={requests}
          isFetching={isFetching}
          selectedId={selectedRequest?.id ?? null}
          showVariables={showVariables}
          onSelect={handleSelect}
        />
      </div>
      <DetailSheet
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Inspector />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
