import React from 'react';
import { findClient } from '../lib/db';
import type { SupportTier } from '../types/db';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { User, Calendar, Shield, Tag } from 'lucide-react';

interface ClientProfileProps {
  luidId: string;
  open: boolean;
  onClose: () => void;
}

function TierBadge({ tier }: { tier: SupportTier }) {
  const styles: Record<SupportTier, { color: string; bg: string; border: string; glow: string; label: string }> = {
    Basic: {
      color: 'oklch(0.6 0.04 150)',
      bg: 'oklch(0.6 0.04 150 / 0.1)',
      border: 'oklch(0.6 0.04 150 / 0.3)',
      glow: 'none',
      label: 'BASIC',
    },
    Premium: {
      color: 'oklch(0.85 0.28 142)',
      bg: 'oklch(0.85 0.28 142 / 0.12)',
      border: 'oklch(0.85 0.28 142 / 0.5)',
      glow: '0 0 12px oklch(0.85 0.28 142 / 0.4)',
      label: 'PREMIUM',
    },
    Enterprise: {
      color: 'oklch(0.75 0.18 80)',
      bg: 'oklch(0.75 0.18 80 / 0.12)',
      border: 'oklch(0.75 0.18 80 / 0.5)',
      glow: '0 0 14px oklch(0.75 0.18 80 / 0.5)',
      label: 'ENTERPRISE',
    },
  };

  const s = styles[tier];

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono tracking-widest"
      style={{
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.border}`,
        boxShadow: s.glow,
      }}
    >
      <Shield className="w-3 h-3" />
      {s.label}
    </span>
  );
}

export function ClientProfile({ luidId, open, onClose }: ClientProfileProps) {
  const client = findClient(luidId);
  const tier: SupportTier = client?.tier ?? 'Basic';
  const clientName = client?.clientName ?? '';
  const createdAt = client?.createdAt
    ? new Date(client.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '—';

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent
        className="max-w-sm p-0 overflow-hidden"
        style={{
          background: 'oklch(0.11 0.008 150)',
          border: '1px solid oklch(0.85 0.28 142 / 0.3)',
          boxShadow: '0 0 40px oklch(0.85 0.28 142 / 0.1), 0 20px 60px oklch(0 0 0 / 0.6)',
        }}
      >
        {/* Header strip */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{
            borderBottom: '1px solid oklch(0.85 0.28 142 / 0.15)',
            background: 'oklch(0.09 0.007 150)',
          }}
        >
          <DialogHeader className="p-0">
            <DialogTitle
              className="text-sm font-bold font-mono tracking-widest"
              style={{ color: 'oklch(0.85 0.28 142)', textShadow: '0 0 8px oklch(0.85 0.28 142 / 0.4)' }}
            >
              PERFIL DO CLIENTE
            </DialogTitle>
            <DialogDescription className="sr-only">
              Informações do perfil e nível de suporte
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Avatar + LUID */}
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'oklch(0.85 0.28 142 / 0.1)',
                border: '1px solid oklch(0.85 0.28 142 / 0.35)',
                boxShadow: '0 0 15px oklch(0.85 0.28 142 / 0.15)',
              }}
            >
              <User className="w-7 h-7" style={{ color: 'oklch(0.85 0.28 142)' }} />
            </div>
            <div>
              {clientName && (
                <p
                  className="text-base font-bold font-mono tracking-wide"
                  style={{ color: 'oklch(0.92 0.04 150)' }}
                >
                  {clientName}
                </p>
              )}
              <p className="text-xs font-mono" style={{ color: 'oklch(0.45 0.03 150)' }}>
                LUID ID
              </p>
              <p
                className="text-sm font-bold font-mono tracking-wider mt-0.5"
                style={{ color: 'oklch(0.85 0.28 142)', textShadow: '0 0 8px oklch(0.85 0.28 142 / 0.3)' }}
              >
                {luidId}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid oklch(0.85 0.28 142 / 0.1)' }} />

          {/* Info rows */}
          <div className="space-y-4">
            {/* Client name row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5" style={{ color: 'oklch(0.5 0.04 150)' }} />
                <span className="text-xs font-mono" style={{ color: 'oklch(0.5 0.04 150)' }}>
                  NOME
                </span>
              </div>
              <span className="text-xs font-mono" style={{ color: clientName ? 'oklch(0.75 0.05 150)' : 'oklch(0.35 0.02 150)' }}>
                {clientName || 'Não definido'}
              </span>
            </div>

            {/* Creation date */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" style={{ color: 'oklch(0.5 0.04 150)' }} />
                <span className="text-xs font-mono" style={{ color: 'oklch(0.5 0.04 150)' }}>
                  MEMBRO DESDE
                </span>
              </div>
              <span className="text-xs font-mono" style={{ color: 'oklch(0.75 0.05 150)' }}>
                {createdAt}
              </span>
            </div>

            {/* Support tier */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" style={{ color: 'oklch(0.5 0.04 150)' }} />
                <span className="text-xs font-mono" style={{ color: 'oklch(0.5 0.04 150)' }}>
                  NÍVEL DE SUPORTE
                </span>
              </div>
              <TierBadge tier={tier} />
            </div>
          </div>

          {/* Tier description */}
          <div
            className="rounded-lg px-4 py-3"
            style={{
              background: 'oklch(0.09 0.007 150)',
              border: '1px solid oklch(0.85 0.28 142 / 0.1)',
            }}
          >
            {tier === 'Basic' && (
              <p className="text-xs font-mono" style={{ color: 'oklch(0.5 0.04 150)' }}>
                Suporte básico com tempo de resposta padrão. Acesso ao portal de tickets e chat.
              </p>
            )}
            {tier === 'Premium' && (
              <p className="text-xs font-mono" style={{ color: 'oklch(0.7 0.15 142)' }}>
                Suporte prioritário com tempo de resposta reduzido. Atendimento dedicado e acesso a recursos avançados.
              </p>
            )}
            {tier === 'Enterprise' && (
              <p className="text-xs font-mono" style={{ color: 'oklch(0.7 0.12 80)' }}>
                Suporte enterprise com SLA garantido. Gerente de conta dedicado e suporte 24/7.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
