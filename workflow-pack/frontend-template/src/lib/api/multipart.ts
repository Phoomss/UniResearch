import { ApiError } from "./errors";

export async function apiMultipartRequest<T>(
  url: string,
  formData: FormData,
  token?: string,
): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    body: formData,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new ApiError(
      response.status,
      payload?.code ?? `HTTP_${response.status}`,
      payload?.message ?? payload?.detail ?? response.statusText,
      payload,
    );
  }

  return (await response.json()) as T;
}
