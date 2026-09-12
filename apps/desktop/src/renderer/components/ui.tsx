import clsx from 'clsx';
import type { PropsWithChildren, ReactNode } from 'react';

export function GlassPanel({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <section className={clsx('glass-panel', className)}>{children}</section>;
}

export function AppButton({ children, onClick, variant = 'primary', type = 'button', disabled }: PropsWithChildren<{ onClick?: () => void; variant?: 'primary' | 'ghost' | 'soft'; type?: 'button' | 'submit'; disabled?: boolean }>) {
  return (
    <button className={clsx('btn', `btn-${variant}`)} type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export function Pill({ children, tone = 'neutral' }: PropsWithChildren<{ tone?: 'neutral' | 'positive' | 'warning' | 'critical' }>) {
  return <span className={clsx('pill', `pill-${tone}`)}>{children}</span>;
}

export function Field({ label, children, hint }: PropsWithChildren<{ label: string; hint?: string }>) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint ? <span className="field-hint">{hint}</span> : null}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={clsx('input', props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={clsx('input', props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={clsx('input', 'textarea', props.className)} />;
}

export function MetricCard({ title, value, detail, delta, accent = 'var(--accent)' }: { title: string; value: ReactNode; detail: string; delta?: ReactNode; accent?: string }) {
  return (
    <article className="metric-card" style={{ ['--metric-accent' as string]: accent }}>
      <div className="metric-card__glow" />
      <div className="metric-card__title">{title}</div>
      <div className="metric-card__value">{value}</div>
      <div className="metric-card__detail">{detail}</div>
      {delta ? <div className="metric-card__delta">{delta}</div> : null}
    </article>
  );
}

export function SectionHeader({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <div className="section-header">
      <div>
        {eyebrow ? <div className="section-eyebrow">{eyebrow}</div> : null}
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  );
}