import type { ApiError } from '@alzahra/types';

const API_BASE_URL =
  (typeof process !== 'undefined' && process.env.API_URL) ||
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) ||
  'http://localhost:4000';

const AUTH_BASE_URL =
  (typeof process !== 'undefined' && process.env.AUTH_URL) ||
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_AUTH_URL) ||
  'http://localhost:4001';

function buildUrl(base: string, path: string): string {
  const b = base.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}`;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

class ApiErrorException extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'ApiErrorException';
  }
}

export function isApiError(error: unknown): error is ApiErrorException {
  return error instanceof ApiErrorException;
}

async function handleResponse<T>(res: Response): Promise<T> {
  const json = (await res.json()) as ApiResponse<T>;

  if (!res.ok || json.error) {
    const err = json.error ?? { status: res.status, code: 'UNKNOWN_ERROR', message: res.statusText };
    throw new ApiErrorException(err.status, err.code, err.message, err.details);
  }

  if (json.data === null || json.data === undefined) {
    throw new ApiErrorException(res.status, 'EMPTY_RESPONSE', 'Empty response from server');
  }

  return json.data;
}

function createClient(baseUrl: string) {
  return {
    get: async <T>(path: string, init?: RequestInit): Promise<T> => {
      const res = await fetch(buildUrl(baseUrl, path), {
        ...init,
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...init?.headers,
        },
      });
      return handleResponse<T>(res);
    },

    post: async <T>(path: string, body?: unknown, init?: RequestInit): Promise<T> => {
      const options: RequestInit = {
        ...init,
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...init?.headers,
        },
      };
      if (body !== undefined) {
        options.body = JSON.stringify(body);
      }
      const res = await fetch(buildUrl(baseUrl, path), options);
      return handleResponse<T>(res);
    },

    put: async <T>(path: string, body?: unknown, init?: RequestInit): Promise<T> => {
      const options: RequestInit = {
        ...init,
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...init?.headers,
        },
      };
      if (body !== undefined) {
        options.body = JSON.stringify(body);
      }
      const res = await fetch(buildUrl(baseUrl, path), options);
      return handleResponse<T>(res);
    },

    patch: async <T>(path: string, body?: unknown, init?: RequestInit): Promise<T> => {
      const options: RequestInit = {
        ...init,
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...init?.headers,
        },
      };
      if (body !== undefined) {
        options.body = JSON.stringify(body);
      }
      const res = await fetch(buildUrl(baseUrl, path), options);
      return handleResponse<T>(res);
    },

    delete: async <T>(path: string, init?: RequestInit): Promise<T> => {
      const res = await fetch(buildUrl(baseUrl, path), {
        ...init,
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...init?.headers,
        },
      });
      return handleResponse<T>(res);
    },
  };
}

export const api = createClient(API_BASE_URL);
export const auth = createClient(AUTH_BASE_URL);
export { ApiErrorException };
