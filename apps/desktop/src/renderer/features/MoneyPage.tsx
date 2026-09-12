import { useMemo, useState } from 'react';
import { AppButton, Field, GlassPanel, Input, Pill, Select, SectionHeader, Textarea } from '../components/ui';
import { currencyValue, movementLabel, prettyDate } from '../lib/format';
import type { AppSnapshot, MovementKind, PaymentMethod, Transaction } from '@mova/core';

const kinds: Array<{ value: MovementKind; label: string }> = [
  { value: 'income', label: 'Ingreso' },
  { value: 'expense', label: 'Gasto' },
  { value: 'purchase', label: 'Compra' },
  { value: 'investment', label: 'Inversión' },
  { value: 'sale', label: 'Venta' }
];

const methods: PaymentMethod[] = ['cash', 'transfer', 'card', 'other'];

export function MoneyPage({ snapshot, onSaveTransaction }: { snapshot: AppSnapshot; onSaveTransaction: (transaction: Transaction) => Promise<void> }) {
  const [kind, setKind] = useState<MovementKind>('income');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Ventas');
  const [amount, setAmount] = useState('0');
  const [method, setMethod] = useState<PaymentMethod>('cash');
  const [note, setNote] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');

  const filtered = useMemo(() => {
    return snapshot.transactions.filter((transaction) => {
      const matchesType = typeFilter === 'all' || transaction.kind === typeFilter;
      const matchesMethod = methodFilter === 'all' || transaction.method === methodFilter;
      const matchesDate = !fromDate || transaction.createdAt.slice(0, 10) >= fromDate;
      return matchesType && matchesMethod && matchesDate;
    });
  }, [snapshot.transactions, typeFilter, methodFilter, fromDate]);

  async function submit() {
    await onSaveTransaction({
      id: `txn-${Date.now()}`,
      kind,
      title: title.trim(),
      amount: Number(amount),
      category,
      method,
      note,
      createdAt: new Date().toISOString()
    });
    setTitle('');
    setAmount('0');
    setNote('');
  }

  return (
    <div className="page-grid page-grid--two-col">
      <GlassPanel>
        <SectionHeader eyebrow="Registrar" title="Nuevo movimiento de caja" />
        <div className="form-grid">
          <Field label="Tipo"><Select value={kind} onChange={(event) => setKind(event.target.value as MovementKind)}>{kinds.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</Select></Field>
          <Field label="Valor"><Input type="number" value={amount} onChange={(event) => setAmount(event.target.value)} /></Field>
          <Field label="Categoría"><Input value={category} onChange={(event) => setCategory(event.target.value)} /></Field>
          <Field label="Método"><Select value={method} onChange={(event) => setMethod(event.target.value as PaymentMethod)}>{methods.map((option) => <option key={option}>{option}</option>)}</Select></Field>
          <Field label="Título" hint="Ej. venta, gasto, compra, inversión"><Input value={title} onChange={(event) => setTitle(event.target.value)} /></Field>
          <Field label="Nota"><Textarea rows={3} value={note} onChange={(event) => setNote(event.target.value)} /></Field>
        </div>
        <div className="action-row"><AppButton onClick={submit} disabled={!title}>Registrar movimiento</AppButton></div>
      </GlassPanel>

      <GlassPanel>
        <SectionHeader eyebrow="Historial" title="Movimientos recientes" />
        <div className="filters-row">
          <Select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}><option value="all">Todos los tipos</option>{kinds.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</Select>
          <Select value={methodFilter} onChange={(event) => setMethodFilter(event.target.value)}><option value="all">Todos los métodos</option>{methods.map((item) => <option key={item}>{item}</option>)}</Select>
          <Input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
        </div>
        <div className="table-list">
          {filtered.map((transaction) => (
            <article key={transaction.id} className="table-row">
              <div>
                <strong>{transaction.title}</strong>
                <span>{transaction.category} · {prettyDate(transaction.createdAt)}</span>
              </div>
              <div className="table-row__meta">
                <Pill tone={transaction.kind === 'income' || transaction.kind === 'sale' ? 'positive' : transaction.kind === 'investment' ? 'warning' : 'critical'}>{transaction.kind}</Pill>
                <span>{transaction.method}</span>
                <strong className={transaction.kind === 'income' || transaction.kind === 'sale' ? 'text-positive' : 'text-negative'}>{movementLabel(transaction)}</strong>
              </div>
            </article>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}