import { useQuery } from "@tanstack/react-query";
import { fetchTunnels } from "@/lib/ngrok";

export function useTunnels() {
  return useQuery({
    queryKey: ["tunnels"],
    queryFn: fetchTunnels,
    refetchInterval: 10_000,
    staleTime: 5_000,
  });
}
