import { GlassPanel, SectionHeader } from '../components/ui';
import { currencyValue, prettyDate } from '../lib/format';
import { LinePulseChart } from '../components/charts';
import type { AppSnapshot } from '@mova/core';

export function ReportsPage({ snapshot }: { snapshot: AppSnapshot }) {
  return (
    <div className="page-grid page-grid--two-col">
      <GlassPanel>
        <SectionHeader eyebrow="Reporte mensual" title="Lectura financiera de alto nivel" />
        <div className="insight-grid">
          <div><span>Ingresos</span><strong>{currencyValue(snapshot.report.income, snapshot.profile?.currency ?? 'COP')}</strong></div>
          <div><span>Costos</span><strong>{currencyValue(snapshot.report.cost, snapshot.profile?.currency ?? 'COP')}</strong></div>
          <div><span>Gastos</span><strong>{currencyValue(snapshot.report.expenses, snapshot.profile?.currency ?? 'COP')}</strong></div>
          <div><span>Utilidad neta</span><strong>{currencyValue(snapshot.report.netProfit, snapshot.profile?.currency ?? 'COP')}</strong></div>
        </div>
        <LinePulseChart data={snapshot.dashboard.cashFlowTrend} />
      </GlassPanel>

      <GlassPanel>
        <SectionHeader eyebrow="Detalle" title="Tendencia por día" />
        <div className="table-list">
          {snapshot.report.byDay.map((day) => (
            <article key={day.label} className="table-row">
              <div>
                <strong>{day.label}</strong>
                <span>Comparativa diaria</span>
              </div>
              <div className="table-row__meta">
                <span>Ingresos {currencyValue(day.income, snapshot.profile?.currency ?? 'COP')}</span>
                <span>Egresos {currencyValue(day.expense, snapshot.profile?.currency ?? 'COP')}</span>
                <strong>{currencyValue(day.profit, snapshot.profile?.currency ?? 'COP')}</strong>
              </div>
            </article>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}