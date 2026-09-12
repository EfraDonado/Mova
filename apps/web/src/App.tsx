import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Blocks, Download, Github, Layers3, LineChart, Sparkles, Wallet } from 'lucide-react';
import { appSections, brand } from '@mova/core';

const features = [
  'Caja central con saldo disponible y flujo de dinero en tiempo real.',
  'Ventas rápidas con inventario y utilidad recalculada automáticamente.',
  'Productos, gastos, inversiones y reportes en una sola superficie.',
  'Onboarding guiado, datos demo opcionales y modo oscuro/claro propio.',
  'Persistencia local con SQLite para uso sin internet.'
];

const roadmap = [
  'Exportación a PDF y Excel',
  'Filtros avanzados de reportes',
  'Asistente inteligente sobre datos reales',
  'Sincronización opcional multi-dispositivo',
  'Plantillas por tipo de negocio'
];

const stats = [
  { label: 'Caja', value: 'Saldo vivo y movimientos' },
  { label: 'Inventario', value: 'Stock bajo y agotados' },
  { label: 'Utilidad', value: 'Bruta y neta por producto' },
  { label: 'Reportes', value: 'Comparativas por período' }
];

export default function App() {
  return (
    <div className="landing-shell">
      <div className="background-orb background-orb--one" />
      <div className="background-orb background-orb--two" />

      <header className="landing-topbar">
        <div className="brand-lockup">
          <div className="brand-orb" />
          <div>
            <strong>{brand.name}</strong>
            <span>Gestión financiera para negocios pequeños</span>
          </div>
        </div>
        <nav className="topbar-links">
          <a href="#features">Funciones</a>
          <a href="#workflow">Cómo funciona</a>
          <a href="#roadmap">Roadmap</a>
          <a href="#install">Instalación</a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <motion.div className="hero-copy" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="eyebrow">Producto comercial real</div>
            <h1>Controla caja, ventas, inventario y utilidad desde un solo lugar.</h1>
            <p>{brand.name} está pensado para dueños de pequeños negocios que necesitan una lectura inmediata de su operación sin caer en el dashboard administrativo genérico.</p>
            <div className="hero-actions">
              <a className="button button--accent" href="#install"><Download size={16} /> Descargar</a>
              <a className="button button--soft" href="https://github.com" target="_blank" rel="noreferrer"><Github size={16} /> Ver GitHub</a>
            </div>
          </motion.div>

          <motion.div className="hero-mockup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
            <div className="mockup-window">
              <div className="mockup-header">
                <span /> <span /> <span />
              </div>
              <div className="mockup-body">
                <div className="mockup-kpi">
                  <strong>$2.000.000</strong>
                  <span>Utilidad neta del mes</span>
                </div>
                <div className="mockup-grid">
                  <div className="mockup-card"><Wallet size={18} /><span>Dinero disponible</span></div>
                  <div className="mockup-card"><BarChart3 size={18} /><span>Flujo de caja</span></div>
                  <div className="mockup-card"><Layers3 size={18} /><span>Inventario</span></div>
                  <div className="mockup-card"><Sparkles size={18} /><span>Productos top</span></div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="stats-strip">
          {stats.map((item) => (
            <article key={item.label} className="stats-card">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </section>

        <section className="feature-slab" id="features">
          <div className="section-heading">
            <div className="eyebrow">Lo importante</div>
            <h2>Una app de escritorio con lectura financiera inmediata.</h2>
          </div>
          <div className="feature-grid">
            {features.map((feature) => (
              <article key={feature} className="feature-card">
                <div className="feature-bar" />
                <p>{feature}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="workflow-section" id="workflow">
          <div className="workflow-copy">
            <div className="eyebrow">Cómo funciona</div>
            <h2>La operación fluye: registras una venta y Mova ajusta caja, stock, movimiento y utilidad.</h2>
            <p>Las piezas principales quedan integradas: onboarding, productos, ventas, gastos, inversiones y reportes. El futuro asistente inteligente podrá consultar los datos reales sin rehacer la arquitectura.</p>
          </div>
          <div className="workflow-steps">
            {appSections.map((section, index) => (
              <article key={section.id} className="workflow-step">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{section.label}</strong>
                <p>Bloque funcional preparado para lectura comercial y operación diaria.</p>
              </article>
            ))}
          </div>
        </section>

        <section className="tech-section">
          <div>
            <div className="eyebrow">Tecnología</div>
            <h2>Electron, React, TypeScript y SQLite local.</h2>
          </div>
          <div className="tech-pills">
            {['Electron', 'React', 'TypeScript', 'Vite', 'SQLite', 'Electron Builder'].map((tech) => (
              <span key={tech} className="tech-pill">{tech}</span>
            ))}
          </div>
        </section>

        <section className="roadmap-section" id="roadmap">
          <div className="section-heading">
            <div className="eyebrow">Roadmap</div>
            <h2>La primera versión resuelve la operación; la siguiente amplía análisis y exportación.</h2>
          </div>
          <div className="roadmap-list">
            {roadmap.map((item) => (
              <article key={item} className="roadmap-item">
                <ArrowRight size={16} />
                <span>{item}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="install-section" id="install">
          <div className="install-card">
            <div className="eyebrow">Instalación</div>
            <h2>Descarga el EXE de Windows cuando empaquetes la app.</h2>
            <p>La distribución final se genera con Electron Builder. El repositorio queda preparado para construir instaladores y mantener una identidad visual coherente entre web y escritorio.</p>
            <div className="hero-actions">
              <a className="button button--accent" href="#top"><Download size={16} /> Descargar</a>
              <a className="button button--soft" href="#features"><Blocks size={16} /> Ver características</a>
            </div>
          </div>
          <div className="install-card install-card--info">
            <div className="eyebrow">Información del proyecto</div>
            <p>Mova está pensado para restaurantes, tiendas, negocios de ropa, accesorios, comida y emprendimientos familiares. No depende de servicios externos para sus funciones centrales.</p>
            <div className="install-tags">
              <span>Modo oscuro</span>
              <span>Modo claro</span>
              <span>Local-first</span>
              <span>UX premium</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}