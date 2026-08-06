import { NextResponse } from "next/server";
import type { ApiResult } from "./types";
import { clearSession } from "./session";

export async function toRouteResponse<T>(
  result: ApiResult<T>,
  successStatus = 200,
) {
  if (!result.ok && result.error.status === 401) {
    await clearSession();
  }

  return result.ok
    ? NextResponse.json(result.data, { status: successStatus })
    : NextResponse.json(
        { error: result.error },
        { status: result.error.status || 503 },
      );
}
