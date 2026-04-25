'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export default function TokenEntry(): JSX.Element {
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerDivId = 'qr-reader';

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = token.trim();
      if (!trimmed) {
        setError('Please enter your guest token');
        return;
      }
      window.location.href = `/stay/${trimmed}`;
    },
    [token]
  );

  const startScan = useCallback(async () => {
    setError(null);
    setScanning(true);
    try {
      const scanner = new Html5Qrcode(scannerDivId);
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText: string) => {
          const trimmed = decodedText.trim();
          if (trimmed) {
            scanner.stop().catch(() => {});
            window.location.href = `/stay/${trimmed}`;
          }
        },
        () => {}
      );
    } catch {
      setError('Could not access camera. Please enter your token manually.');
      setScanning(false);
    }
  }, []);

  const stopScan = useCallback(() => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(() => {});
      scannerRef.current = null;
    }
    setScanning(false);
  }, []);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('error')) {
      const err = params.get('error');
      if (err === 'invalid_token') {
        setError('Invalid or expired guest token. Please check and try again.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  }, []);

  return (
    <div className="space-y-4">
      {scanning ? (
        <div className="space-y-3">
          <div
            id={scannerDivId}
            className="w-full aspect-square rounded-xl overflow-hidden bg-stone-900"
          />
          <button
            type="button"
            onClick={stopScan}
            className="w-full h-11 rounded-lg border border-stone-300 text-stone-700 text-sm font-medium hover:bg-stone-50 transition-colors"
          >
            Cancel Scan
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="token" className="sr-only">
              Guest Token
            </label>
            <input
              id="token"
              type="text"
              value={token}
              onChange={(e) => {
                setToken(e.target.value);
                setError(null);
              }}
              placeholder="Enter your guest token"
              autoComplete="off"
              autoCapitalize="off"
              className="w-full h-12 px-4 rounded-xl border border-stone-200 bg-surface text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-shadow"
            />
          </div>

          {error && (
            <p className="text-xs text-terracotta-600 bg-terracotta-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary-hover active:bg-primary-active transition-colors"
          >
            Access Your Stay
          </button>

          <button
            type="button"
            onClick={startScan}
            className="w-full h-12 rounded-xl border border-stone-200 text-stone-700 text-sm font-medium hover:bg-stone-50 active:bg-stone-100 transition-colors flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 7V5a2 2 0 0 1 2-2h2" />
              <path d="M17 3h2a2 2 0 0 1 2 2v2" />
              <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
              <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
              <rect width="10" height="8" x="7" y="8" rx="1" />
            </svg>
            Scan QR Code
          </button>
        </form>
      )}
    </div>
  );
}
