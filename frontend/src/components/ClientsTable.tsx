import React, { useState } from 'react';
import { Trash2, User, Pencil, KeyRound, Check, X } from 'lucide-react';
import { getClients, deleteClient, updateClientTier, updateClient, hashPassword } from '../lib/db';
import type { Client, SupportTier } from '../types/db';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface ClientsTableProps {
  refreshKey: number;
}

const TIERS: SupportTier[] = ['Basic', 'Premium', 'Enterprise'];

const tierStyles: Record<SupportTier, { color: string; bg: string; border: string }> = {
  Basic: {
    color: 'oklch(0.6 0.04 150)',
    bg: 'oklch(0.6 0.04 150 / 0.1)',
    border: 'oklch(0.6 0.04 150 / 0.3)',
  },
  Premium: {
    color: 'oklch(0.85 0.28 142)',
    bg: 'oklch(0.85 0.28 142 / 0.1)',
    border: 'oklch(0.85 0.28 142 / 0.4)',
  },
  Enterprise: {
    color: 'oklch(0.75 0.18 80)',
    bg: 'oklch(0.75 0.18 80 / 0.1)',
    border: 'oklch(0.75 0.18 80 / 0.4)',
  },
};

interface EditNameState {
  luidId: string;
  value: string;
}

interface EditPasswordState {
  luidId: string;
  newPassword: string;
  confirmPassword: string;
  error: string;
  success: string;
}

