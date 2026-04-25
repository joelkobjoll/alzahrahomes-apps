'use client';

import { useTokens } from '@/hooks/use-tokens';
import { usePermissions } from '@/hooks/use-permissions';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { TokenTable } from '@/components/tokens/TokenTable';
import { TokenGenerator } from '@/components/tokens/TokenGenerator';

export default function TokensPage() {
  const { data: tokens, isLoading } = useTokens();
  const { can } = usePermissions();

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar className="hidden lg:flex" />
      <div className="flex flex-1 flex-col">
        <Header />
        <MobileNav />
        <main className="flex-1 p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Tokens</h1>
            <p className="text-muted-foreground">Manage API and access tokens</p>
          </div>

          {can('create', 'tokens') && (
            <div className="mb-6">
              <TokenGenerator />
            </div>
          )}

          <TokenTable data={tokens ?? []} isLoading={isLoading} />
        </main>
      </div>
    </div>
  );
}
