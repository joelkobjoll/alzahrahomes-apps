import type { Hono } from 'hono';
import type { StatusCode } from 'hono/utils/http-status';

/**
 * Expected shape of a standard API response envelope.
 */
export interface ApiResponseEnvelope<T = unknown> {
  data?: T;
  error?: {
    status: number;
    code: string;
    message: string;
    details?: Record<string, string[]>;
    requestId?: string;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Assert that a JSON response conforms to the envelope shape.
 * Throws if the shape is invalid.
 */
export function assertEnvelopeShape<T>(
  body: unknown,
  options?: {
    expectData?: boolean;
    expectError?: boolean;
    expectPagination?: boolean;
  }
): asserts body is ApiResponseEnvelope<T> {
  if (typeof body !== 'object' || body === null) {
    throw new Error('Response body is not an object');
  }

  const envelope = body as Record<string, unknown>;

  if (options?.expectData && !('data' in envelope)) {
    throw new Error('Expected envelope to contain "data" field');
  }

  if (options?.expectError && !('error' in envelope)) {
    throw new Error('Expected envelope to contain "error" field');
  }

  if (options?.expectPagination && !('pagination' in envelope)) {
    throw new Error('Expected envelope to contain "pagination" field');
  }

  if ('error' in envelope && envelope.error !== undefined) {
    const err = envelope.error as Record<string, unknown>;
    if (typeof err.status !== 'number') {
      throw new Error('Envelope error.status is not a number');
    }
    if (typeof err.code !== 'string') {
      throw new Error('Envelope error.code is not a string');
    }
    if (typeof err.message !== 'string') {
      throw new Error('Envelope error.message is not a string');
    }
  }

  if ('pagination' in envelope && envelope.pagination !== undefined) {
    const pag = envelope.pagination as Record<string, unknown>;
    const required = ['page', 'limit', 'total', 'totalPages', 'hasNext', 'hasPrev'];
    for (const key of required) {
      if (!(key in pag)) {
        throw new Error(`Envelope pagination is missing "${key}"`);
      }
    }
  }
}

/**
 * Helper to make a typed request against a Hono app in tests.
 */
export async function requestApp<T = unknown>(
  app: Hono,
  options: {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    path: string;
    headers?: Record<string, string>;
    body?: unknown;
    query?: Record<string, string>;
  }
): Promise<{
  status: StatusCode;
  headers: Headers;
  body: T;
  text: string;
}> {
  const url = new URL(options.path, 'http://localhost');
  if (options.query) {
    for (const [key, value] of Object.entries(options.query)) {
      url.searchParams.set(key, value);
    }
  }

  const init: RequestInit = {
    method: options.method,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  if (options.body !== undefined) {
    init.body = JSON.stringify(options.body);
  }

  const req = new Request(url.toString(), init);
  const res = await app.fetch(req);
  const text = await res.text();
  let parsedBody: T;
  try {
    parsedBody = JSON.parse(text) as T;
  } catch {
    parsedBody = text as unknown as T;
  }

  return {
    status: res.status as StatusCode,
    headers: res.headers,
    body: parsedBody,
    text,
  };
}

/**
 * Authenticate a request in tests by injecting user context.
 * Returns headers suitable for passing to requestApp.
 */
export function authenticateRequest(options: {
  userId: string;
  email: string;
  role: string;
  accessToken?: string;
}): Record<string, string> {
  const headers: Record<string, string> = {};

  if (options.accessToken) {
    headers['Authorization'] = `Bearer ${options.accessToken}`;
  }

  // Inject user context header for internal service tests
  headers['X-User-Id'] = options.userId;
  headers['X-User-Email'] = options.email;
  headers['X-User-Role'] = options.role;

  return headers;
}

/**
 * Validate that a response has a successful status code (2xx).
 */
export function assertSuccess(status: number): void {
  if (status < 200 || status >= 300) {
    throw new Error(`Expected success status, got ${status}`);
  }
}

/**
 * Validate that a response has an error status code (4xx or 5xx).
 */
export function assertError(status: number): void {
  if (status >= 200 && status < 400) {
    throw new Error(`Expected error status, got ${status}`);
  }
}
