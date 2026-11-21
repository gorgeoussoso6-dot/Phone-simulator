import { ReactNode } from 'react';

export const inputCls =
  'w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#3D7BF7] transition-colors';

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-white/60 text-xs mb-1.5">{label}</span>
      {children}
    </label>
  );
}

export function Btn({
  children,
  onClick,
  variant = 'ghost',
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'success' | 'danger' | 'ghost';
  className?: string;
}) {
  const styles = {
    primary: 'bg-[#3D7BF7] hover:bg-[#2f6ae0] text-white',
    success: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    danger: 'bg-red-600/80 hover:bg-red-600 text-white',
    ghost: 'bg-white/10 hover:bg-white/20 text-white/90',
  } as const;
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors active:scale-95 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`bg-white/5 border border-white/10 rounded-2xl p-4 ${className}`}>{children}</div>;
}

export interface DiffLine {
  path: string;
  before: string;
  after: string;
}

export function diffPaths(a: unknown, b: unknown, prefix = '', out: DiffLine[] = []): DiffLine[] {
  if (a === b) return out;
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null || Array.isArray(a) !== Array.isArray(b)) {
    const fmt = (v: unknown) => {
      const s = typeof v === 'string' ? v : JSON.stringify(v);
      return (s ?? '—').replace(/\s+/g, ' ').slice(0, 60) || '—';
    };
    out.push({ path: prefix || '/', before: fmt(a), after: fmt(b) });
    return out;
  }
  const keys = new Set([...Object.keys(a as object), ...Object.keys(b as object)]);
  for (const k of keys) {
    if (out.length > 300) return out;
    diffPaths((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k], prefix ? `${prefix}.${k}` : k, out);
  }
  return out;
}
