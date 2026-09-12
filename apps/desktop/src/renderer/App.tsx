import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Layers3, Lightbulb, Menu, Receipt, Settings2, ShoppingCart, Sparkles, Wallet } from 'lucide-react';
import { appSections, brand, demoProfile, themeTokens, currencyValue } from '@mova/core';
import type { AppSnapshot, BusinessProfile, Expense, Investment, Product, ThemeMode, Transaction } from '@mova/core';
import { useMovaSnapshot } from './hooks/useMovaSnapshot';
import { movaApi } from './lib/api';
import { DashboardPage } from './features/DashboardPage';
import { MoneyPage } from './features/MoneyPage';
import { ProductsPage } from './features/ProductsPage';
import { SalesPage } from './features/SalesPage';
import { ExpensesPage } from './features/ExpensesPage';
import { InvestmentsPage } from './features/InvestmentsPage';
import { ReportsPage } from './features/ReportsPage';
import { SettingsPage } from './features/SettingsPage';
import { OnboardingWizard } from './features/OnboardingWizard';

type SectionId = 'dashboard' | 'money' | 'products' | 'sales' | 'expenses' | 'investments' | 'reports' | 'settings';

function applyTheme(theme: ThemeMode) {
  const tokens = themeTokens[theme];
  for (const [key, value] of Object.entries(tokens)) {
    document.documentElement.style.setProperty(key, value);
  }
  document.documentElement.dataset.theme = theme;
}

function navIcon(id: SectionId) {
  switch (id) {
    case 'dashboard': return <Layers3 size={18} />;
    case 'money': return <Wallet size={18} />;
    case 'products': return <Sparkles size={18} />;
    case 'sales': return <ShoppingCart size={18} />;
    case 'expenses': return <Receipt size={18} />;
    case 'investments': return <Lightbulb size={18} />;
    case 'reports': return <BarChart3 size={18} />;
    case 'settings': return <Settings2 size={18} />;
  }
}

export default function App() {
  const { snapshot, loading, error, refresh, setSnapshot } = useMovaSnapshot();
  const [section, setSection] = useState<SectionId>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (snapshot) applyTheme(snapshot.theme);
  }, [snapshot?.theme]);

  async function withRefresh<T>(action: () => Promise<T>) {
    const result = await action();
    await refresh();
    return result;
  }

  async function updateSnapshot(next: AppSnapshot) {
    setSnapshot(next);
    await refresh();
  }

  async function startOnboarding(profile: BusinessProfile) {
    const next = await movaApi.updateProfile(profile);
    setSnapshot(next);
  }

  const sections = useMemo(() => appSections as Array<{ id: SectionId; label: string; short: string }>, []);
  const current = snapshot;

  if (loading || !current) {
    return <div className="boot-screen">{error ? <div className="boot-error">{error}</div> : <div className="boot-card"><div className="boot-orb" />Cargando Mova...</div>}</div>;
  }

  if (!current.profile) {
    return <OnboardingWizard onFinish={startOnboarding} onSeedDemo={async () => { const next = await movaApi.seedDemo(); setSnapshot(next); }} />;
  }

  const currentSection = sections.find((item) => item.id === section) ?? sections[0];

  return (
    <div className="app-shell">
      <aside className={`rail ${mobileMenuOpen ? 'rail--open' : ''}`}>
        <div className="brand-mark">
          <div className="brand-mark__orb" />
          <div>
            <strong>{brand.name}</strong>
            <span>{brand.tagline}</span>
          </div>
        </div>

        <nav className="rail-nav">
          {sections.map((item) => (
            <button key={item.id} className={`rail-nav__item ${section === item.id ? 'is-active' : ''}`} onClick={() => setSection(item.id)} type="button">
              {navIcon(item.id)}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="rail-summary">
          <span>Saldo</span>
          <strong>{currencyValue(current.dashboard.availableCash, current.profile.currency)}</strong>
          <p>{current.dashboard.netProfit >= 0 ? 'Negocio en expansión' : 'Presión sobre la utilidad'}</p>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <button className="menu-button" onClick={() => setMobileMenuOpen((value) => !value)} type="button"><Menu size={18} /></button>
          <div>
            <div className="topbar-eyebrow">{currentSection.label}</div>
            <h1>{current.profile.name}</h1>
          </div>
          <div className="topbar-actions">
            <button className="chip-action" onClick={() => movaApi.setTheme(current.theme === 'dark' ? 'light' : 'dark').then((theme) => setSnapshot({ ...current, theme }))} type="button">Modo {current.theme === 'dark' ? 'claro' : 'oscuro'}</button>
            <button className="chip-action chip-action--accent" onClick={refresh} type="button">Actualizar</button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.section key={section} className="section-host" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.24 }}>
            {section === 'dashboard' ? <DashboardPage snapshot={current} /> : null}
            {section === 'money' ? <MoneyPage snapshot={current} onSaveTransaction={(transaction: Transaction) => withRefresh(() => movaApi.saveTransaction(transaction))} /> : null}
            {section === 'products' ? <ProductsPage snapshot={current} onSaveProduct={(product: Product) => withRefresh(() => movaApi.saveProduct(product))} onDeleteProduct={(id: string) => withRefresh(() => movaApi.deleteProduct(id))} /> : null}
            {section === 'sales' ? <SalesPage snapshot={current} onSaveSale={(payload) => withRefresh(() => movaApi.saveSale(payload)).then(() => undefined)} /> : null}
            {section === 'expenses' ? <ExpensesPage snapshot={current} onSaveExpense={(expense: Expense) => withRefresh(() => movaApi.saveExpense(expense))} /> : null}
            {section === 'investments' ? <InvestmentsPage snapshot={current} onSaveInvestment={(investment: Investment) => withRefresh(() => movaApi.saveInvestment(investment))} /> : null}
            {section === 'reports' ? <ReportsPage snapshot={current} /> : null}
            {section === 'settings' ? <SettingsPage snapshot={current} onUpdateProfile={(profile) => withRefresh(() => movaApi.updateProfile(profile))} onSetTheme={(theme) => withRefresh(() => movaApi.setTheme(theme))} onSeedDemo={() => withRefresh(() => movaApi.seedDemo())} onClearDemo={() => withRefresh(() => movaApi.clearDemo())} /> : null}
          </motion.section>
        </AnimatePresence>
      </main>
    </div>
  );
}