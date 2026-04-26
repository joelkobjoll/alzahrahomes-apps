import type { Page, APIRequestContext } from '@playwright/test';
import type { Property, User, Token, Booking, Recommendation, Message, Feedback } from '@alzahra/types';

const AUTH_URL = process.env.AUTH_URL ?? 'http://localhost:4001';
const API_URL = process.env.API_URL ?? 'http://localhost:4000';
const ADMIN_API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export interface StaffCredentials {
  email: string;
  password: string;
}

export async function registerStaff(api: APIRequestContext, user: { email: string; password: string; firstName: string; lastName: string; phone?: string }): Promise<{ user: User }> {
  const res = await api.post(`${AUTH_URL}/register`, { data: user });
  if (!res.ok()) {
    const text = await res.text();
    throw new Error(`Failed to register staff: ${res.status()} ${text}`);
  }
  const json = (await res.json()) as { data: { user: User } };
  return json.data;
}

export async function loginStaff(api: APIRequestContext, credentials: StaffCredentials): Promise<{ cookies: string }> {
  const res = await api.post(`${AUTH_URL}/login`, { data: credentials });
  if (!res.ok()) {
    const text = await res.text();
    throw new Error(`Failed to login staff: ${res.status()} ${text}`);
  }
  const cookies = res.headers()['set-cookie'] ?? '';
  return { cookies };
}

export async function logoutStaff(api: APIRequestContext, cookies: string): Promise<void> {
  await api.post(`${AUTH_URL}/logout`, { headers: { Cookie: cookies } });
}

export async function getMe(api: APIRequestContext, cookies: string): Promise<User | null> {
  const res = await api.get(`${AUTH_URL}/me`, { headers: { Cookie: cookies } });
  if (!res.ok()) return null;
  const json = (await res.json()) as { data: { user: User } };
  return json.data.user;
}

export async function createProperty(api: APIRequestContext, property: unknown): Promise<Property> {
  const res = await api.post(`${API_URL}/properties`, { data: property });
  if (!res.ok()) {
    const text = await res.text();
    throw new Error(`Failed to create property: ${res.status()} ${text}`);
  }
  const json = (await res.json()) as { data: Property };
  return json.data;
}

export async function listProperties(api: APIRequestContext): Promise<Property[]> {
  const res = await api.get(`${API_URL}/properties`);
  if (!res.ok()) {
    const text = await res.text();
    throw new Error(`Failed to list properties: ${res.status()} ${text}`);
  }
  const json = (await res.json()) as { data: Property[] };
  return json.data;
}

export async function getProperty(api: APIRequestContext, id: string): Promise<Property> {
  const res = await api.get(`${API_URL}/properties/${id}`);
  if (!res.ok()) {
    const text = await res.text();
    throw new Error(`Failed to get property: ${res.status()} ${text}`);
  }
  const json = (await res.json()) as { data: Property };
  return json.data;
}

export async function updateProperty(api: APIRequestContext, id: string, data: Record<string, unknown>): Promise<Property> {
  const res = await api.patch(`${API_URL}/properties/${id}`, { data });
  if (!res.ok()) {
    const text = await res.text();
    throw new Error(`Failed to update property: ${res.status()} ${text}`);
  }
  const json = (await res.json()) as { data: Property };
  return json.data;
}

export async function deleteProperty(api: APIRequestContext, id: string): Promise<void> {
  const res = await api.delete(`${API_URL}/properties/${id}`);
  if (!res.ok()) {
    const text = await res.text();
    throw new Error(`Failed to delete property: ${res.status()} ${text}`);
  }
}

export async function generateToken(api: APIRequestContext, data: { userId: string; type: string; expiresAt?: string; metadata?: Record<string, unknown> }): Promise<{ token: Token; plainToken: string }> {
  const res = await api.post(`${API_URL}/tokens`, { data });
  if (!res.ok()) {
    const text = await res.text();
    throw new Error(`Failed to generate token: ${res.status()} ${text}`);
  }
  const json = (await res.json()) as { data: { token: Token; plainToken: string } };
  return json.data;
}

export async function validateToken(api: APIRequestContext, plainToken: string): Promise<Token> {
  const res = await api.get(`${API_URL}/tokens/validate`, { headers: { 'x-guest-token': plainToken } });
  if (!res.ok()) {
    const text = await res.text();
    throw new Error(`Failed to validate token: ${res.status()} ${text}`);
  }
  const json = (await res.json()) as { data: Token };
  return json.data;
}

export async function revokeToken(api: APIRequestContext, tokenId: string): Promise<Token> {
  const res = await api.post(`${API_URL}/tokens/${tokenId}/revoke`);
  if (!res.ok()) {
    const text = await res.text();
    throw new Error(`Failed to revoke token: ${res.status()} ${text}`);
  }
  const json = (await res.json()) as { data: Token };
  return json.data;
}

