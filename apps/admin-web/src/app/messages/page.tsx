'use client';

import { useMessages } from '@/hooks/use-messages';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

function MessagesContent() {
  const { data, isLoading } = useMessages({ limit: 50 });

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar className="hidden lg:flex" />
      <div className="flex flex-1 flex-col">
        <Header />
        <MobileNav />
        <main className="flex-1 p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
            <p className="text-muted-foreground">Guest and staff communications</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Inbox</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex h-48 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : data && data.items.length > 0 ? (
                <div className="space-y-4">
                  {data.items.map((message) => (
                    <div
                      key={message.id}
                      className="flex items-start justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">
                            {message.subject || 'No subject'}
                          </p>
                          {!message.readAt && (
                            <Badge variant="default" className="text-[10px]">
                              Unread
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {message.body}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>From: {message.senderId}</span>
                          <span>•</span>
                          <span>To: {message.recipientId}</span>
                          <span>•</span>
                          <span>{message.createdAt ? new Date(message.createdAt).toLocaleString() : '-'}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="ml-4 shrink-0">
                        {message.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No messages found.</p>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <AuthGuard>
      <MessagesContent />
    </AuthGuard>
  );
}
