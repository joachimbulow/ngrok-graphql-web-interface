import { useState, useCallback, useMemo } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";
import { Toolbar } from "@/components/Toolbar";
import { RequestList } from "@/components/RequestList";
import { DetailSheet } from "@/components/DetailSheet";
import { queryClient } from "@/lib/query-client";
import { useGraphQLRequests } from "@/hooks/useGraphQLRequests";
import type { GraphQLRequest, OperationType } from "@/lib/types";

type TypeFilter = OperationType | "all";

function Inspector() {
  const { data: requests = [], isFetching } = useGraphQLRequests();
  const [selectedRequest, setSelectedRequest] = useState<GraphQLRequest | null>(null);
  const [showVariables, setShowVariables] = useState(true);
  const [showResponse, setShowResponse] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  const filteredRequests = useMemo(() => {
    let result = requests;
    if (typeFilter !== "all") {
      result = result.filter((r) => r.operationType === typeFilter);
    }
    if (search.trim()) {
      const lower = search.toLowerCase();
      result = result.filter((r) =>
        (r.operationName ?? "").toLowerCase().includes(lower)
      );
    }
    return result;
  }, [requests, typeFilter, search]);

  const handleSelect = useCallback((request: GraphQLRequest) => {
    setSelectedRequest(request);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100">
      <Header isPolling={isFetching} requestCount={filteredRequests.length} />
      <Toolbar
        showVariables={showVariables}
        onToggleVariables={() => setShowVariables((v) => !v)}
        showResponse={showResponse}
        onToggleResponse={() => setShowResponse((v) => !v)}
        search={search}
        onSearchChange={setSearch}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
      />
      <div className="flex-1 min-h-0">
        <RequestList
          requests={filteredRequests}
          isFetching={isFetching}
          selectedId={selectedRequest?.id ?? null}
          showVariables={showVariables}
          showResponse={showResponse}
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
        <Toaster theme="dark" richColors />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
