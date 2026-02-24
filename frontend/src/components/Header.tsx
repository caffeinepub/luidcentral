import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, UserCircle } from 'lucide-react';
import { ClientProfile } from './ClientProfile';

interface HeaderProps {
  onLogout?: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    onLogout?.();
  };

  const roleLabel =
    user?.userType === 'admin' ? 'MASTER' :
    user?.userType === 'staff' ? 'STAFF' : 'CLIENT';

  const roleColor =
    user?.userType === 'admin'
      ? 'oklch(0.75 0.18 80)'
      : user?.userType === 'staff'
      ? 'oklch(0.7 0.15 220)'
      : 'oklch(0.85 0.28 142)';

  return (
    <>
      <header
        className="sticky top-0 z-40 w-full scan-line"
        style={{
          background: 'oklch(0.09 0.007 150 / 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid oklch(0.85 0.28 142 / 0.2)',
          boxShadow: '0 0 20px oklch(0.85 0.28 142 / 0.05)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/luid-logo.dim_256x256.png"
                alt="LuidCorporation"
                className="h-9 w-9 object-contain"
                style={{ filter: 'drop-shadow(0 0 6px oklch(0.85 0.28 142 / 0.5))' }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="flex flex-col leading-none">
                <span
                  className="text-sm font-bold tracking-widest font-mono"
                  style={{
                    color: 'oklch(0.85 0.28 142)',
                    textShadow: '0 0 10px oklch(0.85 0.28 142 / 0.5)',
                  }}
                >
                  LUID CENTRAL DE ATENDIMENTO
                </span>
                <span
                  className="text-xs font-mono tracking-wider"
                  style={{ color: 'oklch(0.5 0.04 150)' }}
                >
                  LuidCorporation
                </span>
              </div>
            </div>

            {/* User info + logout */}
            {user && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-mono font-bold px-2 py-0.5 rounded"
                    style={{
                      color: roleColor,
                      background: `${roleColor}20`,
                      border: `1px solid ${roleColor}50`,
                    }}
                  >
                    {roleLabel}
                  </span>

                  {/* Client profile button */}
                  {user.userType === 'client' ? (
                    <button
                      onClick={() => setProfileOpen(true)}
                      className="flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded transition-all duration-200"
                      style={{
                        color: 'oklch(0.65 0.08 150)',
                        border: '1px solid oklch(0.3 0.02 150)',
                        background: 'transparent',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.color = 'oklch(0.85 0.28 142)';
                        (e.currentTarget as HTMLButtonElement).style.borderColor = 'oklch(0.85 0.28 142 / 0.5)';
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 10px oklch(0.85 0.28 142 / 0.2)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.color = 'oklch(0.65 0.08 150)';
                        (e.currentTarget as HTMLButtonElement).style.borderColor = 'oklch(0.3 0.02 150)';
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                      }}
                    >
                      <UserCircle className="w-3.5 h-3.5" />
                      {user.displayName}
                    </button>
                  ) : (
                    <span
                      className="text-xs font-mono"
                      style={{ color: 'oklch(0.65 0.08 150)' }}
                    >
                      {user.displayName}
                    </span>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs font-mono px-2.5 py-1.5 rounded transition-all duration-200"
                  style={{
                    color: 'oklch(0.65 0.18 25)',
                    border: '1px solid oklch(0.65 0.18 25 / 0.3)',
                    background: 'transparent',
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
                  <LogOut className="w-3.5 h-3.5" />
                  SAIR
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {user?.userType === 'client' && (
        <ClientProfile
          luidId={user.id}
          open={profileOpen}
          onClose={() => setProfileOpen(false)}
        />
      )}
    </>
  );
}