export async function createBooking(api: APIRequestContext, data: Record<string, unknown>): Promise<Booking> {
  // Note: bookings endpoint is not fully implemented in API, using direct DB or skipping
  const res = await api.post(`${API_URL}/bookings`, { data });
  if (!res.ok()) {
    const text = await res.text();
    throw new Error(`Failed to create booking: ${res.status()} ${text}`);
  }
  const json = (await res.json()) as { data: Booking };
  return json.data;
}

export async function createRecommendation(api: APIRequestContext, data: Record<string, unknown>): Promise<Recommendation> {
  const res = await api.post(`${API_URL}/recommendations`, { data });
  if (!res.ok()) {
    const text = await res.text();
    throw new Error(`Failed to create recommendation: ${res.status()} ${text}`);
  }
  const json = (await res.json()) as { data: Recommendation };
  return json.data;
}

export async function sendGuestMessage(api: APIRequestContext, token: string, body: string): Promise<Message> {
  const res = await api.post(`${API_URL}/v1/guest/messages`, {
    data: { body },
    headers: { 'x-guest-token': token },
  });
  if (!res.ok()) {
    const text = await res.text();
    throw new Error(`Failed to send guest message: ${res.status()} ${text}`);
  }
  const json = (await res.json()) as { data: { message: Message } };
  return json.data.message;
}

export async function submitGuestFeedback(api: APIRequestContext, token: string, data: Record<string, unknown>): Promise<Feedback> {
  const res = await api.post(`${API_URL}/v1/guest/feedback`, {
    data,
    headers: { 'x-guest-token': token },
  });
  if (!res.ok()) {
    const text = await res.text();
    throw new Error(`Failed to submit feedback: ${res.status()} ${text}`);
  }
  const json = (await res.json()) as { data: { feedback: Feedback } };
  return json.data.feedback;
}

/**
 * Set up Playwright route interception for admin-web API calls.
 * The admin-web expects a unified API at localhost:3001.
 * We intercept and forward /auth/* to auth service and everything else to API service.
 */
export async function setupAdminWebRouting(page: Page): Promise<void> {
  await page.route(`${ADMIN_API_URL}/**/*`, async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const isAuth = url.pathname.startsWith('/auth/');
    const targetBase = isAuth ? AUTH_URL : API_URL;
    const targetUrl = `${targetBase}${url.pathname}${url.search}`;

    try {
      const response = await fetch(targetUrl, {
        method: request.method(),
        headers: request.headers(),
        body: request.postDataBuffer(),
      });

      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        if (key !== 'content-encoding' && key !== 'transfer-encoding') {
          headers[key] = value;
        }
      });

      await route.fulfill({
        status: response.status,
        headers,
        body: Buffer.from(await response.arrayBuffer()),
      });
    } catch (err) {
      await route.abort('failed');
    }
  });
}

/**
 * Mock Google Places API responses in Playwright.
 */
export async function mockGooglePlaces(page: Page): Promise<void> {
  await page.route('https://maps.googleapis.com/maps/api/**', async (route) => {
    const url = new URL(route.request().url());
    const path = url.pathname;

    if (path.includes('/place/details/')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: {
            place_id: url.searchParams.get('place_id') ?? 'ChIJN1t_tDeuEmsRUsoyG83frY4',
            name: 'Mock Place',
            formatted_address: '123 Mock Street, Mock City',
            geometry: { location: { lat: 36.7213, lng: -4.4213 } },
            types: ['lodging', 'point_of_interest'],
          },
          status: 'OK',
        }),
      });
      return;
    }

    if (path.includes('/place/autocomplete/')) {
      const input = url.searchParams.get('input') ?? 'mock';
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          predictions: [
            { description: `${input} result 1`, place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4', structured_formatting: { main_text: `${input} result 1`, secondary_text: 'Mock City' } },
            { description: `${input} result 2`, place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY5', structured_formatting: { main_text: `${input} result 2`, secondary_text: 'Mock City' } },
          ],
          status: 'OK',
        }),
      });
      return;
    }

    if (path.includes('/place/photo')) {
      const base64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
      await route.fulfill({
        status: 200,
        contentType: 'image/png',
        body: Buffer.from(base64Png, 'base64'),
      });
      return;
    }

    if (path.includes('/geocode/')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          results: [{
            formatted_address: url.searchParams.get('address') ?? 'Mock Address',
            geometry: { location: { lat: 36.7213, lng: -4.4213 } },
            place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
            types: ['street_address'],
          }],
          status: 'OK',
        }),
      });
      return;
    }

    await route.continue();
  });
}
