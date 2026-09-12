import { useState } from 'react';
import { AppButton, Field, GlassPanel, Input, SectionHeader, Select, Textarea } from '../components/ui';
import { currencyValue, prettyDate } from '../lib/format';
import type { AppSnapshot, Expense, PaymentMethod } from '@mova/core';

const categories = ['Insumos', 'Transporte', 'Publicidad', 'Servicios', 'Arriendo', 'Salarios', 'Mantenimiento', 'Otros'];
const methods: PaymentMethod[] = ['cash', 'transfer', 'card', 'other'];

export function ExpensesPage({ snapshot, onSaveExpense }: { snapshot: AppSnapshot; onSaveExpense: (expense: Expense) => Promise<void> }) {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [amount, setAmount] = useState('0');
  const [method, setMethod] = useState<PaymentMethod>('cash');
  const [note, setNote] = useState('');

  async function submit() {
    await onSaveExpense({
      id: `exp-${Date.now()}`,
      description,
      category,
      amount: Number(amount),
      method,
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
        <SectionHeader eyebrow="Egresos" title="Registrar gasto" />
        <div className="form-grid">
          <Field label="Descripción"><Input value={description} onChange={(event) => setDescription(event.target.value)} /></Field>
          <Field label="Categoría"><Select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</Select></Field>
          <Field label="Valor"><Input type="number" value={amount} onChange={(event) => setAmount(event.target.value)} /></Field>
          <Field label="Método"><Select value={method} onChange={(event) => setMethod(event.target.value as PaymentMethod)}>{methods.map((item) => <option key={item}>{item}</option>)}</Select></Field>
          <Field label="Nota"><Textarea rows={3} value={note} onChange={(event) => setNote(event.target.value)} /></Field>
        </div>
        <AppButton onClick={submit} disabled={!description}>Guardar gasto</AppButton>
      </GlassPanel>

      <GlassPanel>
        <SectionHeader eyebrow="Análisis" title="Gastos recientes y presión operativa" />
        <div className="insight-grid">
          <div><span>Total de gastos</span><strong>{currencyValue(snapshot.dashboard.totalExpenses, snapshot.profile?.currency ?? 'COP')}</strong></div>
          <div><span>Gasto promedio</span><strong>{currencyValue(Math.round(snapshot.dashboard.totalExpenses / Math.max(snapshot.expenses.length, 1)), snapshot.profile?.currency ?? 'COP')}</strong></div>
          <div><span>Registros</span><strong>{snapshot.expenses.length}</strong></div>
        </div>
        <div className="table-list">
          {snapshot.expenses.map((expense) => (
            <article key={expense.id} className="table-row">
              <div>
                <strong>{expense.description}</strong>
                <span>{expense.category} · {prettyDate(expense.createdAt)}</span>
              </div>
              <div className="table-row__meta">
                <span>{expense.method}</span>
                <strong>{currencyValue(expense.amount, snapshot.profile?.currency ?? 'COP')}</strong>
              </div>
            </article>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}