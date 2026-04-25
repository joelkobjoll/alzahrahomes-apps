'use client';

import type { Token } from '@alzahra/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface TokenTableProps {
  data: Token[];
  isLoading: boolean;
}

export function TokenTable({ data, isLoading }: TokenTableProps) {
  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-md border border-dashed">
        <p className="text-sm text-muted-foreground">No tokens found.</p>
      </div>
    );
  }

  const isActive = (token: Token) => {
    if (token.revokedAt) return false;
    if (!token.expiresAt) return true;
    return new Date(token.expiresAt) > new Date();
  };

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Type</th>
            <th className="px-4 py-3 text-left font-medium">Hash</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">Expires</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((token) => (
            <tr key={token.id} className="border-t transition-colors hover:bg-muted/50">
              <td className="px-4 py-3 capitalize">{token.type}</td>
              <td className="px-4 py-3 font-mono text-xs">{token.tokenHash.slice(0, 16)}…</td>
              <td className="px-4 py-3">
                <Badge variant={isActive(token) ? 'default' : 'destructive'}>
                  {isActive(token) ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              <td className="px-4 py-3">
                {token.expiresAt ? new Date(token.expiresAt).toLocaleDateString() : 'Never'}
              </td>
              <td className="px-4 py-3 text-right">
                <Button variant="ghost" size="sm">
                  Revoke
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
