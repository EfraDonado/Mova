import { BarChart3, BellRing, CircleDollarSign, Coins, Compass, Package, Sparkles, TrendingUp, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { CashFlowChart, ProfitBarChart } from '../components/charts';
import { GlassPanel, MetricCard, Pill, SectionHeader } from '../components/ui';
import { currencyValue } from '../lib/format';
import type { AppSnapshot } from '@mova/core';

export function DashboardPage({ snapshot }: { snapshot: AppSnapshot }) {
  const recentTransactions = [...snapshot.transactions].slice(0, 5);
  const profitable = [...snapshot.products]
    .map((product) => ({
      label: product.name.split(' ')[0],
      profit: Math.max(0, (product.salePrice - product.purchasePrice) * Math.max(product.stock, 1))
    }))
    .sort((left, right) => right.profit - left.profit)
    .slice(0, 6);

  return (
    <motion.div className="page-grid" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="hero-strip">
        <GlassPanel className="hero-panel">
          <div className="hero-copy">
            <div className="eyebrow">Control central</div>
            <h1>Tu negocio, en movimiento y sin ruido.</h1>
            <p>Una vista que responde rápido a caja, utilidad, inventario y alertas. Mova prioriza la lectura comercial antes que los números sueltos.</p>
          </div>
          <div className="hero-balance">
            <span>Dinero disponible</span>
            <strong>{currencyValue(snapshot.dashboard.availableCash, snapshot.profile?.currency ?? 'COP')}</strong>
            <small>Actualizado al instante con ventas, gastos, compras e inversiones.</small>
          </div>
        </GlassPanel>
      </div>

      <div className="metrics-row">
        <MetricCard title="Utilidad neta" value={currencyValue(snapshot.dashboard.netProfit, snapshot.profile?.currency ?? 'COP')} detail="Después de costos, gastos e inversiones" delta={<Pill tone={snapshot.dashboard.netProfit >= 0 ? 'positive' : 'critical'}>{snapshot.dashboard.netProfit >= 0 ? 'Arriba' : 'Presión'}</Pill>} accent="var(--accent)" />
        <MetricCard title="Ventas" value={currencyValue(snapshot.dashboard.totalSales, snapshot.profile?.currency ?? 'COP')} detail="Acumulado de ventas registradas" delta={<Pill tone="neutral">{snapshot.sales.length} operaciones</Pill>} accent="var(--accent-2)" />
        <MetricCard title="Gastos" value={currencyValue(snapshot.dashboard.totalExpenses, snapshot.profile?.currency ?? 'COP')} detail="Salidas operativas y consumo" delta={<Pill tone={snapshot.dashboard.totalExpenses > snapshot.dashboard.totalIncome ? 'warning' : 'neutral'}>Revisar mix</Pill>} accent="var(--danger)" />
        <MetricCard title="Inventario" value={currencyValue(snapshot.dashboard.inventoryValue, snapshot.profile?.currency ?? 'COP')} detail="Valor total de stock disponible" delta={<Pill tone={snapshot.dashboard.lowStockCount > 0 ? 'warning' : 'positive'}>{snapshot.dashboard.lowStockCount} bajo stock</Pill>} accent="var(--accent-3)" />
      </div>

      <div className="content-grid content-grid--dashboard">
        <GlassPanel className="panel-span-2">
          <SectionHeader eyebrow="Flujo" title="Dinero que entra y sale" action={<Pill tone="neutral">Últimos movimientos</Pill>} />
          <CashFlowChart data={snapshot.dashboard.cashFlowTrend} />
        </GlassPanel>

        <GlassPanel>
          <SectionHeader eyebrow="Alertas" title="Revisa esto hoy" />
          <div className="alert-stack">
            {snapshot.dashboard.alerts.map((alert) => (
              <article key={alert.title} className={`alert-box alert-box--${alert.type}`}>
                <strong>{alert.title}</strong>
                <p>{alert.detail}</p>
              </article>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel>
          <SectionHeader eyebrow="Rotación" title="Productos más rentables" />
          <ProfitBarChart data={profitable} />
          <div className="mini-note"><TrendingUp size={14} /> {snapshot.dashboard.topProductName} lidera la utilidad estimada.</div>
        </GlassPanel>

        <GlassPanel>
          <SectionHeader eyebrow="Actividad" title="Últimos movimientos" />
          <div className="transaction-feed">
            {recentTransactions.map((item) => (
              <article key={item.id} className="transaction-row">
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.category}</span>
                </div>
                <div className={item.kind === 'sale' || item.kind === 'income' ? 'text-positive' : 'text-negative'}>{item.kind === 'sale' || item.kind === 'income' ? '+' : '-'}{currencyValue(item.amount, snapshot.profile?.currency ?? 'COP')}</div>
              </article>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel>
          <SectionHeader eyebrow="Mercancía" title="Inventario y presión" />
          <div className="status-cards">
            <div><Package size={18} /><strong>{snapshot.products.length}</strong><span>Productos activos</span></div>
            <div><BarChart3 size={18} /><strong>{snapshot.dashboard.lowStockCount}</strong><span>Stock bajo</span></div>
            <div><Coins size={18} /><strong>{snapshot.dashboard.outOfStockCount}</strong><span>Agotados</span></div>
            <div><BellRing size={18} /><strong>{snapshot.dashboard.alerts.length}</strong><span>Alertas</span></div>
          </div>
        </GlassPanel>

        <GlassPanel>
          <SectionHeader eyebrow="Resumen" title="Lectura rápida" />
          <div className="summary-grid">
            <div><span>Ingresos</span><strong>{currencyValue(snapshot.dashboard.totalIncome, snapshot.profile?.currency ?? 'COP')}</strong></div>
            <div><span>Gastos</span><strong>{currencyValue(snapshot.dashboard.totalExpenses, snapshot.profile?.currency ?? 'COP')}</strong></div>
            <div><span>Utilidad bruta</span><strong>{currencyValue(snapshot.dashboard.grossProfit, snapshot.profile?.currency ?? 'COP')}</strong></div>
            <div><span>Utilidad neta</span><strong>{currencyValue(snapshot.dashboard.netProfit, snapshot.profile?.currency ?? 'COP')}</strong></div>
          </div>
        </GlassPanel>

        <GlassPanel className="panel-span-2">
          <SectionHeader eyebrow="Experiencia" title="Mejora UX" action={<Pill tone="neutral">Mova Pulse</Pill>} />
          <div className="ux-pulse-grid">
            <article className="ux-pulse-card ux-pulse-card--accent">
              <div className="ux-pulse-card__top"><strong><Wand2 size={16} /> Accesos más rápidos</strong><Pill tone="positive">Atajo</Pill></div>
              <p>Conviene llevar venta, gasto e inventario a acciones visibles desde el dashboard para reducir fricción operativa.</p>
            </article>
            <article className="ux-pulse-card">
              <div className="ux-pulse-card__top"><strong><Sparkles size={16} /> Estado del negocio</strong><Pill tone={snapshot.dashboard.netProfit >= 0 ? 'positive' : 'warning'}>{snapshot.dashboard.netProfit >= 0 ? 'Sano' : 'Tenso'}</Pill></div>
              <p>La combinación de caja, utilidad y alertas ya da una lectura clara, pero podemos volverla más narrativa con señales visuales de prioridad.</p>
            </article>
            <article className="ux-pulse-card">
              <div className="ux-pulse-card__top"><strong><Compass size={16} /> Siguiente acción</strong><Pill tone="neutral">Sugerida</Pill></div>
              <p>Si hay stock bajo o utilidad caída, Mova puede empujar una sola recomendación principal en vez de mostrar todos los datos al mismo nivel.</p>
            </article>
            <article className="ux-pulse-card">
              <div className="ux-pulse-card__top"><strong><CircleDollarSign size={16} /> Caja visible</strong><Pill tone="neutral">Siempre arriba</Pill></div>
              <p>El saldo disponible debe seguir presente, pero con jerarquía clara para no competir con la lectura de utilidad y flujo.</p>
            </article>
          </div>
        </GlassPanel>
      </div>
    </motion.div>
  );
}