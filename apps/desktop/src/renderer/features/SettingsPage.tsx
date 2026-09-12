import { AppButton, Field, GlassPanel, Input, SectionHeader, Select } from '../components/ui';
import type { AppSnapshot, BusinessProfile, ThemeMode } from '@mova/core';
import { useState } from 'react';

export function SettingsPage({ snapshot, onUpdateProfile, onSetTheme, onSeedDemo, onClearDemo }: { snapshot: AppSnapshot; onUpdateProfile: (profile: BusinessProfile) => Promise<void>; onSetTheme: (theme: ThemeMode) => Promise<void>; onSeedDemo: () => Promise<void>; onClearDemo: () => Promise<void> }) {
  const profile = snapshot.profile ?? { id: 'business-mova', name: '', type: 'store', currency: 'COP', initialBalance: 0, createdAt: new Date().toISOString() };
  const [name, setName] = useState(profile.name);
  const [currency, setCurrency] = useState(profile.currency);
  const [initialBalance, setInitialBalance] = useState(String(profile.initialBalance));

  async function save() {
    await onUpdateProfile({ ...profile, name, currency, initialBalance: Number(initialBalance) });
  }

  return (
    <div className="page-grid page-grid--two-col">
      <GlassPanel>
        <SectionHeader eyebrow="Preferencias" title="Identidad y comportamiento" />
        <div className="form-grid">
          <Field label="Nombre del negocio"><Input value={name} onChange={(event) => setName(event.target.value)} /></Field>
          <Field label="Moneda"><Select value={currency} onChange={(event) => setCurrency(event.target.value as any)}>{['COP', 'USD', 'MXN', 'EUR', 'CLP', 'ARS', 'PEN'].map((item) => <option key={item}>{item}</option>)}</Select></Field>
          <Field label="Saldo inicial"><Input type="number" value={initialBalance} onChange={(event) => setInitialBalance(event.target.value)} /></Field>
        </div>
        <div className="action-row"><AppButton onClick={save}>Guardar ajustes</AppButton><AppButton variant="ghost" onClick={() => onSetTheme(snapshot.theme === 'dark' ? 'light' : 'dark')}>Cambiar a {snapshot.theme === 'dark' ? 'claro' : 'oscuro'}</AppButton></div>
      </GlassPanel>

      <GlassPanel>
        <SectionHeader eyebrow="Datos" title="Demostración y limpieza" />
        <div className="action-stack">
          <AppButton onClick={onSeedDemo}>Restaurar datos de demostración</AppButton>
          <AppButton variant="ghost" onClick={onClearDemo}>Eliminar datos de demostración</AppButton>
        </div>
        <p className="help-copy">Los datos de demostración ayudan a explorar dashboard, reportes y rentabilidad sin registrar ventas manualmente desde cero.</p>
      </GlassPanel>
    </div>
  );
}