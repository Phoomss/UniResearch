import { BACKEND_API_URL } from "@/src/lib/api/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");
  if (!path) {
    return new Response("Missing path parameter", { status: 400 });
  }

  // To prevent path traversal vulnerability, ensure the path starts with "static/"
  if (!path.startsWith("static/")) {
    return new Response("Forbidden path prefix", { status: 403 });
  }

  // Request the asset from backend API URL
  try {
    const assetUrl = `${BACKEND_API_URL}/${path}`;
    const response = await fetch(assetUrl);
    if (!response.ok) {
      return new Response("Asset not found", { status: response.status });
    }

    const headers = new Headers();
    const contentType = response.headers.get("content-type");
    if (contentType) {
      headers.set("content-type", contentType);
    }
    const cacheControl = response.headers.get("cache-control");
    if (cacheControl) {
      headers.set("cache-control", cacheControl);
    }

    return new Response(response.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    return new Response("Error fetching asset", { status: 500 });
  }
}
