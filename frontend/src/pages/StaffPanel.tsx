import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { AllTicketsView } from '../components/AllTicketsView';
import { AllChatView } from '../components/AllChatView';
import NotificationToast from '../components/NotificationToast';
import { useNotifications } from '../hooks/useNotifications';
import { Ticket as TicketIcon, MessageSquare, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { getChatStatus, setChatStatus } from '../lib/db';

export default function StaffPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'tickets' | 'chat'>('tickets');
  const [refreshKey, setRefreshKey] = useState(0);
  const [chatOnline, setChatOnlineState] = useState<boolean>(() => getChatStatus() === 'Online');

  const { counts, toastMessage, clearTicketNotifications, clearChatNotifications } = useNotifications({
    role: 'staff',
  });

  if (!user || user.userType !== 'staff') {
    navigate({ to: '/staff' });
    return null;
  }

  const handleTabChange = (tab: 'tickets' | 'chat') => {
    setActiveTab(tab);
    if (tab === 'tickets') clearTicketNotifications();
    if (tab === 'chat') clearChatNotifications();
  };

  const handleToggleChat = () => {
    const newStatus = chatOnline ? 'Offline' : 'Online';
    setChatStatus(newStatus);
    setChatOnlineState(!chatOnline);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'oklch(0.08 0.005 150)' }}>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(oklch(0.7 0.15 220 / 0.02) 1px, transparent 1px),
            linear-gradient(90deg, oklch(0.7 0.15 220 / 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <Header />
      <NotificationToast message={toastMessage} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 relative">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2
              className="text-lg font-bold font-mono tracking-wider"
              style={{ color: 'oklch(0.7 0.15 220)', textShadow: '0 0 10px oklch(0.7 0.15 220 / 0.4)' }}
            >
              PAINEL STAFF
            </h2>
            <p className="text-xs font-mono mt-0.5" style={{ color: 'oklch(0.5 0.04 150)' }}>
              Gerenciamento de tickets e chat
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Chat toggle */}
            <button
              onClick={handleToggleChat}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold tracking-wider transition-all duration-200"
              style={{
                color: chatOnline ? 'oklch(0.85 0.28 142)' : 'oklch(0.55 0.18 25)',
                border: `1px solid ${chatOnline ? 'oklch(0.85 0.28 142 / 0.4)' : 'oklch(0.55 0.18 25 / 0.4)'}`,
                background: chatOnline ? 'oklch(0.85 0.28 142 / 0.08)' : 'oklch(0.55 0.18 25 / 0.08)',
                boxShadow: chatOnline ? '0 0 8px oklch(0.85 0.28 142 / 0.2)' : 'none',
              }}
            >
              {chatOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              CHAT {chatOnline ? 'ONLINE' : 'OFFLINE'}
            </button>

            <button
              onClick={() => setRefreshKey(k => k + 1)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold tracking-wider transition-all duration-200"
              style={{
                color: 'oklch(0.7 0.15 220)',
                border: '1px solid oklch(0.7 0.15 220 / 0.4)',
                background: 'oklch(0.7 0.15 220 / 0.08)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 12px oklch(0.7 0.15 220 / 0.3)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
              }}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              ATUALIZAR
            </button>
          </div>
        </div>

        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: 'oklch(0.11 0.008 150 / 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid oklch(0.7 0.15 220 / 0.2)',
          }}
        >
          <div className="flex border-b" style={{ borderColor: 'oklch(0.7 0.15 220 / 0.15)' }}>
            {(['tickets', 'chat'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className="flex items-center gap-2 px-6 py-4 text-sm font-mono font-semibold tracking-wider transition-all duration-200"
                style={{
                  color: activeTab === tab ? 'oklch(0.7 0.15 220)' : 'oklch(0.5 0.04 150)',
                  background: activeTab === tab ? 'oklch(0.7 0.15 220 / 0.08)' : 'transparent',
                  borderBottom: activeTab === tab ? '2px solid oklch(0.7 0.15 220)' : '2px solid transparent',
                  textShadow: activeTab === tab ? '0 0 8px oklch(0.7 0.15 220 / 0.5)' : 'none',
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

          <div className="p-4 min-h-[500px]">
            {activeTab === 'tickets' && <AllTicketsView key={refreshKey} />}
            {activeTab === 'chat' && <AllChatView key={refreshKey} />}
          </div>
        </div>
      </main>

      <footer
        className="py-4 text-center text-xs font-mono mt-auto"
        style={{ color: 'oklch(0.35 0.02 150)', borderTop: '1px solid oklch(0.7 0.15 220 / 0.08)' }}
      >
        © {new Date().getFullYear()} LuidCentral — Todos os direitos reservados.
      </footer>
    </div>
  );
}
