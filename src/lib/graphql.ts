import type { OperationType } from "./types";

const OPERATION_PATTERN = /^\s*(query|mutation|subscription)\s*(\w+)?/i;

export function parseOperationType(query: string): OperationType {
  // Anonymous shorthand: `{ field }` is implicitly a query
  if (query.trimStart().startsWith("{")) return "query";

  const match = query.match(OPERATION_PATTERN);
  if (!match) return "unknown";

  const keyword = match[1].toLowerCase();
  if (
    keyword === "query" ||
    keyword === "mutation" ||
    keyword === "subscription"
  ) {
    return keyword as OperationType;
  }
  return "unknown";
}

export function parseOperationName(query: string): string | null {
  if (query.trimStart().startsWith("{")) return null;

  const match = query.match(OPERATION_PATTERN);
  return match?.[2] ?? null;
}