export function ClientsTable({ refreshKey }: ClientsTableProps) {
  const [clients, setClients] = useState<Client[]>(() => getClients());
  const [editName, setEditName] = useState<EditNameState | null>(null);
  const [passwordModal, setPasswordModal] = useState<EditPasswordState | null>(null);

  React.useEffect(() => {
    setClients(getClients());
  }, [refreshKey]);

  const handleDelete = (luidId: string) => {
    if (confirm(`Remover cliente "${luidId}"? Esta ação não pode ser desfeita.`)) {
      deleteClient(luidId);
      setClients(getClients());
    }
  };

  const handleTierChange = (luidId: string, tier: SupportTier) => {
    updateClientTier(luidId, tier);
    setClients(getClients());
  };

  // ── Name editing ──────────────────────────────────────────────────────────
  const startEditName = (client: Client) => {
    setEditName({ luidId: client.luidId, value: client.clientName ?? '' });
  };

  const cancelEditName = () => setEditName(null);

  const saveEditName = (luidId: string) => {
    if (!editName) return;
    updateClient(luidId, { clientName: editName.value.trim() });
    setClients(getClients());
    setEditName(null);
  };

  // ── Password editing ──────────────────────────────────────────────────────
  const openPasswordModal = (luidId: string) => {
    setPasswordModal({ luidId, newPassword: '', confirmPassword: '', error: '', success: '' });
  };

  const closePasswordModal = () => setPasswordModal(null);

  const handlePasswordSave = () => {
    if (!passwordModal) return;
    const { luidId, newPassword, confirmPassword } = passwordModal;

    if (!newPassword.trim()) {
      setPasswordModal(prev => prev ? { ...prev, error: 'A nova senha não pode estar vazia.', success: '' } : null);
      return;
    }
    if (newPassword.trim().length < 4) {
      setPasswordModal(prev => prev ? { ...prev, error: 'A senha deve ter pelo menos 4 caracteres.', success: '' } : null);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordModal(prev => prev ? { ...prev, error: 'As senhas não coincidem.', success: '' } : null);
      return;
    }

    updateClient(luidId, { passwordHash: hashPassword(newPassword.trim()) });
    setPasswordModal(prev => prev ? { ...prev, error: '', success: 'Senha atualizada com sucesso!', newPassword: '', confirmPassword: '' } : null);
    setClients(getClients());
  };

  if (clients.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground font-mono text-sm">
        <User className="w-8 h-8 mx-auto mb-3 opacity-30" />
        <p>Nenhum cliente cadastrado.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded border border-industrial-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-industrial-border hover:bg-transparent">
              <TableHead className="font-mono text-xs text-emerald-DEFAULT tracking-wider uppercase">LUID ID</TableHead>
              <TableHead className="font-mono text-xs text-emerald-DEFAULT tracking-wider uppercase">Nome do Cliente</TableHead>
              <TableHead className="font-mono text-xs text-emerald-DEFAULT tracking-wider uppercase">Cadastrado em</TableHead>
              <TableHead className="font-mono text-xs text-emerald-DEFAULT tracking-wider uppercase">Nível de Suporte</TableHead>
              <TableHead className="font-mono text-xs text-emerald-DEFAULT tracking-wider uppercase text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => {
              const tier: SupportTier = client.tier ?? 'Basic';
              const ts = tierStyles[tier];
              const isEditingName = editName?.luidId === client.luidId;

              return (
                <TableRow key={client.luidId} className="border-industrial-border hover:bg-industrial-surface/50">
                  {/* LUID ID */}
                  <TableCell className="font-mono text-sm font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-DEFAULT" />
                      <span style={{ color: 'oklch(0.85 0.28 142)' }}>{client.luidId}</span>
                    </div>
                  </TableCell>

                  {/* Client Name (editable) */}
                  <TableCell className="font-mono text-sm">
                    {isEditingName ? (
                      <div className="flex items-center gap-1.5">
                        <Input
                          value={editName.value}
                          onChange={e => setEditName(prev => prev ? { ...prev, value: e.target.value } : null)}
                          className="h-7 text-xs font-mono bg-industrial-surface border-industrial-border w-36"
                          autoFocus
                          onKeyDown={e => {
                            if (e.key === 'Enter') saveEditName(client.luidId);
                            if (e.key === 'Escape') cancelEditName();
                          }}
                        />
                        <button
                          onClick={() => saveEditName(client.luidId)}
                          className="p-1 rounded transition-colors"
                          style={{ color: 'oklch(0.85 0.28 142)' }}
                          title="Salvar"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={cancelEditName}
                          className="p-1 rounded transition-colors"
                          style={{ color: 'oklch(0.65 0.18 25)' }}
                          title="Cancelar"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 group">
                        <span style={{ color: client.clientName ? 'oklch(0.8 0.05 150)' : 'oklch(0.4 0.03 150)' }}>
                          {client.clientName || '—'}
                        </span>
                        <button
                          onClick={() => startEditName(client)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded"
                          style={{ color: 'oklch(0.55 0.08 150)' }}
                          title="Editar nome"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </TableCell>

                  {/* Created at */}
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {new Date(client.createdAt).toLocaleString('pt-BR')}
                  </TableCell>

                  {/* Tier */}
                  <TableCell>
                    <Select
                      value={tier}
                      onValueChange={(val) => handleTierChange(client.luidId, val as SupportTier)}
                    >
                      <SelectTrigger
                        className="h-7 w-36 text-xs font-mono font-bold border-0 focus:ring-0"
                        style={{
                          color: ts.color,
                          background: ts.bg,
                          border: `1px solid ${ts.border}`,
                        }}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent
                        style={{
                          background: 'oklch(0.11 0.008 150)',
                          border: '1px solid oklch(0.85 0.28 142 / 0.2)',
                        }}
                      >
                        {TIERS.map((t) => (
                          <SelectItem
                            key={t}
                            value={t}
                            className="font-mono text-xs"
                            style={{ color: tierStyles[t].color }}
                          >
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openPasswordModal(client.luidId)}
                        className="flex items-center gap-1 text-xs font-mono px-2 py-1 rounded transition-all"
                        style={{
                          color: 'oklch(0.7 0.15 220)',
                          border: '1px solid oklch(0.7 0.15 220 / 0.3)',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLButtonElement).style.background = 'oklch(0.7 0.15 220 / 0.1)';
                          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 8px oklch(0.7 0.15 220 / 0.3)';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                          (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                        }}
                        title="Editar senha"
                      >
                        <KeyRound className="w-3 h-3" />
                        SENHA
                      </button>
                      <button
                        onClick={() => handleDelete(client.luidId)}
                        className="flex items-center gap-1 text-xs font-mono px-2 py-1 rounded transition-all"
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
                        title="Remover cliente"
                      >
                        <Trash2 className="w-3 h-3" />
                        REMOVER
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Edit Password Modal */}
      {passwordModal && (
        <Dialog open={!!passwordModal} onOpenChange={(v) => { if (!v) closePasswordModal(); }}>
          <DialogContent
            className="max-w-sm"
            style={{
              background: 'oklch(0.11 0.008 150)',
              border: '1px solid oklch(0.7 0.15 220 / 0.35)',
              boxShadow: '0 0 40px oklch(0.7 0.15 220 / 0.1)',
            }}
          >
            <DialogHeader>
              <DialogTitle className="font-mono text-sm tracking-wider" style={{ color: 'oklch(0.7 0.15 220)' }}>
                EDITAR SENHA DO CLIENTE
              </DialogTitle>
              <DialogDescription className="font-mono text-xs" style={{ color: 'oklch(0.45 0.03 150)' }}>
                LUID ID: <span style={{ color: 'oklch(0.85 0.28 142)' }}>{passwordModal.luidId}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold tracking-wider" style={{ color: 'oklch(0.6 0.1 220)' }}>
                  NOVA SENHA
                </label>
                <Input
                  type="password"
                  value={passwordModal.newPassword}
                  onChange={e => setPasswordModal(prev => prev ? { ...prev, newPassword: e.target.value, error: '', success: '' } : null)}
                  placeholder="Nova senha"
                  className="font-mono bg-industrial-surface border-industrial-border text-foreground"
                  autoFocus
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold tracking-wider" style={{ color: 'oklch(0.6 0.1 220)' }}>
                  CONFIRMAR SENHA
                </label>
                <Input
                  type="password"
                  value={passwordModal.confirmPassword}
                  onChange={e => setPasswordModal(prev => prev ? { ...prev, confirmPassword: e.target.value, error: '', success: '' } : null)}
                  placeholder="Confirmar nova senha"
                  className="font-mono bg-industrial-surface border-industrial-border text-foreground"
                  onKeyDown={e => { if (e.key === 'Enter') handlePasswordSave(); }}
                />
              </div>

              {passwordModal.error && (
                <div className="flex items-center gap-2 text-xs font-mono p-2 rounded border"
                  style={{ color: 'oklch(0.75 0.18 25)', background: 'oklch(0.75 0.18 25 / 0.08)', borderColor: 'oklch(0.75 0.18 25 / 0.3)' }}>
                  ⚠ {passwordModal.error}
                </div>
              )}
              {passwordModal.success && (
                <div className="flex items-center gap-2 text-xs font-mono p-2 rounded border"
                  style={{ color: 'oklch(0.85 0.28 142)', background: 'oklch(0.85 0.28 142 / 0.08)', borderColor: 'oklch(0.85 0.28 142 / 0.3)' }}>
                  ✓ {passwordModal.success}
                </div>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="ghost"
                onClick={closePasswordModal}
                className="font-mono text-xs"
                style={{ color: 'oklch(0.5 0.04 150)' }}
              >
                FECHAR
              </Button>
              <Button
                onClick={handlePasswordSave}
                className="font-mono text-xs font-bold tracking-wider"
                style={{
                  background: 'oklch(0.7 0.15 220)',
                  color: 'oklch(0.08 0.005 150)',
                  boxShadow: '0 0 12px oklch(0.7 0.15 220 / 0.3)',
                }}
              >
                SALVAR SENHA
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
