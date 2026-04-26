'use client';

import { useState } from 'react';
import { useGenerateToken } from '@/hooks/use-tokens';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check } from 'lucide-react';
import type { TokenType } from '@alzahra/types';

export function TokenGenerator() {
  const generateMutation = useGenerateToken();
  const [userId, setUserId] = useState('');
  const [type, setType] = useState<TokenType>('api');
  const [generatedToken, setGeneratedToken] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!userId) return;
    try {
      const res = await generateMutation.mutateAsync({
        userId,
        type,
      });
      setGeneratedToken(res.plainToken);
      setCopied(false);
    } catch {
      // error handled by mutation
    }
  };

  const copyToClipboard = async () => {
    if (!generatedToken) return;
    await navigator.clipboard.writeText(generatedToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Token</CardTitle>
        <CardDescription>Create a new API or access token for a user</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="userId">User ID</Label>
            <Input
              id="userId"
              placeholder="uuid"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as TokenType)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="api">API</option>
              <option value="refresh">Refresh</option>
              <option value="reset_password">Reset Password</option>
              <option value="verify_email">Verify Email</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={generate} disabled={!userId || generateMutation.isPending}>
            {generateMutation.isPending ? 'Generating…' : 'Generate'}
          </Button>
        </div>
        {generateMutation.isError && (
          <p className="text-sm text-destructive">
            {generateMutation.error instanceof Error
              ? generateMutation.error.message
              : 'Failed to generate token'}
          </p>
        )}
        {generatedToken && (
          <div className="space-y-2">
            <Label>Token (copy now — it won&apos;t be shown again)</Label>
            <div className="flex gap-2">
              <Input readOnly value={generatedToken} className="font-mono text-xs" />
              <Button variant="outline" size="icon" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
