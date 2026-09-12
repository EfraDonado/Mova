import { useState } from 'react';
import { AppButton, Field, GlassPanel, Input, SectionHeader, Textarea } from '../components/ui';
import { currencyValue, prettyDate } from '../lib/format';
import type { AppSnapshot, Investment } from '@mova/core';

export function InvestmentsPage({ snapshot, onSaveInvestment }: { snapshot: AppSnapshot; onSaveInvestment: (investment: Investment) => Promise<void> }) {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Equipamiento');
  const [amount, setAmount] = useState('0');
  const [note, setNote] = useState('');

  async function submit() {
    await onSaveInvestment({
      id: `inv-${Date.now()}`,
      description,
      category,
      amount: Number(amount),
      note,
      createdAt: new Date().toISOString()
    });
    setDescription('');
    setAmount('0');
    setNote('');
  }

  return (
    <div className="page-grid page-grid--two-col">
      <GlassPanel>
        <SectionHeader eyebrow="Capital" title="Registrar inversión" />
        <div className="form-grid">
          <Field label="Descripción"><Input value={description} onChange={(event) => setDescription(event.target.value)} /></Field>
          <Field label="Categoría"><Input value={category} onChange={(event) => setCategory(event.target.value)} /></Field>
          <Field label="Monto"><Input type="number" value={amount} onChange={(event) => setAmount(event.target.value)} /></Field>
          <Field label="Nota"><Textarea rows={3} value={note} onChange={(event) => setNote(event.target.value)} /></Field>
        </div>
        <AppButton onClick={submit} disabled={!description}>Guardar inversión</AppButton>
      </GlassPanel>

      <GlassPanel>
        <SectionHeader eyebrow="Lectura" title="Dinero destinado a crecer" />
        <div className="insight-grid">
          <div><span>Total invertido</span><strong>{currencyValue(snapshot.report.investments, snapshot.profile?.currency ?? 'COP')}</strong></div>
          <div><span>Operaciones</span><strong>{snapshot.investments.length}</strong></div>
          <div><span>Potencial ROI</span><strong>Próxima etapa</strong></div>
        </div>
        <div className="table-list">
          {snapshot.investments.map((investment) => (
            <article key={investment.id} className="table-row">
              <div>
                <strong>{investment.description}</strong>
                <span>{investment.category} · {prettyDate(investment.createdAt)}</span>
              </div>
              <div className="table-row__meta">
                <strong>{currencyValue(investment.amount, snapshot.profile?.currency ?? 'COP')}</strong>
              </div>
            </article>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}