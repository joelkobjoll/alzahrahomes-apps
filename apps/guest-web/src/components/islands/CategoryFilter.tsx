'use client';

import { useCallback, useState } from 'react';

const categories = [
  { id: 'all', label: 'All' },
  { id: 'food', label: 'Food & Drink' },
  { id: 'sightseeing', label: 'Sightseeing' },
  { id: 'beach', label: 'Beach' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'nightlife', label: 'Nightlife' },
  { id: 'nature', label: 'Nature' },
  { id: 'culture', label: 'Culture' },
];

interface CategoryFilterProps {
  onChange?: (category: string) => void;
}

export default function CategoryFilter({ onChange }: CategoryFilterProps) {
  const [active, setActive] = useState('all');

  const select = useCallback(
    (id: string) => {
      setActive(id);
      onChange?.(id);
    },
    [onChange]
  );

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5 pb-1">
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => select(cat.id)}
          className={`shrink-0 h-8 px-3.5 rounded-full text-xs font-medium transition-colors border ${
            active === cat.id
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-surface text-stone-600 border-stone-200 hover:bg-stone-50'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
