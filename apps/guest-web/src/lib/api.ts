import type { Property, Booking, Recommendation, Feedback } from '@alzahra/types/domain';

export interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

export interface ValidateResponse {
  valid: boolean;
  userId?: string;
}

export interface StayResponse {
  property: Property;
  booking: Booking;
}

export interface RecommendationsResponse {
  recommendations: Recommendation[];
}

export interface ChatMessage {
  id: string;
  sender: 'guest' | 'host';
  body: string;
  createdAt: string;
}

export interface MessagesResponse {
  messages: ChatMessage[];
}

export interface MessageResponse {
  message: ChatMessage;
}

export interface FeedbackResponse {
  feedback: Feedback;
}

function getBaseUrl(): string {
  const metaEnv = (typeof import.meta !== 'undefined' && (import.meta as unknown as Record<string, Record<string, string> | undefined>).env?.PUBLIC_API_URL)
    ?? undefined;
  if (metaEnv) return metaEnv;

  const windowEnv = (typeof window !== 'undefined' && (window as unknown as Record<string, string | undefined>).PUBLIC_API_URL)
    ?? undefined;
  if (windowEnv) return windowEnv;

  return 'http://localhost:4000';
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit & { token?: string } = {}
): Promise<ApiResponse<T>> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) ?? {}),
  };

  if (options.token) {
    headers['x-guest-token'] = options.token;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  // Some endpoints may return 204 No Content
  if (res.status === 204) {
    return { data: null as unknown as T, error: null };
  }

  const body = (await res.json().catch(() => ({}))) as ApiResponse<T>;

  if (!res.ok) {
    return {
      data: null,
      error: body.error ?? {
        status: res.status,
        code: 'UNKNOWN_ERROR',
        message: res.statusText,
      },
    };
  }

  return body;
}

export const api = {
  validateToken(token: string) {
    return apiRequest<ValidateResponse>('/v1/guest/validate', {
      method: 'POST',
      token,
      body: JSON.stringify({ token }),
    });
  },

  getStay(token: string) {
    return apiRequest<StayResponse>('/v1/guest/stay', {
      method: 'GET',
      token,
    });
  },

  getRecommendations(token: string) {
    return apiRequest<RecommendationsResponse>('/v1/guest/recommendations', {
      method: 'GET',
      token,
    });
  },

  getMessages(token: string) {
    return apiRequest<MessagesResponse>('/v1/guest/messages', {
      method: 'GET',
      token,
    });
  },

  sendMessage(token: string, body: string) {
    return apiRequest<MessageResponse>('/v1/guest/messages', {
      method: 'POST',
      token,
      body: JSON.stringify({ body }),
    });
  },

  sendFeedback(token: string, payload: {
    rating: number;
    cleanliness?: number | null;
    communication?: number | null;
    location?: number | null;
    value?: number | null;
    comment?: string | null;
  }) {
    return apiRequest<FeedbackResponse>('/v1/guest/feedback', {
      method: 'POST',
      token,
      body: JSON.stringify(payload),
    });
  },
};
