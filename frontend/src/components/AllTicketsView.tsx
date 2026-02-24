import React, { useState } from 'react';
import { getTickets, addMessageToTicket, updateTicketStatus } from '../lib/db';
import type { Ticket } from '../types/db';
import { ChevronDown, ChevronUp, Send, Lock, Unlock, User, Headphones, Loader2, Ticket as TicketIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function AllTicketsView() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>(() => getTickets());
  const [expanded, setExpanded] = useState<string | null>(null);
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<string | null>(null);

  const refresh = () => setTickets(getTickets());

  const handleReply = async (ticketId: string) => {
    const msg = replies[ticketId]?.trim();
    if (!msg || !user) return;
    setLoading(ticketId);
    await new Promise(r => setTimeout(r, 200));
    addMessageToTicket(ticketId, user.displayName, user.userType, msg);
    setReplies(prev => ({ ...prev, [ticketId]: '' }));
    setLoading(null);
    refresh();
  };

  const handleToggleStatus = (ticket: Ticket) => {
    const newStatus: 'open' | 'resolved' = ticket.status === 'open' ? 'resolved' : 'open';
    updateTicketStatus(ticket.id, newStatus);
    refresh();
  };

  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16" style={{ color: 'oklch(0.4 0.03 150)' }}>
        <TicketIcon className="w-10 h-10 mb-3 opacity-30" style={{ color: 'oklch(0.85 0.28 142)' }} />
        <p className="text-sm font-mono">Nenhum ticket encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tickets.map(ticket => (
        <div
          key={ticket.id}
          className="rounded-lg overflow-hidden"
          style={{
            background: 'oklch(0.09 0.007 150)',
            border: expanded === ticket.id
              ? '1px solid oklch(0.85 0.28 142 / 0.4)'
              : '1px solid oklch(0.85 0.28 142 / 0.12)',
          }}
        >
          {/* Header row */}
          <div
            className="flex items-center justify-between px-4 py-3 cursor-pointer transition-all"
            style={{
              background: expanded === ticket.id ? 'oklch(0.85 0.28 142 / 0.06)' : 'transparent',
            }}
            onClick={() => setExpanded(expanded === ticket.id ? null : ticket.id)}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  background: ticket.status === 'open' ? 'oklch(0.85 0.28 142)' : 'oklch(0.45 0.03 150)',
                  boxShadow: ticket.status === 'open' ? '0 0 6px oklch(0.85 0.28 142)' : 'none',
                }}
              />
              <div className="min-w-0">
                <p className="text-sm font-mono font-semibold truncate" style={{ color: 'oklch(0.85 0.05 150)' }}>
                  {ticket.subject}
                </p>
                <p className="text-xs font-mono mt-0.5" style={{ color: 'oklch(0.45 0.03 150)' }}>
                  {ticket.luidId} · {ticket.messages.length} msg · {new Date(ticket.createdAt).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-3">
              <span
                className="text-xs font-mono px-2 py-0.5 rounded"
                style={ticket.status === 'open' ? {
                  background: 'oklch(0.85 0.28 142 / 0.12)',
                  color: 'oklch(0.85 0.28 142)',
                  border: '1px solid oklch(0.85 0.28 142 / 0.3)',
                } : {
                  background: 'oklch(0.3 0.02 150 / 0.5)',
                  color: 'oklch(0.5 0.04 150)',
                  border: '1px solid oklch(0.3 0.02 150)',
                }}
              >
                {ticket.status === 'open' ? 'ABERTO' : 'RESOLVIDO'}
              </span>
              {expanded === ticket.id
                ? <ChevronUp className="w-4 h-4" style={{ color: 'oklch(0.5 0.04 150)' }} />
                : <ChevronDown className="w-4 h-4" style={{ color: 'oklch(0.5 0.04 150)' }} />
              }
            </div>
          </div>

          {/* Expanded content */}
          {expanded === ticket.id && (
            <div
              className="px-4 pb-4 space-y-3"
              style={{ borderTop: '1px solid oklch(0.85 0.28 142 / 0.1)' }}
            >
              {/* Messages */}
              <div className="space-y-2 pt-3 max-h-56 overflow-y-auto">
                {ticket.messages.map((msg, i) => {
                  const isClient = msg.senderType === 'client';
                  return (
                    <div key={i} className={`flex gap-2 ${isClient ? 'flex-row' : 'flex-row-reverse'}`}>
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          background: isClient ? 'oklch(0.85 0.28 142 / 0.15)' : 'oklch(0.7 0.15 220 / 0.15)',
                          border: `1px solid ${isClient ? 'oklch(0.85 0.28 142 / 0.3)' : 'oklch(0.7 0.15 220 / 0.3)'}`,
                        }}
                      >
                        {isClient
                          ? <User className="w-3 h-3" style={{ color: 'oklch(0.85 0.28 142)' }} />
                          : <Headphones className="w-3 h-3" style={{ color: 'oklch(0.7 0.15 220)' }} />
                        }
                      </div>
                      <div
                        className="max-w-[80%] rounded-lg px-3 py-2"
                        style={{
                          background: isClient ? 'oklch(0.85 0.28 142 / 0.08)' : 'oklch(0.14 0.01 150)',
                          border: `1px solid ${isClient ? 'oklch(0.85 0.28 142 / 0.2)' : 'oklch(0.22 0.02 150)'}`,
                        }}
                      >
                        <p className="text-xs font-mono font-semibold mb-0.5" style={{ color: isClient ? 'oklch(0.85 0.28 142)' : 'oklch(0.7 0.15 220)' }}>
                          {msg.sender}
                        </p>
                        <p className="text-xs font-mono leading-relaxed" style={{ color: 'oklch(0.8 0.04 150)' }}>
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

              {/* Reply + actions */}
              <div className="flex gap-2 pt-1">
                <textarea
                  value={replies[ticket.id] || ''}
                  onChange={e => setReplies(prev => ({ ...prev, [ticket.id]: e.target.value }))}
                  placeholder="Responder ticket... (Ctrl+Enter)"
                  rows={2}
                  className="flex-1 px-3 py-2 rounded-lg text-xs neon-input resize-none"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      e.preventDefault();
                      handleReply(ticket.id);
                    }
                  }}
                />
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => handleReply(ticket.id)}
                    disabled={!replies[ticket.id]?.trim() || loading === ticket.id}
                    className="px-3 py-2 rounded-lg transition-all flex items-center justify-center disabled:opacity-40"
                    style={{
                      background: 'oklch(0.85 0.28 142)',
                      color: 'oklch(0.08 0.005 150)',
                      boxShadow: '0 0 8px oklch(0.85 0.28 142 / 0.3)',
                    }}
                  >
                    {loading === ticket.id
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <Send className="w-3.5 h-3.5" />
                    }
                  </button>
                  <button
                    onClick={() => handleToggleStatus(ticket)}
                    className="px-3 py-2 rounded-lg transition-all flex items-center justify-center"
                    style={ticket.status === 'open' ? {
                      color: 'oklch(0.65 0.18 25)',
                      border: '1px solid oklch(0.65 0.18 25 / 0.4)',
                      background: 'oklch(0.65 0.18 25 / 0.08)',
                    } : {
                      color: 'oklch(0.85 0.28 142)',
                      border: '1px solid oklch(0.85 0.28 142 / 0.4)',
                      background: 'oklch(0.85 0.28 142 / 0.08)',
                    }}
                    title={ticket.status === 'open' ? 'Marcar como resolvido' : 'Reabrir'}
                  >
                    {ticket.status === 'open'
                      ? <Lock className="w-3.5 h-3.5" />
                      : <Unlock className="w-3.5 h-3.5" />
                    }
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
