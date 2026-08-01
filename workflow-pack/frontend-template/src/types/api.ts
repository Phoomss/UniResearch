export type UserRole = "guest" | "student" | "advisor" | "admin";

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

// Codex must replace or extend these shapes only after reading the actual
// Pydantic schemas and runtime OpenAPI document from the backend.
