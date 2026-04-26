'use client';

import { useCallback, useState } from 'react';

interface WifiInfo {
  ssid: string;
  password: string;
}

interface WifiCardProps {
  token: string;
}

export default function WifiCard({ token: _token }: WifiCardProps) {
  const [loading] = useState(false);
  const [wifi] = useState<WifiInfo | null>({
    ssid: 'Alzahra-Guest',
    password: 'Welcome2024!',
  });
  const [copied, setCopied] = useState(false);

  const copyPassword = useCallback(async () => {
    if (!wifi?.password) return;
    try {
      await navigator.clipboard.writeText(wifi.password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: silently ignore
    }
  }, [wifi]);

  if (loading) {
    return (
      <div className="animate-pulse rounded-xl bg-stone-100 h-24" />
    );
  }

  if (!wifi) {
    return (
      <p className="text-sm text-stone-500">WiFi information not available. Contact your host.</p>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-olive-100 text-olive-600 flex items-center justify-center">
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
            <path d="M12 20h.01" />
            <path d="M2 8.82a15 15 0 0 1 20 0" />
            <path d="M5 12.859a10 10 0 0 1 14 0" />
            <path d="M8.5 16.429a5 5 0 0 1 7 0" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-stone-900">WiFi</h3>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-stone-500">Network</span>
          <span className="text-sm font-medium text-stone-900">{wifi.ssid}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-stone-500 shrink-0">Password</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-stone-900 font-mono truncate max-w-[140px]">
              {wifi.password}
            </span>
            <button
              type="button"
              onClick={copyPassword}
              className="shrink-0 inline-flex items-center justify-center h-7 px-2.5 rounded-md bg-stone-100 text-stone-600 text-xs font-medium hover:bg-stone-200 transition-colors"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
