import type { ThemeMode } from './types';

export const brand = {
  name: 'Mova',
  tagline: 'Money in motion for small business.',
  accent: '#FF8A3D',
  accentAlt: '#6EF2A5',
  danger: '#FF5C7A',
  warning: '#FFCA5A',
  ink: '#0E1017',
  panel: '#151A24',
  panelSoft: '#1B2230',
  text: '#F5F7FB',
  textDim: '#A5AEC0',
  lightBackground: '#F3F5F8',
  lightPanel: '#FFFFFF',
  lightText: '#131722',
  lightTextDim: '#667085'
};

export const themeTokens: Record<ThemeMode, Record<string, string>> = {
  dark: {
    '--bg': '#0B0D12',
    '--bg-elevated': '#111520',
    '--bg-panel': '#151A24',
    '--bg-panel-soft': '#1B2230',
    '--text': '#F5F7FB',
    '--text-dim': '#9FA8B9',
    '--border': 'rgba(255,255,255,0.08)',
    '--accent': '#FF8A3D',
    '--accent-2': '#6EF2A5',
    '--accent-3': '#7DD3FC',
    '--danger': '#FF5C7A',
    '--warning': '#FFCA5A',
    '--shadow': '0 24px 80px rgba(0,0,0,0.35)'
  },
  light: {
    '--bg': '#F4F6FA',
    '--bg-elevated': '#FFFFFF',
    '--bg-panel': '#FFFFFF',
    '--bg-panel-soft': '#F7F9FC',
    '--text': '#121826',
    '--text-dim': '#667085',
    '--border': 'rgba(17,24,39,0.08)',
    '--accent': '#E56A25',
    '--accent-2': '#147B4D',
    '--accent-3': '#1D6FE3',
    '--danger': '#D64562',
    '--warning': '#C48B13',
    '--shadow': '0 22px 60px rgba(17,24,39,0.12)'
  }
};

export const appSections = [
  { id: 'dashboard', label: 'Vista', short: 'Hub' },
  { id: 'money', label: 'Dinero', short: 'Cash' },
  { id: 'products', label: 'Productos', short: 'Prod' },
  { id: 'sales', label: 'Ventas', short: 'Sell' },
  { id: 'expenses', label: 'Gastos', short: 'Spend' },
  { id: 'investments', label: 'Inversiones', short: 'Invest' },
  { id: 'reports', label: 'Reportes', short: 'Reports' },
  { id: 'settings', label: 'Ajustes', short: 'Prefs' }
];