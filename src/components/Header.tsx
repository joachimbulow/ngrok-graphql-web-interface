import { ExternalLink, Radio } from "lucide-react";
import { LiveIndicator } from "./LiveIndicator";
import { useTunnels } from "@/hooks/useTunnels";

interface HeaderProps {
  isPolling: boolean;
  requestCount: number;
}

export function Header({ isPolling, requestCount }: HeaderProps) {
  const { data: tunnels } = useTunnels();
  const primaryTunnel = tunnels?.[0];

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-zinc-800 bg-zinc-950">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-blue-400" />
          <span className="text-sm font-semibold text-zinc-100">
            ngrok GraphQL Inspector
          </span>
        </div>
        {primaryTunnel && (
          <a
            href={primaryTunnel.publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors font-mono"
          >
            {primaryTunnel.publicUrl}
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
      <div className="flex items-center gap-4">
        {requestCount > 0 && (
          <span className="text-xs text-zinc-500">
            {requestCount} request{requestCount !== 1 ? "s" : ""}
          </span>
        )}
        <LiveIndicator active={isPolling} />
      </div>
    </header>
  );
}
