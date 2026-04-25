const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

function buildUrl(path: string): string {
  const base = API_BASE_URL.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

export const apiClient = {
  get(path: string, init?: RequestInit) {
    return fetch(buildUrl(path), {
      ...init,
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });
  },

  post(path: string, body?: unknown, init?: RequestInit) {
    return fetch(buildUrl(path), {
      ...init,
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put(path: string, body?: unknown, init?: RequestInit) {
    return fetch(buildUrl(path), {
      ...init,
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  patch(path: string, body?: unknown, init?: RequestInit) {
    return fetch(buildUrl(path), {
      ...init,
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete(path: string, init?: RequestInit) {
    return fetch(buildUrl(path), {
      ...init,
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });
  },
};
