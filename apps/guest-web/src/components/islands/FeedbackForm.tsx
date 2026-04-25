'use client';

import { useCallback, useState } from 'react';

interface FeedbackFormProps {
  token: string;
}

interface SubRating {
  label: string;
  key: 'cleanliness' | 'communication' | 'location' | 'value';
}

const subRatings: SubRating[] = [
  { label: 'Cleanliness', key: 'cleanliness' },
  { label: 'Communication', key: 'communication' },
  { label: 'Location', key: 'location' },
  { label: 'Value', key: 'value' },
];

export default function FeedbackForm({ token }: FeedbackFormProps): JSX.Element {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [subs, setSubs] = useState<Record<string, number>>({});
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiUrl =
    (typeof window !== 'undefined' && (window as unknown as Record<string, string>).PUBLIC_API_URL) ??
    'https://api.alzahra.es';

  const setSubRating = useCallback((key: string, value: number) => {
    setSubs((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (rating === 0) {
        setError('Please select an overall star rating');
        return;
      }

      setSubmitting(true);
      setError(null);

      try {
        const res = await fetch(`${apiUrl}/v1/guest/feedback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-guest-token': token,
          },
          body: JSON.stringify({
            rating,
            cleanliness: subs.cleanliness ?? null,
            communication: subs.communication ?? null,
            location: subs.location ?? null,
            value: subs.value ?? null,
            comment: comment.trim() || null,
          }),
        });

        if (!res.ok) throw new Error('Failed to submit feedback');
        setSubmitted(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Submit failed');
      } finally {
        setSubmitting(false);
      }
    },
    [rating, subs, comment, apiUrl, token]
  );

  if (submitted) {
    return (
      <div className="text-center py-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-olive-100 text-olive-600 mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-stone-900">Thank you!</h3>
        <p className="text-sm text-stone-500 mt-1">Your feedback helps us improve.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Overall rating */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => {
                setRating(star);
                setError(null);
              }}
              className="p-1 transition-transform hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill={star <= (hoverRating || rating) ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={
                  star <= (hoverRating || rating)
                    ? 'text-sand-500'
                    : 'text-stone-300'
                }
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
          ))}
        </div>
        <p className="text-xs text-stone-500 mt-1">
          {rating > 0 ? `${rating} out of 5 stars` : 'Tap to rate'}
        </p>
      </div>

      {/* Sub-ratings */}
      <div className="space-y-3">
        {subRatings.map(({ label, key }) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm text-stone-700">{label}</span>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSubRating(key, star)}
                  className="p-0.5"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={star <= (subs[key] ?? 0) ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={
                      star <= (subs[key] ?? 0)
                        ? 'text-sand-500'
                        : 'text-stone-300'
                    }
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Comment */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Anything else you'd like to share? (optional)"
        rows={3}
        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-surface text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-shadow resize-none"
      />

      {error && (
        <p className="text-xs text-terracotta-600 bg-terracotta-50 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-hover active:bg-primary-active transition-colors"
      >
        {submitting ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
}
