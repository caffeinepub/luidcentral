import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { AddClientForm } from '../components/AddClientForm';
import { ClientsTable } from '../components/ClientsTable';
import { AllTicketsView } from '../components/AllTicketsView';
import { AllChatView } from '../components/AllChatView';
import NotificationToast from '../components/NotificationToast';
import { useNotifications } from '../hooks/useNotifications';
import { UserPlus, Users, Ticket as TicketIcon, MessageSquare, UserCog, Wifi, WifiOff } from 'lucide-react';
import { getStaff, createStaffMember, deleteStaffMember, getChatStatus, setChatStatus } from '../lib/db';
import type { Staff } from '../types/db';

type Section = 'add-client' | 'clients' | 'tickets' | 'chat' | 'staff';

export default function MasterPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<Section>('clients');
  const [staffList, setStaffList] = useState<Staff[]>(() => getStaff());
  const [newStaffUsername, setNewStaffUsername] = useState('');
  const [newStaffPassword, setNewStaffPassword] = useState('');
  const [staffError, setStaffError] = useState('');
  const [staffSuccess, setStaffSuccess] = useState('');
  const [chatOnline, setChatOnline] = useState<boolean>(() => getChatStatus() === 'Online');

  const { counts, toastMessage, clearTicketNotifications, clearChatNotifications } = useNotifications({
    role: 'master',
  });

  if (!user || user.userType !== 'admin') {
    navigate({ to: '/master' });
    return null;
  }

  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
    if (section === 'tickets') clearTicketNotifications();
    if (section === 'chat') clearChatNotifications();
  };

  const handleToggleChat = () => {
    const newStatus = chatOnline ? 'Offline' : 'Online';
    setChatStatus(newStatus);
    setChatOnline(!chatOnline);
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    setStaffError('');
    setStaffSuccess('');
    if (!newStaffUsername.trim() || !newStaffPassword.trim()) {
      setStaffError('Preencha todos os campos.');
      return;
    }
    const result = createStaffMember(newStaffUsername.trim(), newStaffPassword.trim());
    if (!result) {
      setStaffError(`Usuário "${newStaffUsername.trim()}" já existe.`);
    } else {
      setStaffSuccess(`Staff "${newStaffUsername.trim()}" adicionado com sucesso!`);
      setNewStaffUsername('');
      setNewStaffPassword('');
      setStaffList(getStaff());
    }
  };

  const handleDeleteStaff = (id: string, username: string) => {
    if (confirm(`Remover staff "${username}"?`)) {
      deleteStaffMember(id);
      setStaffList(getStaff());
    }
  };

  const navItems: { id: Section; label: string; icon: React.ReactNode }[] = [
    { id: 'add-client', label: 'ADD CLIENT', icon: <UserPlus className="w-4 h-4" /> },
    { id: 'clients', label: 'CLIENTES', icon: <Users className="w-4 h-4" /> },
    {
      id: 'tickets', label: 'TICKETS', icon: (
        <span className="relative inline-flex">
          <TicketIcon className="w-4 h-4" />
          {counts.tickets > 0 && (
            <span className="notification-badge absolute -top-2 -right-2">{counts.tickets}</span>
          )}
        </span>
      )
    },
    {
      id: 'chat', label: 'CHAT', icon: (
        <span className="relative inline-flex">
          <MessageSquare className="w-4 h-4" />
          {counts.chat > 0 && (
            <span className="notification-badge absolute -top-2 -right-2">{counts.chat}</span>
          )}
        </span>
      )
    },
    { id: 'staff', label: 'STAFF', icon: <UserCog className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'oklch(0.08 0.005 150)' }}>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(oklch(0.75 0.18 80 / 0.02) 1px, transparent 1px),
            linear-gradient(90deg, oklch(0.75 0.18 80 / 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <Header />
      <NotificationToast message={toastMessage} />

      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 py-6 gap-5 relative">
        {/* Sidebar */}
        <aside
          className="w-52 flex-shrink-0 rounded-xl p-3 h-fit sticky top-20"
          style={{
            background: 'oklch(0.11 0.008 150 / 0.9)',
            backdropFilter: 'blur(12px)',
            border: '1px solid oklch(0.75 0.18 80 / 0.25)',
          }}
        >
          <div className="mb-4 px-2">
            <p className="text-xs font-mono font-bold tracking-widest" style={{ color: 'oklch(0.75 0.18 80)' }}>
              MASTER PANEL
            </p>
            <p className="text-xs font-mono mt-0.5" style={{ color: 'oklch(0.4 0.03 150)' }}>
              {user.displayName}
            </p>
          </div>

          <nav className="space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono font-semibold tracking-wider transition-all duration-200 text-left"
                style={{
                  color: activeSection === item.id ? 'oklch(0.75 0.18 80)' : 'oklch(0.5 0.04 150)',
                  background: activeSection === item.id ? 'oklch(0.75 0.18 80 / 0.12)' : 'transparent',
                  borderLeft: activeSection === item.id ? '2px solid oklch(0.75 0.18 80)' : '2px solid transparent',
                  textShadow: activeSection === item.id ? '0 0 8px oklch(0.75 0.18 80 / 0.4)' : 'none',
                }}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          {/* Chat status toggle */}
          <div
            className="mt-4 pt-4"
            style={{ borderTop: '1px solid oklch(0.75 0.18 80 / 0.15)' }}
          >
            <p className="text-xs font-mono px-2 mb-2" style={{ color: 'oklch(0.4 0.03 150)' }}>
              STATUS DO CHAT
            </p>
            <button
              onClick={handleToggleChat}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono font-bold tracking-wider transition-all duration-200"
              style={{
                color: chatOnline ? 'oklch(0.85 0.28 142)' : 'oklch(0.55 0.18 25)',
                background: chatOnline ? 'oklch(0.85 0.28 142 / 0.1)' : 'oklch(0.55 0.18 25 / 0.1)',
                border: `1px solid ${chatOnline ? 'oklch(0.85 0.28 142 / 0.4)' : 'oklch(0.55 0.18 25 / 0.4)'}`,
                boxShadow: chatOnline ? '0 0 8px oklch(0.85 0.28 142 / 0.2)' : 'none',
              }}
            >
              {chatOnline
                ? <Wifi className="w-3.5 h-3.5" />
                : <WifiOff className="w-3.5 h-3.5" />
              }
              {chatOnline ? 'ONLINE' : 'OFFLINE'}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main
          className="flex-1 rounded-xl p-5 min-h-[600px]"
          style={{
            background: 'oklch(0.11 0.008 150 / 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid oklch(0.75 0.18 80 / 0.2)',
          }}
        >
          {activeSection === 'add-client' && <AddClientForm onClientAdded={() => {}} />}
          {activeSection === 'clients' && <ClientsTable refreshKey={0} />}
          {activeSection === 'tickets' && <AllTicketsView />}
          {activeSection === 'chat' && (
            <div>
              {/* Chat status banner */}
              <div
                className="flex items-center justify-between mb-4 px-4 py-3 rounded-lg"
                style={{
                  background: chatOnline ? 'oklch(0.85 0.28 142 / 0.06)' : 'oklch(0.55 0.18 25 / 0.06)',
                  border: `1px solid ${chatOnline ? 'oklch(0.85 0.28 142 / 0.2)' : 'oklch(0.55 0.18 25 / 0.2)'}`,
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: chatOnline ? 'oklch(0.85 0.28 142)' : 'oklch(0.55 0.18 25)',
                      boxShadow: chatOnline ? '0 0 6px oklch(0.85 0.28 142)' : 'none',
                    }}
                  />
                  <span
                    className="text-xs font-mono font-bold"
                    style={{ color: chatOnline ? 'oklch(0.85 0.28 142)' : 'oklch(0.55 0.18 25)' }}
                  >
                    CHAT {chatOnline ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>
                <button
                  onClick={handleToggleChat}
                  className="text-xs font-mono px-3 py-1 rounded transition-all"
                  style={{
                    color: chatOnline ? 'oklch(0.55 0.18 25)' : 'oklch(0.85 0.28 142)',
                    border: `1px solid ${chatOnline ? 'oklch(0.55 0.18 25 / 0.4)' : 'oklch(0.85 0.28 142 / 0.4)'}`,
                  }}
                >
                  {chatOnline ? 'COLOCAR OFFLINE' : 'COLOCAR ONLINE'}
                </button>
              </div>
              <AllChatView />
            </div>
          )}
          {activeSection === 'staff' && (
            <div>
              <h3
                className="text-base font-bold font-mono tracking-wider mb-5"
                style={{ color: 'oklch(0.75 0.18 80)' }}
              >
                GERENCIAR STAFF
              </h3>

              {/* Add staff form */}
              <form
                onSubmit={handleAddStaff}
                className="mb-6 p-4 rounded-lg"
                style={{ border: '1px solid oklch(0.75 0.18 80 / 0.2)', background: 'oklch(0.09 0.007 150)' }}
              >
                <p className="text-xs font-mono font-semibold mb-3" style={{ color: 'oklch(0.65 0.1 80)' }}>
                  ADICIONAR STAFF
                </p>
                <div className="flex gap-3 flex-wrap">
                  <input
                    type="text"
                    value={newStaffUsername}
                    onChange={e => setNewStaffUsername(e.target.value)}
                    placeholder="Usuário"
                    className="flex-1 min-w-32 px-3 py-2 rounded-lg text-sm neon-input"
                    style={{ borderColor: 'oklch(0.75 0.18 80 / 0.3)' }}
                  />
                  <input
                    type="password"
                    value={newStaffPassword}
                    onChange={e => setNewStaffPassword(e.target.value)}
                    placeholder="Senha"
                    className="flex-1 min-w-32 px-3 py-2 rounded-lg text-sm neon-input"
                    style={{ borderColor: 'oklch(0.75 0.18 80 / 0.3)' }}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg text-xs font-bold font-mono tracking-wider transition-all"
                    style={{
                      background: 'oklch(0.75 0.18 80)',
                      color: 'oklch(0.08 0.005 150)',
                      boxShadow: '0 0 12px oklch(0.75 0.18 80 / 0.3)',
                    }}
                  >
                    ADICIONAR
                  </button>
                </div>
                {staffError && (
                  <p className="text-xs font-mono mt-2" style={{ color: 'oklch(0.75 0.18 25)' }}>⚠ {staffError}</p>
                )}
                {staffSuccess && (
                  <p className="text-xs font-mono mt-2" style={{ color: 'oklch(0.85 0.28 142)' }}>✓ {staffSuccess}</p>
                )}
              </form>

              {/* Staff list */}
              <div className="space-y-2">
                {staffList.length === 0 ? (
                  <p className="text-sm font-mono text-center py-8" style={{ color: 'oklch(0.4 0.03 150)' }}>
                    Nenhum staff cadastrado
                  </p>
                ) : (
                  staffList.map(s => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between px-4 py-3 rounded-lg"
                      style={{
                        background: 'oklch(0.09 0.007 150)',
                        border: '1px solid oklch(0.75 0.18 80 / 0.15)',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-7 h-7 rounded flex items-center justify-center text-xs font-bold font-mono"
                          style={{ background: 'oklch(0.75 0.18 80 / 0.15)', color: 'oklch(0.75 0.18 80)' }}
                        >
                          {s.username[0].toUpperCase()}
                        </div>
                        <div>
                          <span className="text-sm font-mono" style={{ color: 'oklch(0.8 0.05 150)' }}>
                            {s.username}
                          </span>
                          <span className="text-xs font-mono ml-2" style={{ color: 'oklch(0.45 0.03 150)' }}>
                            {s.role}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteStaff(s.id, s.username)}
                        className="text-xs font-mono px-3 py-1 rounded transition-all"
                        style={{
                          color: 'oklch(0.65 0.18 25)',
                          border: '1px solid oklch(0.65 0.18 25 / 0.3)',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLButtonElement).style.background = 'oklch(0.65 0.18 25 / 0.1)';
                          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 8px oklch(0.65 0.18 25 / 0.3)';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                          (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                        }}
                      >
                        REMOVER
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      <footer
        className="py-4 text-center text-xs font-mono mt-auto"
        style={{ color: 'oklch(0.35 0.02 150)', borderTop: '1px solid oklch(0.75 0.18 80 / 0.08)' }}
      >
        © {new Date().getFullYear()} LuidCentral — Todos os direitos reservados.
      </footer>
    </div>
  );
}
