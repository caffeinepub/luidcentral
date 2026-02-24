import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../contexts/AuthContext';
import { validateClientLogin } from '../lib/db';
import { Terminal, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function ClientLogin() {
  const [luidId, setLuidId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 400));

    const client = validateClientLogin(luidId.trim(), password);
    if (client) {
      login(
        { id: client.luidId, userType: 'client', displayName: client.luidId },
        stayLoggedIn
      );
      navigate({ to: '/portal' });
    } else {
      setError('LUID ID ou senha inválidos.');
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'oklch(0.08 0.005 150)' }}
    >
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

      <div className="w-full max-w-md relative">
        <div
          className="rounded-xl p-8"
          style={{
            background: 'oklch(0.11 0.008 150 / 0.92)',
            backdropFilter: 'blur(16px)',
            border: '1px solid oklch(0.85 0.28 142 / 0.3)',
            boxShadow: '0 0 40px oklch(0.85 0.28 142 / 0.08), 0 20px 60px oklch(0 0 0 / 0.5)',
          }}
        >
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-xl mx-auto mb-4 flex items-center justify-center"
              style={{
                background: 'oklch(0.85 0.28 142 / 0.1)',
                border: '1px solid oklch(0.85 0.28 142 / 0.4)',
                boxShadow: '0 0 15px oklch(0.85 0.28 142 / 0.2)',
              }}
            >
              <Terminal className="w-8 h-8" style={{ color: 'oklch(0.85 0.28 142)' }} />
            </div>
            <h1
              className="text-2xl font-bold tracking-widest font-mono"
              style={{ color: 'oklch(0.85 0.28 142)', textShadow: '0 0 15px oklch(0.85 0.28 142 / 0.4)' }}
            >
              LUIDCENTRAL
            </h1>
            <p className="text-xs font-mono mt-1" style={{ color: 'oklch(0.5 0.04 150)' }}>
              PORTAL DO CLIENTE
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono font-semibold mb-2" style={{ color: 'oklch(0.65 0.15 142)' }}>
                LUID ID
              </label>
              <input
                type="text"
                value={luidId}
                onChange={e => setLuidId(e.target.value)}
                placeholder="Seu LUID ID"
                className="w-full px-4 py-3 rounded-lg text-sm neon-input"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold mb-2" style={{ color: 'oklch(0.65 0.15 142)' }}>
                SENHA
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Senha"
                  className="w-full px-4 py-3 pr-12 rounded-lg text-sm neon-input"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                  style={{ color: 'oklch(0.85 0.28 142)' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="relative w-5 h-5 rounded cursor-pointer flex items-center justify-center flex-shrink-0"
                style={{
                  background: stayLoggedIn ? 'oklch(0.85 0.28 142)' : 'transparent',
                  border: `1px solid ${stayLoggedIn ? 'oklch(0.85 0.28 142)' : 'oklch(0.85 0.28 142 / 0.4)'}`,
                  boxShadow: stayLoggedIn ? '0 0 8px oklch(0.85 0.28 142 / 0.4)' : 'none',
                }}
                onClick={() => setStayLoggedIn(!stayLoggedIn)}
              >
                {stayLoggedIn && (
                  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="oklch(0.08 0.005 150)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <label
                className="text-xs font-mono cursor-pointer select-none"
                style={{ color: 'oklch(0.5 0.04 150)' }}
                onClick={() => setStayLoggedIn(!stayLoggedIn)}
              >
                Manter conectado
              </label>
            </div>

            {error && (
              <div
                className="text-xs font-mono p-3 rounded-lg"
                style={{
                  color: 'oklch(0.75 0.18 25)',
                  background: 'oklch(0.75 0.18 25 / 0.08)',
                  border: '1px solid oklch(0.75 0.18 25 / 0.3)',
                }}
              >
                ⚠ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-sm font-bold font-mono tracking-wider transition-all duration-200 disabled:opacity-50"
              style={{
                background: 'oklch(0.85 0.28 142)',
                color: 'oklch(0.08 0.005 150)',
                boxShadow: '0 0 20px oklch(0.85 0.28 142 / 0.4)',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  VERIFICANDO...
                </span>
              ) : (
                'ENTRAR'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs font-mono mt-4" style={{ color: 'oklch(0.3 0.02 150)' }}>
          © {new Date().getFullYear()} LuidCentral
        </p>
      </div>
    </div>
  );
}
