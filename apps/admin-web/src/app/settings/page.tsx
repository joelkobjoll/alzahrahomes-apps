'use client';

import { AuthGuard } from '@/components/layout/AuthGuard';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';

function SettingsContent() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar className="hidden lg:flex" />
      <div className="flex flex-1 flex-col">
        <Header />
        <MobileNav />
        <main className="flex-1 p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your preferences</p>
          </div>

          <div className="grid gap-6 max-w-xl">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dark mode</Label>
                    <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
                  </div>
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsContent />
    </AuthGuard>
  );
}
