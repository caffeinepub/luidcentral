import React, { useState } from 'react';
import { Trash2, User } from 'lucide-react';
import { getClients, deleteClient, updateClientTier } from '../lib/db';
import type { Client, SupportTier } from '../types/db';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

export function ClientsTable({ refreshKey }: ClientsTableProps) {
  const [clients, setClients] = useState<Client[]>(() => getClients());

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

  if (clients.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground font-mono text-sm">
        <User className="w-8 h-8 mx-auto mb-3 opacity-30" />
        <p>Nenhum cliente cadastrado.</p>
      </div>
    );
  }

  return (
    <div className="rounded border border-industrial-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-industrial-border hover:bg-transparent">
            <TableHead className="font-mono text-xs text-emerald-DEFAULT tracking-wider uppercase">LUID ID</TableHead>
            <TableHead className="font-mono text-xs text-emerald-DEFAULT tracking-wider uppercase">Cadastrado em</TableHead>
            <TableHead className="font-mono text-xs text-emerald-DEFAULT tracking-wider uppercase">Nível de Suporte</TableHead>
            <TableHead className="font-mono text-xs text-emerald-DEFAULT tracking-wider uppercase text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => {
            const tier: SupportTier = client.tier ?? 'Basic';
            const ts = tierStyles[tier];
            return (
              <TableRow key={client.luidId} className="border-industrial-border hover:bg-industrial-surface/50">
                <TableCell className="font-mono text-sm font-medium text-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-DEFAULT" />
                    {client.luidId}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {new Date(client.createdAt).toLocaleString('pt-BR')}
                </TableCell>
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
                          className="font-mono text-xs cursor-pointer"
                          style={{ color: tierStyles[t].color }}
                        >
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(client.luidId)}
                    className="w-7 h-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
