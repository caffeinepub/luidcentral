import React, { useState, useEffect, useRef } from 'react';
import { getChatMessagesByLuidId, sendChatMessage, getChatStatus } from '../lib/db';
import type { ChatMessage } from '../types/db';
import { Send, Loader2, User, Headphones, WifiOff } from 'lucide-react';

interface ChatViewProps {
  luidId: string;
}

export function ChatView({ luidId }: ChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatStatus, setChatStatus] = useState<'Online' | 'Offline'>(() => getChatStatus());
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadMessages = () => {
    setMessages(getChatMessagesByLuidId(luidId));
    setChatStatus(getChatStatus());
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [luidId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatStatus === 'Offline') return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 200));
    sendChatMessage(luidId, luidId, 'client', input.trim());
    setInput('');
    loadMessages();
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e as unknown as React.FormEvent);
    }
  };

  return (
    <div
      className="flex flex-col rounded-lg overflow-hidden"
      style={{
        height: '500px',
        background: 'oklch(0.09 0.007 150)',
        border: '1px solid oklch(0.85 0.28 142 / 0.2)',
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center gap-2 flex-shrink-0"
        style={{ borderBottom: '1px solid oklch(0.85 0.28 142 / 0.15)' }}
      >
        <div
          className="w-2 h-2 rounded-full"
          style={{
            background: chatStatus === 'Online' ? 'oklch(0.85 0.28 142)' : 'oklch(0.55 0.18 25)',
            boxShadow: chatStatus === 'Online'
              ? '0 0 6px oklch(0.85 0.28 142)'
              : '0 0 6px oklch(0.55 0.18 25)',
            animation: chatStatus === 'Online' ? 'pulse 2s infinite' : 'none',
          }}
        />
        <span className="text-xs font-mono font-semibold" style={{ color: chatStatus === 'Online' ? 'oklch(0.85 0.28 142)' : 'oklch(0.55 0.18 25)' }}>
          {chatStatus === 'Online' ? 'CHAT AO VIVO' : 'CHAT OFFLINE'}
        </span>
        <span className="text-xs font-mono ml-auto" style={{ color: 'oklch(0.4 0.03 150)' }}>
          {messages.length} mensagem(ns)
        </span>
      </div>

      {/* Offline state */}
      {chatStatus === 'Offline' ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center"
            style={{
              background: 'oklch(0.55 0.18 25 / 0.1)',
              border: '1px solid oklch(0.55 0.18 25 / 0.3)',
            }}
          >
            <WifiOff className="w-8 h-8" style={{ color: 'oklch(0.55 0.18 25)' }} />
          </div>
          <div className="text-center">
            <p
              className="text-sm font-bold font-mono tracking-wider"
              style={{ color: 'oklch(0.55 0.18 25)', textShadow: '0 0 10px oklch(0.55 0.18 25 / 0.4)' }}
            >
              CHAT INDISPONÍVEL
            </p>
            <p className="text-xs font-mono mt-2" style={{ color: 'oklch(0.4 0.03 150)' }}>
              O suporte via chat está temporariamente offline.
            </p>
            <p className="text-xs font-mono mt-1" style={{ color: 'oklch(0.4 0.03 150)' }}>
              Por favor, abra um ticket para obter ajuda.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm font-mono" style={{ color: 'oklch(0.4 0.03 150)' }}>
                  Nenhuma mensagem ainda. Inicie a conversa!
                </p>
              </div>
            ) : (
              messages.map((msg, i) => {
                const isClient = msg.senderType === 'client';
                return (
                  <div key={i} className={`flex gap-3 ${isClient ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div
                      className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        background: isClient ? 'oklch(0.85 0.28 142 / 0.15)' : 'oklch(0.7 0.15 220 / 0.15)',
                        border: `1px solid ${isClient ? 'oklch(0.85 0.28 142 / 0.3)' : 'oklch(0.7 0.15 220 / 0.3)'}`,
                      }}
                    >
                      {isClient
                        ? <User className="w-3.5 h-3.5" style={{ color: 'oklch(0.85 0.28 142)' }} />
                        : <Headphones className="w-3.5 h-3.5" style={{ color: 'oklch(0.7 0.15 220)' }} />
                      }
                    </div>
                    <div
                      className={`max-w-[75%] rounded-lg px-3 py-2 ${isClient ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
                      style={{
                        background: isClient ? 'oklch(0.85 0.28 142 / 0.1)' : 'oklch(0.14 0.01 150)',
                        border: `1px solid ${isClient ? 'oklch(0.85 0.28 142 / 0.25)' : 'oklch(0.22 0.02 150)'}`,
                      }}
                    >
                      <p className="text-xs font-mono leading-relaxed" style={{ color: 'oklch(0.85 0.05 150)' }}>
                        {msg.content}
                      </p>
                      <p className="text-xs font-mono mt-1 opacity-50" style={{ color: 'oklch(0.5 0.04 150)' }}>
                        {new Date(msg.timestamp).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="p-3 flex gap-2 flex-shrink-0"
            style={{ borderTop: '1px solid oklch(0.85 0.28 142 / 0.15)' }}
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              className="flex-1 px-3 py-2 rounded-lg text-xs neon-input"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-3 py-2 rounded-lg transition-all flex items-center justify-center disabled:opacity-40"
              style={{
                background: 'oklch(0.85 0.28 142)',
                color: 'oklch(0.08 0.005 150)',
                boxShadow: '0 0 10px oklch(0.85 0.28 142 / 0.3)',
              }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
