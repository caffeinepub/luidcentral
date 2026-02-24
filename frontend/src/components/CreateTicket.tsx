import React, { useState } from 'react';
import { createTicket } from '../lib/db';
import { Loader2, Send } from 'lucide-react';

interface CreateTicketProps {
  luidId: string;
  senderName: string;
  onCreated?: () => void;
}

export function CreateTicket({ luidId, senderName, onCreated }: CreateTicketProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!subject.trim() || !message.trim()) {
      setError('Preencha todos os campos.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 300));
    createTicket(luidId, subject.trim(), message.trim(), senderName);
    setSubject('');
    setMessage('');
    setLoading(false);
    onCreated?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-mono font-semibold mb-2" style={{ color: 'oklch(0.65 0.1 150)' }}>
          ASSUNTO
        </label>
        <input
          type="text"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          placeholder="Descreva o assunto do ticket"
          className="w-full px-4 py-3 rounded-lg text-sm neon-input"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-mono font-semibold mb-2" style={{ color: 'oklch(0.65 0.1 150)' }}>
          MENSAGEM
        </label>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Descreva seu problema em detalhes..."
          rows={5}
          className="w-full px-4 py-3 rounded-lg text-sm neon-input resize-none"
          required
        />
      </div>

      {error && (
        <div
          className="px-4 py-3 rounded-lg text-xs font-mono"
          style={{
            background: 'oklch(0.55 0.22 25 / 0.1)',
            border: '1px solid oklch(0.55 0.22 25 / 0.4)',
            color: 'oklch(0.75 0.18 25)',
          }}
        >
          ⚠ {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-lg text-sm font-bold font-mono tracking-widest transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
        style={{
          background: loading ? 'oklch(0.85 0.28 142 / 0.5)' : 'oklch(0.85 0.28 142)',
          color: 'oklch(0.08 0.005 150)',
          boxShadow: loading ? 'none' : '0 0 20px oklch(0.85 0.28 142 / 0.4)',
        }}
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> CRIANDO...</>
        ) : (
          <><Send className="w-4 h-4" /> CRIAR TICKET</>
        )}
      </button>
    </form>
  );
}
