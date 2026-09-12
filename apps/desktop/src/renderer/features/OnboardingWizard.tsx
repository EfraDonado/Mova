import { useMemo, useState } from 'react';
import { AppButton, Field, GlassPanel, Input, Select, SectionHeader } from '../components/ui';
import type { BusinessProfile, BusinessType, Currency } from '@mova/core';
import { demoProfile } from '@mova/core';

const types: Array<{ value: BusinessType; label: string; hint: string }> = [
  { value: 'restaurant', label: 'Restaurante', hint: 'Ventas rápidas y rotación diaria.' },
  { value: 'store', label: 'Tienda', hint: 'Inventario variado y caja viva.' },
  { value: 'fashion', label: 'Ropa', hint: 'Prendas, tallas y colecciones.' },
  { value: 'food', label: 'Comida', hint: 'Ingredientes, platos y combos.' },
  { value: 'accessories', label: 'Accesorios', hint: 'Ticket medio y rotación flexible.' },
  { value: 'family', label: 'Familiar', hint: 'Gestión simple para negocio local.' },
  { value: 'other', label: 'Otro', hint: 'Modelo personalizado.' }
];

const currencies: Currency[] = ['COP', 'USD', 'MXN', 'EUR', 'CLP', 'ARS', 'PEN'];

export function OnboardingWizard({ onFinish, onSeedDemo }: { onFinish: (profile: BusinessProfile) => Promise<void>; onSeedDemo: () => Promise<void> }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [type, setType] = useState<BusinessType>('store');
  const [currency, setCurrency] = useState<Currency>('COP');
  const [balance, setBalance] = useState('1200000');
  const [loading, setLoading] = useState(false);

  const progress = useMemo(() => Math.round(((step + 1) / 4) * 100), [step]);

  async function submit() {
    setLoading(true);
    try {
      await onFinish({
        id: demoProfile.id,
        name: name.trim() || 'Mi negocio',
        type,
        currency,
        initialBalance: Number(balance) || 0,
        createdAt: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="onboarding-shell">
      <GlassPanel className="onboarding-card">
        <SectionHeader eyebrow="Bienvenida" title="Configura tu negocio en menos de un minuto" />
        <div className="wizard-progress"><span style={{ width: `${progress}%` }} /></div>

        {step === 0 ? (
          <div className="wizard-screen">
            <p className="wizard-copy">Mova organiza tu caja, inventario y rentabilidad sin pedirte aprender un sistema administrativo pesado.</p>
            <div className="wizard-actions">
              <AppButton onClick={() => setStep(1)}>Empezar</AppButton>
              <AppButton variant="ghost" onClick={onSeedDemo}>Ver datos de demostración</AppButton>
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="wizard-screen">
            <Field label="Nombre del negocio">
              <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Mova Studio, La Esquina..." />
            </Field>
            <div className="wizard-actions"><AppButton variant="ghost" onClick={() => setStep(0)}>Volver</AppButton><AppButton onClick={() => setStep(2)}>Continuar</AppButton></div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="wizard-screen">
            <div className="wizard-grid">
              {types.map((option) => (
                <button key={option.value} className={`type-chip ${type === option.value ? 'is-active' : ''}`} onClick={() => setType(option.value)} type="button">
                  <strong>{option.label}</strong>
                  <span>{option.hint}</span>
                </button>
              ))}
            </div>
            <div className="wizard-actions"><AppButton variant="ghost" onClick={() => setStep(1)}>Volver</AppButton><AppButton onClick={() => setStep(3)}>Continuar</AppButton></div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="wizard-screen">
            <div className="wizard-grid wizard-grid--two">
              <Field label="Moneda"><Select value={currency} onChange={(event) => setCurrency(event.target.value as Currency)}>{currencies.map((item) => <option key={item}>{item}</option>)}</Select></Field>
              <Field label="Saldo inicial"><Input type="number" value={balance} onChange={(event) => setBalance(event.target.value)} /></Field>
            </div>
            <div className="wizard-actions">
              <AppButton variant="ghost" onClick={() => setStep(2)}>Volver</AppButton>
              <AppButton onClick={submit} disabled={loading}>{loading ? 'Guardando...' : 'Entrar a Mova'}</AppButton>
            </div>
          </div>
        ) : null}
      </GlassPanel>
    </div>
  );
}