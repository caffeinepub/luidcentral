import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { getChatMessages, sendChatMessage } from '../lib/db';
import type { ChatMessage } from '../types/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '../contexts/AuthContext';

export function AllChatView() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(() => getChatMessages());
  const [expandedLuid, setExpandedLuid] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<Record<string, string>>({});
  const bottomRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const refresh = () => setMessages(getChatMessages());

  // Group messages by luidId
  const grouped = messages.reduce<Record<string, ChatMessage[]>>((acc, msg) => {
    if (!acc[msg.luidId]) acc[msg.luidId] = [];
    acc[msg.luidId].push(msg);
    return acc;
  }, {});

  const luidIds = Object.keys(grouped);

  useEffect(() => {
    if (expandedLuid && bottomRefs.current[expandedLuid]) {
      bottomRefs.current[expandedLuid]?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [expandedLuid, messages]);

  const handleSend = (luidId: string) => {
    const content = replyContent[luidId]?.trim();
    if (!content || !user) return;
    sendChatMessage(luidId, user.displayName, user.userType, content);
    setReplyContent((prev) => ({ ...prev, [luidId]: '' }));
    refresh();
  };

  if (luidIds.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground font-mono text-sm">
        <MessageCircle className="w-8 h-8 mx-auto mb-3 opacity-30" />
        <p>Nenhuma conversa encontrada.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {luidIds.map((luidId) => {
        const thread = grouped[luidId];
        const lastMsg = thread[thread.length - 1];
        return (
          <div key={luidId} className="rounded border border-industrial-border bg-industrial-surface overflow-hidden">
            <div
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-industrial-panel transition-colors"
              onClick={() => setExpandedLuid(expandedLuid === luidId ? null : luidId)}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-DEFAULT" />
                <div>
                  <p className="font-mono text-sm font-medium text-foreground">{luidId}</p>
                  <p className="font-mono text-xs text-muted-foreground truncate max-w-xs">
                    {lastMsg.sender}: {lastMsg.content.substring(0, 50)}{lastMsg.content.length > 50 ? '...' : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">{thread.length} msg</span>
                {expandedLuid === luidId ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </div>
            </div>

            {expandedLuid === luidId && (
              <div className="border-t border-industrial-border p-3 space-y-3">
                <ScrollArea className="h-56">
                  <div className="space-y-2 pr-2">
                    {thread.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-2.5 rounded text-xs font-mono ${
                          msg.senderType === 'client'
                            ? 'bg-industrial-dark border border-industrial-border'
                            : 'bg-emerald-muted border border-emerald-DEFAULT/20 ml-4'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-semibold ${msg.senderType === 'client' ? 'text-foreground' : 'text-emerald-DEFAULT'}`}>
                            {msg.sender}
                          </span>
                          <span className="text-muted-foreground text-[10px]">
                            {new Date(msg.timestamp).toLocaleString('pt-BR')}
                          </span>
                        </div>
                        <p className="text-foreground/90 leading-relaxed">{msg.content}</p>
                      </div>
                    ))}
                    <div ref={(el) => { bottomRefs.current[luidId] = el; }} />
                  </div>
                </ScrollArea>

                <div className="flex gap-2">
                  <Input
                    value={replyContent[luidId] || ''}
                    onChange={(e) => setReplyContent((prev) => ({ ...prev, [luidId]: e.target.value }))}
                    placeholder={`Responder para ${luidId}...`}
                    className="font-mono text-xs bg-industrial-dark border-industrial-border focus:border-emerald-DEFAULT"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSend(luidId);
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={() => handleSend(luidId)}
                    disabled={!replyContent[luidId]?.trim()}
                    className="bg-emerald-DEFAULT text-industrial-black hover:bg-emerald-dim font-mono text-xs px-3"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
