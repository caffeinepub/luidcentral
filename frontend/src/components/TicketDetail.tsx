import React, { useState } from 'react';
import type { Ticket } from '../types/db';
import { addMessageToTicket, updateTicketStatus } from '../lib/db';
import { Send, Lock, Unlock, User, Headphones, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface TicketDetailProps {
  ticket: Ticket;
  onUpdate: (ticket: Ticket) => void;
}

export function TicketDetail({ ticket, onUpdate }: TicketDetailProps) {
  const { user } = useAuth();
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !user) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 200));
    const updated = addMessageToTicket(ticket.id, user.displayName, user.userType, reply.trim());
    if (updated) onUpdate(updated);
    setReply('');
    setLoading(false);
  };

  const handleToggleStatus = () => {
    const newStatus: 'open' | 'resolved' = ticket.status === 'open' ? 'resolved' : 'open';
    updateTicketStatus(ticket.id, newStatus);
    // Return updated ticket with new status
    onUpdate({ ...ticket, status: newStatus });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleReply(e as unknown as React.FormEvent);
    }
  };

  return (
    <div
      className="flex flex-col h-full rounded-lg overflow-hidden"
      style={{
        background: 'oklch(0.09 0.007 150)',
        border: '1px solid oklch(0.85 0.28 142 / 0.2)',
        minHeight: '400px',
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between flex-shrink-0"
        style={{ borderBottom: '1px solid oklch(0.85 0.28 142 / 0.15)' }}
      >
        <div className="flex-1 min-w-0">
          <h3
            className="text-sm font-bold font-mono truncate"
            style={{ color: 'oklch(0.85 0.28 142)' }}
          >
            {ticket.subject}
          </h3>
          <p className="text-xs font-mono mt-0.5" style={{ color: 'oklch(0.45 0.03 150)' }}>
            {ticket.messages.length} mensagem(ns) · #{ticket.id.substring(0, 8)}
          </p>
        </div>
        <button
          onClick={handleToggleStatus}
          className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded transition-all ml-3 flex-shrink-0"
          style={ticket.status === 'open' ? {
            color: 'oklch(0.65 0.18 25)',
            border: '1px solid oklch(0.65 0.18 25 / 0.4)',
            background: 'oklch(0.65 0.18 25 / 0.08)',
          } : {
            color: 'oklch(0.85 0.28 142)',
            border: '1px solid oklch(0.85 0.28 142 / 0.4)',
            background: 'oklch(0.85 0.28 142 / 0.08)',
          }}
        >
          {ticket.status === 'open' ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
          {ticket.status === 'open' ? 'FECHAR' : 'REABRIR'}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {ticket.messages.map((msg, i) => {
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
                <p className="text-xs font-mono font-semibold mb-1" style={{ color: isClient ? 'oklch(0.85 0.28 142)' : 'oklch(0.7 0.15 220)' }}>
                  {msg.sender}
                </p>
                <p className="text-xs font-mono leading-relaxed" style={{ color: 'oklch(0.85 0.05 150)' }}>
                  {msg.content}
                </p>
                <p className="text-xs font-mono mt-1 opacity-50" style={{ color: 'oklch(0.5 0.04 150)' }}>
                  {new Date(msg.timestamp).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reply form */}
      {ticket.status === 'open' && (
        <form
          onSubmit={handleReply}
          className="p-3 flex gap-2 flex-shrink-0"
          style={{ borderTop: '1px solid oklch(0.85 0.28 142 / 0.15)' }}
        >
          <textarea
            value={reply}
            onChange={e => setReply(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua resposta... (Ctrl+Enter para enviar)"
            rows={2}
            className="flex-1 px-3 py-2 rounded-lg text-xs neon-input resize-none"
          />
          <button
            type="submit"
            disabled={loading || !reply.trim()}
            className="px-3 py-2 rounded-lg transition-all flex items-center justify-center disabled:opacity-40 flex-shrink-0"
            style={{
              background: 'oklch(0.85 0.28 142)',
              color: 'oklch(0.08 0.005 150)',
              boxShadow: '0 0 10px oklch(0.85 0.28 142 / 0.3)',
            }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      )}
      {ticket.status === 'resolved' && (
        <div
          className="p-3 text-center text-xs font-mono flex-shrink-0"
          style={{
            borderTop: '1px solid oklch(0.85 0.28 142 / 0.15)',
            color: 'oklch(0.45 0.03 150)',
          }}
        >
          Ticket resolvido — reabra para responder
        </div>
      )}
    </div>
  );
}
