import { useQuery } from "@tanstack/react-query";
import { fetchGraphQLRequests } from "@/lib/ngrok";

export function useGraphQLRequests() {
  return useQuery({
    queryKey: ["requests"],
    queryFn: fetchGraphQLRequests,
    refetchInterval: 1500,
    staleTime: 0,
  });
}
