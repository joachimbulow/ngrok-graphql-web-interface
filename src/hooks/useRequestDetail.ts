import { useQuery } from "@tanstack/react-query";
import { fetchRequestDetail } from "@/lib/ngrok";

export function useRequestDetail(id: string | null) {
  return useQuery({
    queryKey: ["request-detail", id],
    queryFn: () => fetchRequestDetail(id!),
    enabled: id !== null,
    staleTime: 30_000,
  });
}
