import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { TicketList } from '../components/TicketList';
import { TicketDetail } from '../components/TicketDetail';
import { CreateTicket } from '../components/CreateTicket';
import { ChatView } from '../components/ChatView';
import NotificationToast from '../components/NotificationToast';
import { useNotifications } from '../hooks/useNotifications';
import type { Ticket } from '../types/db';
import { Plus, Ticket as TicketIcon, MessageSquare, X } from 'lucide-react';

export default function ClientPortal() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'tickets' | 'chat'>('tickets');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [ticketRefreshKey, setTicketRefreshKey] = useState(0);

  const { counts, toastMessage, clearTicketNotifications, clearChatNotifications } = useNotifications({
    role: 'client',
    clientId: user?.id,
  });

  if (!user) {
    navigate({ to: '/' });
    return null;
  }

  const handleTabChange = (tab: 'tickets' | 'chat') => {
    setActiveTab(tab);
    if (tab === 'tickets') clearTicketNotifications();
    if (tab === 'chat') clearChatNotifications();
  };

  const handleTicketCreated = () => {
    setShowCreateTicket(false);
    setTicketRefreshKey(k => k + 1);
    clearTicketNotifications();
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'oklch(0.08 0.005 150)' }}>
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(oklch(0.85 0.28 142 / 0.02) 1px, transparent 1px),
            linear-gradient(90deg, oklch(0.85 0.28 142 / 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <Header />
      <NotificationToast message={toastMessage} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 relative">
        {/* Welcome + Create Ticket button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2
              className="text-lg font-bold font-mono tracking-wider"
              style={{ color: 'oklch(0.85 0.28 142)', textShadow: '0 0 10px oklch(0.85 0.28 142 / 0.4)' }}
            >
              BEM-VINDO, <span style={{ color: 'oklch(0.95 0.02 150)' }}>{user.displayName}</span>
            </h2>
            <p className="text-xs font-mono mt-0.5" style={{ color: 'oklch(0.5 0.04 150)' }}>
              Portal de suporte ao cliente
            </p>
          </div>

          {/* Prominent Create Ticket Button */}
          <button
            onClick={() => setShowCreateTicket(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold font-mono text-sm tracking-wider transition-all duration-200 animate-neon-pulse"
            style={{
              background: 'oklch(0.85 0.28 142)',
              color: 'oklch(0.08 0.005 150)',
              boxShadow: '0 0 20px oklch(0.85 0.28 142 / 0.5)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 35px oklch(0.85 0.28 142 / 0.8), 0 0 60px oklch(0.85 0.28 142 / 0.3)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px oklch(0.85 0.28 142 / 0.5)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
            }}
          >
            <Plus className="w-4 h-4" />
            NOVO TICKET
          </button>
        </div>

        {/* Create Ticket Modal */}
        {showCreateTicket && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'oklch(0 0 0 / 0.7)', backdropFilter: 'blur(4px)' }}
            onClick={e => { if (e.target === e.currentTarget) setShowCreateTicket(false); }}
          >
            <div
              className="w-full max-w-lg rounded-xl p-6 relative"
              style={{
                background: 'oklch(0.11 0.008 150 / 0.98)',
                border: '1px solid oklch(0.85 0.28 142 / 0.4)',
                boxShadow: '0 0 40px oklch(0.85 0.28 142 / 0.15)',
              }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3
                  className="text-base font-bold font-mono tracking-wider"
                  style={{ color: 'oklch(0.85 0.28 142)' }}
                >
                  ABRIR NOVO TICKET
                </h3>
                <button
                  onClick={() => setShowCreateTicket(false)}
                  className="w-7 h-7 rounded flex items-center justify-center transition-all"
                  style={{ color: 'oklch(0.5 0.04 150)', border: '1px solid oklch(0.25 0.02 150)' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.color = 'oklch(0.85 0.28 142)';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'oklch(0.85 0.28 142 / 0.5)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.color = 'oklch(0.5 0.04 150)';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'oklch(0.25 0.02 150)';
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <CreateTicket
                luidId={user.id}
                senderName={user.displayName}
                onCreated={handleTicketCreated}
              />
            </div>
          </div>
        )}

        {/* Tabs */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: 'oklch(0.11 0.008 150 / 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid oklch(0.85 0.28 142 / 0.2)',
          }}
        >
          {/* Tab headers */}
          <div
            className="flex border-b"
            style={{ borderColor: 'oklch(0.85 0.28 142 / 0.15)' }}
          >
            {(['tickets', 'chat'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className="flex items-center gap-2 px-6 py-4 text-sm font-mono font-semibold tracking-wider transition-all duration-200 relative"
                style={{
                  color: activeTab === tab ? 'oklch(0.85 0.28 142)' : 'oklch(0.5 0.04 150)',
                  background: activeTab === tab ? 'oklch(0.85 0.28 142 / 0.08)' : 'transparent',
                  borderBottom: activeTab === tab ? '2px solid oklch(0.85 0.28 142)' : '2px solid transparent',
                  textShadow: activeTab === tab ? '0 0 8px oklch(0.85 0.28 142 / 0.5)' : 'none',
                }}
              >
                {tab === 'tickets' ? <TicketIcon className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                {tab === 'tickets' ? 'TICKETS' : 'CHAT'}
                {(tab === 'tickets' ? counts.tickets : counts.chat) > 0 && (
                  <span className="notification-badge ml-1">
                    {tab === 'tickets' ? counts.tickets : counts.chat}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-4 min-h-[500px]">
            {activeTab === 'tickets' && (
              <div className="flex gap-4 h-full">
                <div className="w-72 flex-shrink-0">
                  <TicketList
                    key={ticketRefreshKey}
                    luidId={user.id}
                    selectedTicketId={selectedTicket?.id ?? null}
                    onSelect={setSelectedTicket}
                  />
                </div>
                <div className="flex-1">
                  {selectedTicket ? (
                    <TicketDetail
                      ticket={selectedTicket}
                      onUpdate={updated => setSelectedTicket(updated)}
                    />
                  ) : (
                    <div
                      className="h-full flex flex-col items-center justify-center rounded-lg"
                      style={{
                        border: '1px dashed oklch(0.85 0.28 142 / 0.2)',
                        color: 'oklch(0.4 0.03 150)',
                      }}
                    >
                      <TicketIcon className="w-10 h-10 mb-3 opacity-30" style={{ color: 'oklch(0.85 0.28 142)' }} />
                      <p className="text-sm font-mono">Selecione um ticket para visualizar</p>
                      <p className="text-xs font-mono mt-1 opacity-60">ou crie um novo ticket acima</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {activeTab === 'chat' && (
              <ChatView luidId={user.id} />
            )}
          </div>
        </div>
      </main>

      <footer
        className="py-4 text-center text-xs font-mono mt-auto"
        style={{ color: 'oklch(0.35 0.02 150)', borderTop: '1px solid oklch(0.85 0.28 142 / 0.08)' }}
      >
        © {new Date().getFullYear()} LuidCentral — Todos os direitos reservados.
      </footer>
    </div>
  );
}
