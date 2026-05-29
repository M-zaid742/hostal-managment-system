const baseUrl = import.meta.env.VITE_API_URL || "/api";

function normalizeUrl(path) {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

export async function apiGet(path) {
  const token = localStorage.getItem("auth_token");
  const response = await fetch(normalizeUrl(path), {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `Request failed (${response.status})`);
  }

  // Handle empty responses
  const contentLength = response.headers.get('content-length');
  if (contentLength === '0' || response.status === 204) {
    return [];
  }

  const text = await response.text();
  if (!text) {
    return [];
  }

  return JSON.parse(text);
}

async function requestWithBody(method, path, payload) {
  const token = localStorage.getItem("auth_token");
  const response = await fetch(normalizeUrl(path), {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `Request failed (${response.status})`);
  }

  // Handle empty responses
  const contentLength = response.headers.get('content-length');
  if (contentLength === '0' || response.status === 204) {
    return {};
  }

  const text = await response.text();
  if (!text) {
    return {};
  }

  return JSON.parse(text);
}

export async function apiPost(path, payload) {
  return requestWithBody("POST", path, payload);
}

export async function apiPut(path, payload) {
  return requestWithBody("PUT", path, payload);
}

export async function apiDelete(path) {
  const token = localStorage.getItem("auth_token");
  const response = await fetch(normalizeUrl(path), {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `Request failed (${response.status})`);
  }

  return response.json();
}
