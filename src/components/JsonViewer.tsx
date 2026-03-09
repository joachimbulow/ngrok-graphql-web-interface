import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ── Copy helper ───────────────────────────────────────────────────────────────

function copyAndToast(raw: string) {
  navigator.clipboard.writeText(raw).then(() => {
    const preview = raw.length > 48 ? raw.slice(0, 48) + "…" : raw;
    toast.success(`Copied: ${preview}`, {
      duration: 1500,
      position: "bottom-right",
    });
  });
}

// ── Clickable scalar ──────────────────────────────────────────────────────────

interface ScalarProps {
  display: string;
  copyValue: string;
  className: string;
}

function Scalar({ display, copyValue, className }: ScalarProps) {
  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        copyAndToast(copyValue);
      }}
      className={cn(
        "cursor-pointer rounded px-0.5 transition-colors hover:ring-1 hover:ring-white/20 hover:brightness-125 active:opacity-70",
        className
      )}
      title={`Click to copy: ${copyValue}`}
    >
      {display}
    </span>
  );
}

// ── Recursive renderer ────────────────────────────────────────────────────────

function renderValue(value: unknown, depth: number): React.ReactNode {
  const pad = "  ".repeat(depth + 1);
  const closePad = "  ".repeat(depth);

  if (value === null) {
    return <Scalar display="null" copyValue="null" className="text-zinc-500" />;
  }

  if (typeof value === "boolean") {
    return (
      <Scalar
        display={String(value)}
        copyValue={String(value)}
        className="text-amber-400"
      />
    );
  }

  if (typeof value === "number") {
    return (
      <Scalar
        display={String(value)}
        copyValue={String(value)}
        className="text-sky-400"
      />
    );
  }

  if (typeof value === "string") {
    return (
      <Scalar
        display={`"${value}"`}
        copyValue={value}
        className="text-emerald-400"
      />
    );
  }

  if (Array.isArray(value)) {
    if (value.length === 0)
      return <span className="text-zinc-400">{"[]"}</span>;
    return (
      <>
        <span className="text-zinc-400">{"["}</span>
        {value.map((item, i) => (
          <span key={i}>
            {"\n"}
            {pad}
            {renderValue(item, depth + 1)}
            {i < value.length - 1 && (
              <span className="text-zinc-600">{","}</span>
            )}
          </span>
        ))}
        {"\n"}
        {closePad}
        <span className="text-zinc-400">{"]"}</span>
      </>
    );
  }

  if (typeof value === "object" && value !== null) {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0)
      return <span className="text-zinc-400">{"{}"}</span>;
    return (
      <>
        <span className="text-zinc-400">{"{"}</span>
        {entries.map(([key, val], i) => (
          <span key={key}>
            {"\n"}
            {pad}
            <span className="text-zinc-400">{`"${key}"`}</span>
            <span className="text-zinc-600">{": "}</span>
            {renderValue(val, depth + 1)}
            {i < entries.length - 1 && (
              <span className="text-zinc-600">{","}</span>
            )}
          </span>
        ))}
        {"\n"}
        {closePad}
        <span className="text-zinc-400">{"}"}</span>
      </>
    );
  }

  return <span className="text-zinc-300">{String(value)}</span>;
}

// ── Public component ──────────────────────────────────────────────────────────

interface JsonViewerProps {
  /** Already-parsed JSON value */
  value?: unknown;
  /** Raw JSON string — parsed internally; falls back to plain text if invalid */
  raw?: string;
  className?: string;
}

export function JsonViewer({ value, raw, className }: JsonViewerProps) {
  let parsed: unknown = value;

  if (parsed === undefined && raw !== undefined) {
    if (!raw.trim()) {
      return <p className="text-xs text-zinc-500 italic">empty</p>;
    }
    try {
      parsed = JSON.parse(raw);
    } catch {
      // not valid JSON — render as plain text, still copyable
      return (
        <pre
          className={cn(
            "rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-zinc-300 overflow-auto font-mono whitespace-pre-wrap break-all",
            className
          )}
        >
          {raw}
        </pre>
      );
    }
  }

  return (
    <pre
      className={cn(
        "rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs overflow-auto font-mono whitespace-pre-wrap break-all select-text",
        className
      )}
    >
      {renderValue(parsed, 0)}
    </pre>
  );
}
