import React, { useState } from 'react';
import { UserPlus, CheckCircle, AlertCircle } from 'lucide-react';
import { createClient } from '../lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddClientFormProps {
  onClientAdded: () => void;
}

export function AddClientForm({ onClientAdded }: AddClientFormProps) {
  const [luidId, setLuidId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!luidId.trim() || !password.trim()) {
      setError('Preencha todos os campos.');
      return;
    }

    if (luidId.trim().length < 3) {
      setError('LUID ID deve ter pelo menos 3 caracteres.');
      return;
    }

    if (password.trim().length < 4) {
      setError('Senha deve ter pelo menos 4 caracteres.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = createClient(luidId.trim(), password.trim());
      setLoading(false);
      if (!result) {
        setError(`LUID ID "${luidId.trim()}" já existe no sistema.`);
      } else {
        setSuccess(`Cliente "${luidId.trim()}" adicionado com sucesso.`);
        setLuidId('');
        setPassword('');
        onClientAdded();
      }
    }, 200);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="luid-id" className="font-mono text-xs text-muted-foreground tracking-wider uppercase">
          LUID ID
        </Label>
        <Input
          id="luid-id"
          value={luidId}
          onChange={(e) => setLuidId(e.target.value)}
          placeholder="ex: LUID-001"
          className="font-mono bg-industrial-surface border-industrial-border text-foreground placeholder:text-muted-foreground/50 focus:border-emerald-DEFAULT focus:ring-emerald-DEFAULT/20"
          autoComplete="off"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="client-password" className="font-mono text-xs text-muted-foreground tracking-wider uppercase">
          Senha
        </Label>
        <Input
          id="client-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha do cliente"
          className="font-mono bg-industrial-surface border-industrial-border text-foreground placeholder:text-muted-foreground/50 focus:border-emerald-DEFAULT focus:ring-emerald-DEFAULT/20"
          autoComplete="new-password"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-destructive text-xs font-mono p-2 rounded border border-destructive/30 bg-destructive/10">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 text-emerald-DEFAULT text-xs font-mono p-2 rounded border border-emerald-DEFAULT/30 bg-emerald-muted">
          <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {success}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full font-mono bg-emerald-DEFAULT text-industrial-black hover:bg-emerald-dim font-semibold tracking-wider gap-2"
      >
        {loading ? (
          <span className="animate-pulse">PROCESSANDO...</span>
        ) : (
          <>
            <UserPlus className="w-4 h-4" />
            ADICIONAR CLIENTE
          </>
        )}
      </Button>
    </form>
  );
}
