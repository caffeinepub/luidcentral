import React from 'react';
import { getTicketsByLuidId } from '../lib/db';
import type { Ticket } from '../types/db';
import { Clock, CheckCircle, ChevronRight, Ticket as TicketIcon } from 'lucide-react';

interface TicketListProps {
  luidId: string;
  selectedTicketId: string | null;
  onSelect: (ticket: Ticket) => void;
}

export function TicketList({ luidId, selectedTicketId, onSelect }: TicketListProps) {
  const tickets = getTicketsByLuidId(luidId);

  if (tickets.length === 0) {
    return (
      <div
        className="h-full flex flex-col items-center justify-center rounded-lg p-6 text-center min-h-[200px]"
        style={{ border: '1px dashed oklch(0.85 0.28 142 / 0.2)', color: 'oklch(0.4 0.03 150)' }}
      >
        <TicketIcon className="w-8 h-8 mb-2 opacity-30" style={{ color: 'oklch(0.85 0.28 142)' }} />
        <p className="text-sm font-mono">Nenhum ticket ainda</p>
        <p className="text-xs font-mono mt-1 opacity-60">Crie seu primeiro ticket</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 overflow-y-auto max-h-[500px] pr-1">
      {tickets.map(ticket => {
        const isSelected = ticket.id === selectedTicketId;
        const isOpen = ticket.status === 'open';

        return (
          <button
            key={ticket.id}
            onClick={() => onSelect(ticket)}
            className="w-full text-left rounded-lg p-3 transition-all duration-200 group"
            style={{
              background: isSelected
                ? 'oklch(0.85 0.28 142 / 0.12)'
                : 'oklch(0.09 0.007 150)',
              border: isSelected
                ? '1px solid oklch(0.85 0.28 142 / 0.5)'
                : '1px solid oklch(0.85 0.28 142 / 0.1)',
              boxShadow: isSelected ? '0 0 12px oklch(0.85 0.28 142 / 0.15)' : 'none',
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs font-mono font-semibold truncate"
                  style={{ color: isSelected ? 'oklch(0.85 0.28 142)' : 'oklch(0.8 0.05 150)' }}
                >
                  {ticket.subject}
                </p>
                <p className="text-xs font-mono mt-1 opacity-60" style={{ color: 'oklch(0.5 0.04 150)' }}>
                  {ticket.messages.length} mensagem(ns)
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span
                  className="text-xs font-mono px-1.5 py-0.5 rounded flex items-center gap-1"
                  style={isOpen ? {
                    background: 'oklch(0.85 0.28 142 / 0.12)',
                    color: 'oklch(0.85 0.28 142)',
                    border: '1px solid oklch(0.85 0.28 142 / 0.3)',
                  } : {
                    background: 'oklch(0.3 0.02 150 / 0.5)',
                    color: 'oklch(0.5 0.04 150)',
                    border: '1px solid oklch(0.3 0.02 150)',
                  }}
                >
                  {isOpen ? <Clock className="w-2.5 h-2.5" /> : <CheckCircle className="w-2.5 h-2.5" />}
                  {isOpen ? 'ABERTO' : 'RESOLVIDO'}
                </span>
                <ChevronRight
                  className="w-3 h-3 transition-transform group-hover:translate-x-0.5"
                  style={{ color: isSelected ? 'oklch(0.85 0.28 142)' : 'oklch(0.4 0.03 150)' }}
                />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
