import React, { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';

interface NotificationToastProps {
  message: string | null;
}

export default function NotificationToast({ message }: NotificationToastProps) {
  const [visible, setVisible] = useState(false);
  const [currentMsg, setCurrentMsg] = useState<string | null>(null);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (message) {
      setCurrentMsg(message);
      setVisible(true);
      setExiting(false);
    } else if (visible) {
      setExiting(true);
      const t = setTimeout(() => {
        setVisible(false);
        setExiting(false);
        setCurrentMsg(null);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [message]);

  if (!visible && !exiting) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg glass-panel-strong border border-neon-green/40 shadow-neon-md max-w-sm ${
        exiting ? 'animate-fade-out-up' : 'animate-fade-in-down'
      }`}
      style={{ borderColor: 'oklch(0.85 0.28 142 / 0.5)' }}
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
        style={{ background: 'oklch(0.85 0.28 142 / 0.15)', border: '1px solid oklch(0.85 0.28 142 / 0.4)' }}>
        <Bell className="w-4 h-4 neon-text" style={{ color: 'oklch(0.85 0.28 142)' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-mono font-semibold" style={{ color: 'oklch(0.85 0.28 142)' }}>
          NOTIFICAÇÃO
        </p>
        <p className="text-xs font-mono text-foreground/80 truncate">{currentMsg}</p>
      </div>
      <button
        onClick={() => setExiting(true)}
        className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
      >
        <X className="w-3 h-3" style={{ color: 'oklch(0.85 0.28 142)' }} />
      </button>
    </div>
  );
}
