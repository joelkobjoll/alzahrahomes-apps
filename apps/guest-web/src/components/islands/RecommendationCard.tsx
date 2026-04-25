'use client';

import type { RecommendationType } from '@alzahra/types/domain';

interface RecommendationCardProps {
  id: string;
  title: string;
  description: string | null;
  type: RecommendationType;
  score: number | null;
}

const typeLabels: Record<RecommendationType, string> = {
  manual: 'Staff Pick',
  ai_generated: 'For You',
  trending: 'Trending',
  seasonal: 'Seasonal',
};

const typeColors: Record<RecommendationType, string> = {
  manual: 'bg-terracotta-100 text-terracotta-700',
  ai_generated: 'bg-olive-100 text-olive-700',
  trending: 'bg-sand-200 text-sand-800',
  seasonal: 'bg-stone-200 text-stone-700',
};

export default function RecommendationCard({
  title,
  description,
  type,
  score,
}: RecommendationCardProps): JSX.Element {
  return (
    <div className="flex gap-3 p-3 rounded-xl border border-border bg-surface hover:shadow-sm transition-shadow">
      <div className="w-16 h-16 rounded-lg bg-stone-200 shrink-0 flex items-center justify-center overflow-hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-stone-400"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-stone-900 truncate">{title}</h3>
          {score !== null && (
            <div className="flex items-center gap-0.5 shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="none"
                className="text-sand-500"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span className="text-xs font-medium text-stone-600">{score.toFixed(1)}</span>
            </div>
          )}
        </div>

        {description && (
          <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">{description}</p>
        )}

        <div className="mt-2">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide ${typeColors[type]}`}
          >
            {typeLabels[type]}
          </span>
        </div>
      </div>
    </div>
  );
}
