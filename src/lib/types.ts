export type OperationType = "query" | "mutation" | "subscription" | "unknown";

export interface GraphQLRequest {
  id: string;
  operationType: OperationType;
  operationName: string | null;
  variables: Record<string, unknown> | null;
  statusCode: number;
  latencyMs: number;
  timestamp: Date;
}

export interface GraphQLRequestDetail extends GraphQLRequest {
  requestHeaders: Record<string, string>;
  requestBody: string;
  responseBody: string;
  responseHeaders: Record<string, string>;
}

export interface Tunnel {
  name: string;
  publicUrl: string;
  proto: string;
}
