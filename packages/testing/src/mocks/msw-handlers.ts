import { http, HttpResponse, passthrough } from 'msw';

// ------------------------------------------------------------------
// Google Places API mock handlers
// ------------------------------------------------------------------

export const googlePlacesHandlers = [
  // Place Details
  http.get('https://maps.googleapis.com/maps/api/place/details/json', ({ request }) => {
    const url = new URL(request.url);
    const placeId = url.searchParams.get('place_id');

    return HttpResponse.json({
      result: {
        place_id: placeId ?? 'ChIJN1t_tDeuEmsRUsoyG83frY4',
        name: 'Mock Place',
        formatted_address: '123 Mock Street, Mock City',
        geometry: {
          location: { lat: 36.7213, lng: -4.4213 },
        },
        types: ['lodging', 'point_of_interest'],
      },
      status: 'OK',
    });
  }),

  // Place Autocomplete
  http.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', ({ request }) => {
    const url = new URL(request.url);
    const input = url.searchParams.get('input') ?? 'mock';

    return HttpResponse.json({
      predictions: [
        {
          description: `${input} result 1`,
          place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
          structured_formatting: {
            main_text: `${input} result 1`,
            secondary_text: 'Mock City',
          },
        },
        {
          description: `${input} result 2`,
          place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY5',
          structured_formatting: {
            main_text: `${input} result 2`,
            secondary_text: 'Mock City',
          },
        },
      ],
      status: 'OK',
    });
  }),

  // Place Photos
  http.get('https://maps.googleapis.com/maps/api/place/photo', () => {
    // Return a tiny 1x1 transparent PNG
    const base64Png =
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    const buffer = Buffer.from(base64Png, 'base64');
    return new HttpResponse(buffer, {
      headers: { 'Content-Type': 'image/png' },
    });
  }),

  // Geocoding
  http.get('https://maps.googleapis.com/maps/api/geocode/json', ({ request }) => {
    const url = new URL(request.url);
    const address = url.searchParams.get('address');

    return HttpResponse.json({
      results: [
        {
          formatted_address: address ?? 'Mock Address',
          geometry: {
            location: { lat: 36.7213, lng: -4.4213 },
          },
          place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
          types: ['street_address'],
        },
      ],
      status: 'OK',
    });
  }),
];

// ------------------------------------------------------------------
// External service mock handlers
// ------------------------------------------------------------------

export const externalServiceHandlers = [
  // Generic webhook endpoint
  http.post('https://hooks.example.com/webhook', async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    return HttpResponse.json({
      success: true,
      received: body,
      id: `wh_${Math.random().toString(36).slice(2)}`,
    });
  }),

  // Generic SMS provider
  http.post('https://api.sms-provider.test/v1/messages', async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    return HttpResponse.json({
      messageId: `msg_${Math.random().toString(36).slice(2)}`,
      status: 'queued',
      to: body.to,
    });
  }),

  // Generic email provider
  http.post('https://api.email-provider.test/v1/send', async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    return HttpResponse.json({
      messageId: `<${Math.random().toString(36).slice(2)}@email-provider.test>`,
      status: 'sent',
      to: body.to,
    });
  }),

  // Payment provider (Stripe-like)
  http.post('https://api.stripe.test/v1/payment_intents', async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    return HttpResponse.json({
      id: `pi_${Math.random().toString(36).slice(2)}`,
      object: 'payment_intent',
      amount: body.amount,
      currency: body.currency ?? 'eur',
      status: 'requires_confirmation',
      client_secret: `pi_${Math.random().toString(36).slice(2)}_secret_${Math.random().toString(36).slice(2)}`,
    });
  }),
];

// ------------------------------------------------------------------
// Combined handlers
// ------------------------------------------------------------------

export const mswHandlers = [...googlePlacesHandlers, ...externalServiceHandlers];

// Passthrough for non-mocked requests
export const passthroughHandler = http.all('*', () => {
  return passthrough();
});
