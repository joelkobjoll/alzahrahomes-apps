'use client';

import { useCallback, useEffect, useState } from 'react';
import type { AuthUserDTO } from '@alzahra/auth-config';
import { AuthSDK } from './sdk.js';

export interface UseSessionOptions {
  sdk: AuthSDK;
  initialUser?: AuthUserDTO | null;
}

export interface SessionState {
  user: AuthUserDTO | null;
  isLoading: boolean;
  error: Error | null;
}

export function useSession(options: UseSessionOptions) {
  const { sdk } = options;
  const [state, setState] = useState<SessionState>({
    user: options.initialUser ?? null,
    isLoading: !options.initialUser,
    error: null,
  });

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const { user } = await sdk.me();
      setState({ user, isLoading: false, error: null });
    } catch (err) {
      setState({
        user: null,
        isLoading: false,
        error: err instanceof Error ? err : new Error(String(err)),
      });
    }
  }, [sdk]);

  useEffect(() => {
    if (!options.initialUser) {
      refresh();
    }
  }, [options.initialUser, refresh]);

  const logout = useCallback(async () => {
    await sdk.logout();
    setState({ user: null, isLoading: false, error: null });
  }, [sdk]);

  return { ...state, refresh, logout };
}
