import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart, CartesianGrid, LineChart, Line } from 'recharts';

export function CashFlowChart({ data }: { data: Array<{ label: string; income: number; expense: number }> }) {
  return (
    <div className="chart-card">
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="cashFlowIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent-2)" stopOpacity={0.42} />
              <stop offset="95%" stopColor="var(--accent-2)" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="cashFlowExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.34} />
              <stop offset="95%" stopColor="var(--danger)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 11 }} />
          <YAxis tickLine={false} axisLine={false} width={56} tick={{ fill: 'var(--text-dim)', fontSize: 11 }} tickFormatter={(value) => new Intl.NumberFormat('es-CO', { notation: 'compact', maximumFractionDigits: 0 }).format(Number(value))} />
          <Tooltip cursor={{ stroke: 'rgba(255,255,255,0.08)' }} contentStyle={{ borderRadius: 16, border: '1px solid var(--border)', background: 'rgba(13,16,22,0.96)', color: 'var(--text)' }} />
          <Area type="monotone" dataKey="income" stroke="var(--accent-2)" fill="url(#cashFlowIncome)" strokeWidth={2} />
          <Area type="monotone" dataKey="expense" stroke="var(--danger)" fill="url(#cashFlowExpense)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ProfitBarChart({ data }: { data: Array<{ label: string; profit: number }> }) {
  return (
    <div className="chart-card chart-card--compact">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 11 }} />
          <YAxis tickLine={false} axisLine={false} width={56} tick={{ fill: 'var(--text-dim)', fontSize: 11 }} tickFormatter={(value) => new Intl.NumberFormat('es-CO', { notation: 'compact', maximumFractionDigits: 0 }).format(Number(value))} />
          <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid var(--border)', background: 'rgba(13,16,22,0.96)', color: 'var(--text)' }} />
          <Bar dataKey="profit" fill="var(--accent)" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LinePulseChart({ data }: { data: Array<{ label: string; income: number; expense: number }> }) {
  return (
    <div className="chart-card chart-card--compact">
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 11 }} />
          <YAxis tickLine={false} axisLine={false} width={56} tick={{ fill: 'var(--text-dim)', fontSize: 11 }} tickFormatter={(value) => new Intl.NumberFormat('es-CO', { notation: 'compact', maximumFractionDigits: 0 }).format(Number(value))} />
          <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid var(--border)', background: 'rgba(13,16,22,0.96)', color: 'var(--text)' }} />
          <Line type="monotone" dataKey="income" stroke="var(--accent-2)" strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="expense" stroke="var(--danger)" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}