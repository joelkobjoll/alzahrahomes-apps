'use client';

import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { auth, isApiError } from '@/lib/api';
import type { LoginRequest, UserRole } from '@alzahra/types';

interface SafeUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

interface AuthState {
  user: SafeUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

async function fetchMe(): Promise<SafeUser | null> {
  try {
    const res = await auth.get<{ user: SafeUser }>('/me');
    return res.user ?? null;
  } catch (err) {
    if (isApiError(err) && err.status === 401) {
      return null;
    }
    throw err;
  }
}

async function loginApi(credentials: LoginRequest): Promise<SafeUser> {
  const res = await auth.post<{ user: SafeUser }>('/login', credentials);
  return res.user;
}

async function logoutApi(): Promise<void> {
  await auth.post('/logout');
}

export function useAuth() {
  const queryClient = useQueryClient();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const { data: user, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: fetchMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    setAuthState({
      user: user ?? null,
      isLoading,
      isAuthenticated: !!user,
    });
  }, [user, isLoading]);

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['auth', 'me'] });
      setAuthState({ user: null, isLoading: false, isAuthenticated: false });
    },
  });

  const login = useCallback(
    async (credentials: LoginRequest) => {
      await loginMutation.mutateAsync(credentials);
    },
    [loginMutation]
  );

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  return {
    user: authState.user,
    isLoading: authState.isLoading,
    isAuthenticated: authState.isAuthenticated,
    login,
    logout,
  };
}
