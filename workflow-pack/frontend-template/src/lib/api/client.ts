import { ApiError } from "./errors";

function getBackendBaseUrl(): string {
  const baseUrl = process.env.BACKEND_URL;
  if (!baseUrl) {
    throw new Error("BACKEND_URL is not configured");
  }

  const prefix = process.env.BACKEND_API_PREFIX ?? "";
  return `${baseUrl.replace(/\/$/, "")}${prefix}`;
}

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  token?: string;
};

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { body, token, headers, ...requestOptions } = options;
  const response = await fetch(`${getBackendBaseUrl()}${path}`, {
    ...requestOptions,
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: {
      Accept: "application/json",
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    cache: requestOptions.cache ?? "no-store",
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new ApiError(
      response.status,
      payload?.code ?? payload?.detail?.code ?? `HTTP_${response.status}`,
      payload?.message ??
        payload?.detail?.message ??
        (typeof payload?.detail === "string" ? payload.detail : response.statusText),
      payload?.details ?? payload?.detail,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
