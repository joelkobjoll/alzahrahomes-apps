'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Token, TokenType } from '@alzahra/types';

interface TokenListResponse {
  items: Token[];
  total: number;
}

interface GenerateTokenRequest {
  userId: string;
  type: TokenType;
  expiresAt?: string;
  metadata?: Record<string, unknown>;
}

interface GenerateTokenResponse {
  token: Token;
  plainToken: string;
}

async function fetchTokens(): Promise<TokenListResponse> {
  return api.get<TokenListResponse>('/tokens');
}

async function generateToken(body: GenerateTokenRequest): Promise<GenerateTokenResponse> {
  return api.post<GenerateTokenResponse>('/tokens', body);
}

async function revokeToken(id: string): Promise<Token> {
  return api.post<Token>(`/tokens/${id}/revoke`);
}

async function extendToken({ id, newExpiresAt }: { id: string; newExpiresAt: string }): Promise<Token> {
  return api.post<Token>(`/tokens/${id}/extend`, { newExpiresAt });
}

export function useTokens() {
  return useQuery({
    queryKey: ['tokens'],
    queryFn: fetchTokens,
  });
}

export function useGenerateToken() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generateToken,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tokens'] });
    },
  });
}

export function useRevokeToken() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: revokeToken,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tokens'] });
    },
  });
}

export function useExtendToken() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: extendToken,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tokens'] });
    },
  });
}
