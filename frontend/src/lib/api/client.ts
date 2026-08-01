import { networkError, normalizeApiError } from "./errors";
import type { ApiResult } from "./types";

export const BACKEND_API_URL = (process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000").replace(/\/$/,"");

interface ApiOptions extends Omit<RequestInit,"body"> { token?:string|null; body?:BodyInit|null; }

export async function apiRequest<T>(path:string, options:ApiOptions={}):Promise<ApiResult<T>> {
  const headers = new Headers(options.headers);
  if (options.token) headers.set("Authorization",`Bearer ${options.token}`);
  try {
    const response = await fetch(`${BACKEND_API_URL}${path}`, {...options,headers,cache:options.cache ?? "no-store"});
    const text = await response.text();
    let body:unknown = null;
    if (text) { try { body=JSON.parse(text); } catch { body={detail:text}; } }
    if (!response.ok) return {ok:false,error:normalizeApiError(response.status,body)};
    return {ok:true,data:body as T};
  } catch { return {ok:false,error:networkError()}; }
}

export async function apiJson<T>(path:string, method:string, value:unknown, token?:string|null):Promise<ApiResult<T>> {
  return apiRequest<T>(path,{method,token,headers:{"Content-Type":"application/json"},body:JSON.stringify(value)});
}
