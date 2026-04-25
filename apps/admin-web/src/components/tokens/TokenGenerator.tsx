'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check } from 'lucide-react';

export function TokenGenerator() {
  const [generatedToken, setGeneratedToken] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const token = `ah_${Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')}`;
    setGeneratedToken(token);
    setCopied(false);
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
        <CardDescription>Create a new API or refresh token for a user</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={generate}>Generate</Button>
        </div>
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
