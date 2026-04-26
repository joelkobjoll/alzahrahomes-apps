'use client';

import { useCallback, useState } from 'react';

interface PropertyHeaderProps {
  name: string;
  address: string | null;
  city: string | null;
  country: string | null;
  images: string[];
}

export default function PropertyHeader({
  name,
  address,
  city,
  country,
  images,
}: PropertyHeaderProps) {
  const [current, setCurrent] = useState(0);
  const safeImages = images.length > 0 ? images : ['/placeholder-property.jpg'];

  const next = useCallback(() => {
    setCurrent((i) => (i + 1) % safeImages.length);
  }, [safeImages.length]);

  const prev = useCallback(() => {
    setCurrent((i) => (i - 1 + safeImages.length) % safeImages.length);
  }, [safeImages.length]);

  const fullAddress = [address, city, country].filter(Boolean).join(', ');

  return (
    <div className="relative">
      <div className="relative aspect-[4/3] bg-stone-200 overflow-hidden">
        {safeImages.map((src, idx) => (
          <img
            key={`${src}-${idx}`}
            src={src}
            alt={`${name} — photo ${idx + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              idx === current ? 'opacity-100' : 'opacity-0'
            }`}
            loading={idx === 0 ? 'eager' : 'lazy'}
          />
        ))}

        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/50 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/50 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </>
        )}

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {safeImages.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrent(idx)}
              aria-label={`Go to photo ${idx + 1}`}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                idx === current ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="px-5 pt-4 pb-2">
        <h1 className="text-2xl font-bold text-stone-900 leading-tight">{name}</h1>
        {fullAddress && (
          <p className="text-sm text-stone-500 mt-1 flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
            >
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {fullAddress}
          </p>
        )}
      </div>
    </div>
  );
}
