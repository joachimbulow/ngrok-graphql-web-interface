import { parseOperationName, parseOperationType } from "./graphql";
import type {
  GraphQLRequest,
  GraphQLRequestDetail,
  OperationType,
  Tunnel,
} from "./types";

// ── Raw ngrok API shapes (internal) ──────────────────────────────────────────

interface NgrokHeaders {
  [key: string]: string[];
}

interface NgrokRawRequest {
  method: string;
  proto: string;
  headers: NgrokHeaders;
  uri: string;
  raw: string; // base64-encoded full HTTP request bytes
}

interface NgrokRawResponse {
  status: string;
  status_code: number;
  proto: string;
  headers: NgrokHeaders;
  raw: string; // base64-encoded full HTTP response bytes
}

interface NgrokCapturedRequest {
  id: string;
  start: string; // ISO 8601
  duration: number; // nanoseconds
  request: NgrokRawRequest;
  response: NgrokRawResponse | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function flattenHeaders(headers: NgrokHeaders): Record<string, string> {
  return Object.fromEntries(
    Object.entries(headers).map(([k, v]) => [k, v.join(", ")])
  );
}

/** Decode base64 HTTP bytes and return only the body (after the blank line). */
function extractHttpBody(raw: string): string {
  try {
    const decoded = atob(raw);
    const separator = "\r\n\r\n";
    const idx = decoded.indexOf(separator);
    return idx >= 0 ? decoded.slice(idx + separator.length) : decoded;
  } catch {
    return "";
  }
}

function getFirstHeader(headers: NgrokHeaders, name: string): string {
  const key = Object.keys(headers).find(
    (k) => k.toLowerCase() === name.toLowerCase()
  );
  return key ? (headers[key]?.[0] ?? "") : "";
}

interface ParsedGraphQL {
  operationType: OperationType;
  operationName: string | null;
  variables: Record<string, unknown> | null;
  rawBody: string;
}

function parseGraphQLBody(raw: string): ParsedGraphQL | null {
  const body = extractHttpBody(raw);
  if (!body.trim()) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return null;
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("query" in parsed) ||
    typeof (parsed as Record<string, unknown>).query !== "string"
  ) {
    return null;
  }

  const gql = parsed as { query: string; variables?: Record<string, unknown> };
  return {
    operationType: parseOperationType(gql.query),
    operationName: parseOperationName(gql.query),
    variables: gql.variables ?? null,
    rawBody: body,
  };
}

function isJsonContentType(headers: NgrokHeaders): boolean {
  return getFirstHeader(headers, "Content-Type")
    .toLowerCase()
    .includes("application/json");
}

function normalizeRequest(r: NgrokCapturedRequest): GraphQLRequest | null {
  if (!isJsonContentType(r.request.headers)) return null;

  const gql = parseGraphQLBody(r.request.raw);
  if (!gql) return null;

  return {
    id: r.id,
    operationType: gql.operationType,
    operationName: gql.operationName,
    variables: gql.variables,
    statusCode: r.response?.status_code ?? 0,
    latencyMs: Math.round(r.duration / 1_000_000),
    timestamp: new Date(r.start),
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function fetchTunnels(): Promise<Tunnel[]> {
  const res = await fetch("/api/tunnels");
  if (!res.ok) throw new Error(`Failed to fetch tunnels: ${res.status}`);
  const data = (await res.json()) as { tunnels: Array<{ name: string; public_url: string; proto: string }> };
  return data.tunnels.map((t) => ({
    name: t.name,
    publicUrl: t.public_url,
    proto: t.proto,
  }));
}

export async function fetchGraphQLRequests(): Promise<GraphQLRequest[]> {
  const res = await fetch("/api/requests/http?limit=100");
  if (!res.ok) throw new Error(`Failed to fetch requests: ${res.status}`);
  const data = (await res.json()) as { requests: NgrokCapturedRequest[] };

  return data.requests
    .map(normalizeRequest)
    .filter((r): r is GraphQLRequest => r !== null);
}

export async function fetchRequestDetail(
  id: string
): Promise<GraphQLRequestDetail> {
  const res = await fetch(`/api/requests/http/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch request detail: ${res.status}`);
  const r = (await res.json()) as NgrokCapturedRequest;

  const gql = parseGraphQLBody(r.request.raw);
  const requestBody = gql?.rawBody ?? extractHttpBody(r.request.raw);
  const responseBody = r.response ? extractHttpBody(r.response.raw) : "";

  return {
    id: r.id,
    operationType: gql?.operationType ?? "unknown",
    operationName: gql?.operationName ?? null,
    variables: gql?.variables ?? null,
    statusCode: r.response?.status_code ?? 0,
    latencyMs: Math.round(r.duration / 1_000_000),
    timestamp: new Date(r.start),
    requestHeaders: flattenHeaders(r.request.headers),
    requestBody,
    responseBody,
    responseHeaders: r.response ? flattenHeaders(r.response.headers) : {},
  };
}

export async function replayRequest(id: string): Promise<void> {
  const res = await fetch("/api/requests/http", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error(`Replay failed: ${res.status}`);
}
