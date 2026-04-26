'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '~/lib/api';
import type { ChatMessage } from '~/lib/api';

interface MessageThreadProps {
  token: string;
}

export default function MessageThread({ token }: MessageThreadProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const result = await api.getMessages(token);
      if (result.error) throw new Error(result.error.message);
      setMessages(result.data?.messages ?? []);
    } catch {
      // Silently fail on initial load; show empty state
    }
  }, [token]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = input.trim();
      if (!trimmed || sending) return;

      setSending(true);
      setError(null);

      const optimistic: ChatMessage = {
        id: `temp-${Date.now()}`,
        sender: 'guest',
        body: trimmed,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, optimistic]);
      setInput('');

      try {
        const result = await api.sendMessage(token, trimmed);
        if (result.error) throw new Error(result.error.message);

        if (result.data?.message) {
          setMessages((prev) =>
            prev.map((m) => (m.id === optimistic.id ? result.data!.message : m))
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Send failed');
        setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      } finally {
        setSending(false);
      }
    },
    [input, sending, token]
  );

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border bg-surface-muted p-3 space-y-2 max-h-80 overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-xs text-stone-500 text-center py-4">
            No messages yet. Start the conversation with your host.
          </p>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'guest' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
                msg.sender === 'guest'
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'bg-white border border-border text-stone-800 rounded-bl-md'
              }`}
            >
              <p className="leading-relaxed">{msg.body}</p>
              <span
                className={`text-[10px] mt-1 block ${
                  msg.sender === 'guest' ? 'text-white/70' : 'text-stone-400'
                }`}
              >
                {formatTime(msg.createdAt)}
              </span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {error && (
        <p className="text-xs text-terracotta-600 bg-terracotta-50 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 h-10 px-3.5 rounded-xl border border-stone-200 bg-surface text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-shadow"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-hover active:bg-primary-active transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}
