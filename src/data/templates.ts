export interface TemplateItem {
  id: string;
  title: string;
  description: string;
  category: string;
  prompt: string;
  files: Record<string, string>;
}

export const STARTER_PROJECT: { name: string; files: Record<string, string> } = {
  name: 'Portfolio Studio Créatif',
  files: {
    'index.html': `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alexandre V. — Studio de Création Numérique</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
</head>
<body>
  <!-- Barre de navigation -->
  <nav class="navbar">
    <div class="nav-container">
      <a href="#" class="logo">
        <span class="logo-dot"></span>
        Alexandre<span class="highlight">.dev</span>
      </a>
      <div class="nav-links">
        <a href="#projets">Projets</a>
        <a href="#competences">Compétences</a>
        <a href="#experience">Expérience</a>
        <a href="#contact" class="btn-primary">Me contacter</a>
      </div>
      <button class="mobile-toggle" id="mobile-toggle" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <!-- Hero Section -->
  <header class="hero">
    <div class="hero-content">
      <div class="status-badge">
        <span class="pulse-dot"></span> Disponible pour de nouveaux projets
      </div>
      <h1 class="hero-title">
        Concepteur d'expériences <span class="gradient-text">web interactives</span> & d'interfaces futures
      </h1>
      <p class="hero-description">
        Ingénieur Full-Stack & Designer UI/UX basé à Paris. Je transforme des concepts audacieux en applications web véloces, esthétiques et intuitives.
      </p>
      <div class="hero-actions">
        <a href="#projets" class="btn-primary glow-effect">Explorer mes réalisations</a>
        <button id="theme-btn" class="btn-secondary">
          <span id="theme-icon">✨</span> Mode Ambiance
        </button>
      </div>
      <div class="stats-row">
        <div class="stat-item">
          <span class="stat-number" data-target="48">0</span>+
          <span class="stat-label">Projets Déployés</span>
        </div>
        <div class="stat-item">
          <span class="stat-number" data-target="99">0</span>%
          <span class="stat-label">Satisfaction Client</span>
        </div>
        <div class="stat-item">
          <span class="stat-number" data-target="6">0</span>+
          <span class="stat-label">Années d'Expertise</span>
        </div>
      </div>
    </div>
    <div class="hero-visual">
      <div class="card-glass">
        <div class="code-header">
          <div class="window-dots">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>
          <span class="code-title">Alexandre.config.ts</span>
        </div>
        <pre class="code-body"><code><span class="keyword">const</span> <span class="variable">developer</span> = {
  <span class="property">name</span>: <span class="string">'Alexandre V.'</span>,
  <span class="property">role</span>: <span class="string">'Creative Fullstack'</span>,
  <span class="property">stack</span>: [<span class="string">'React'</span>, <span class="string">'TypeScript'</span>, <span class="string">'AI Studio'</span>],
  <span class="property">status</span>: <span class="string">'Prêt à innover'</span>,
  <span class="method">sayHi</span>: () => <span class="string">'Bienvenue dans mon univers !'</span>
};</code></pre>
      </div>
    </div>
  </header>

  <!-- Section Projets -->
  <section id="projets" class="section">
    <div class="section-header">
      <h2 class="section-title">Projets Récents</h2>
      <p class="section-subtitle">Une sélection de travaux récents alliant design d'exception et code robuste</p>
    </div>

    <!-- Filtres -->
    <div class="filters-bar">
      <button class="filter-btn active" data-filter="all">Tous</button>
      <button class="filter-btn" data-filter="ai">Intelligence Artificielle</button>
      <button class="filter-btn" data-filter="saas">Plateformes SaaS</button>
      <button class="filter-btn" data-filter="design">Design Systems</button>
    </div>

    <div class="projects-grid" id="projects-container">
      <!-- Projets générés dynamiquement par JS -->
    </div>
  </section>

  <!-- Section Interactive Widget -->
  <section id="competences" class="section bg-card">
    <div class="section-header">
      <h2 class="section-title">Boîte à Outils Interactive</h2>
      <p class="section-subtitle">Testez le sélecteur de compétences en temps réel</p>
    </div>
    <div class="skills-interactive-container">
      <div class="skill-meter-card">
        <h3>Niveau de maîtrise technologique</h3>
        <div class="skill-bar-item">
          <div class="skill-info"><span>Frontend (React, TypeScript, Next.js)</span><span>98%</span></div>
          <div class="progress-track"><div class="progress-fill" style="width: 98%;"></div></div>
        </div>
        <div class="skill-bar-item">
          <div class="skill-info"><span>Intégration IA (LLMs, API REST, UI/UX)</span><span>95%</span></div>
          <div class="progress-track"><div class="progress-fill" style="width: 95%;"></div></div>
        </div>
        <div class="skill-bar-item">
          <div class="skill-info"><span>Backend & Architectures Cloud</span><span>90%</span></div>
          <div class="progress-track"><div class="progress-fill" style="width: 90%;"></div></div>
        </div>
        <div class="skill-bar-item">
          <div class="skill-info"><span>UI/UX & Design Graphique</span><span>92%</span></div>
          <div class="progress-track"><div class="progress-fill" style="width: 92%;"></div></div>
        </div>
      </div>
      <div class="interactive-quote-card">
        <h3>Générateur de Devis Instantané</h3>
        <p>Sélectionnez votre type de projet :</p>
        <div class="quote-selector">
          <button class="quote-opt active" data-rate="1800">Landing Page High-End</button>
          <button class="quote-opt" data-rate="3500">Application Web Complète</button>
          <button class="quote-opt" data-rate="4800">Intégration IA Sur Mesure</button>
        </div>
        <div class="quote-result">
          <span>Estimation indicative :</span>
          <strong id="quote-price">1 800 €</strong>
        </div>
      </div>
    </div>
  </section>

  <!-- Section Contact -->
  <section id="contact" class="section">
    <div class="contact-box">
      <h2>Prêt à donner vie à votre prochain projet ?</h2>
      <p>Discutons ensemble de vos idées et construisons quelque chose de mémorable.</p>
      <form id="contact-form" class="contact-form">
        <div class="form-row">
          <input type="text" id="name" placeholder="Votre nom" required>
          <input type="email" id="email" placeholder="Votre adresse email" required>
        </div>
        <textarea id="message" rows="4" placeholder="Décrivez votre vision ou vos objectifs..." required></textarea>
        <button type="submit" class="btn-primary">Envoyer le message</button>
      </form>
      <div id="form-feedback" class="form-feedback"></div>
    </div>
  </section>

  <footer class="footer">
    <p>© 2026 Alexandre V. Studio de Création Numérique.</p>
  </footer>

  <script src="script.js"></script>
</body>
</html>`,
    'style.css': `:root {
  --bg: #090d16;
  --bg-card: #111827;
  --bg-card-hover: #1f293d;
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --accent: #3b82f6;
  --accent-light: #60a5fa;
  --accent-glow: rgba(59, 130, 246, 0.4);
  --purple: #8b5cf6;
  --border: rgba(255, 255, 255, 0.08);
  --radius: 16px;
  --transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

[data-theme="light"] {
  --bg: #f8fafc;
  --bg-card: #ffffff;
  --bg-card-hover: #f1f5f9;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --border: rgba(15, 23, 42, 0.08);
  --accent-glow: rgba(59, 130, 246, 0.2);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  background-color: var(--bg);
  color: var(--text-main);
  line-height: 1.6;
  overflow-x: hidden;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Navbar */
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
  background: rgba(9, 13, 22, 0.8);
  border-bottom: 1px solid var(--border);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 1.25rem;
  text-decoration: none;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 10px var(--accent);
}

.highlight {
  color: var(--accent-light);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.75rem;
}

.nav-links a {
  text-decoration: none;
  color: var(--text-muted);
  font-weight: 500;
  font-size: 0.95rem;
  transition: var(--transition);
}

.nav-links a:hover {
  color: var(--accent-light);
}

.mobile-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
}

/* Boutons */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%);
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  text-decoration: none;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px var(--accent-glow);
  transition: var(--transition);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--accent-glow);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-card);
  color: var(--text-main);
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: var(--transition);
}

.btn-secondary:hover {
  background: var(--bg-card-hover);
  border-color: var(--accent);
}

/* Hero */
.hero {
  max-width: 1200px;
  margin: 0 auto;
  padding: 5rem 1.5rem 4rem;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 3rem;
  align-items: center;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: var(--accent-light);
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  margin-bottom: 1.5rem;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.95); opacity: 0.7; }
  50% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.7; }
}

.hero-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 3.25rem;
  line-height: 1.15;
  font-weight: 800;
  margin-bottom: 1.25rem;
  letter-spacing: -0.02em;
}

.gradient-text {
  background: linear-gradient(135deg, #60a5fa 0%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-description {
  font-size: 1.15rem;
  color: var(--text-muted);
  margin-bottom: 2rem;
  max-width: 600px;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
}

.stats-row {
  display: flex;
  gap: 2.5rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-main);
}

.stat-label {
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* Card Visual */
.card-glass {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.code-header {
  background: rgba(0, 0, 0, 0.2);
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--border);
}

.window-dots {
  display: flex;
  gap: 6px;
  margin-right: 1rem;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.dot.red { background: #ef4444; }
.dot.yellow { background: #f59e0b; }
.dot.green { background: #10b981; }

.code-title {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-family: monospace;
}

.code-body {
  padding: 1.25rem;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.9rem;
  line-height: 1.7;
}

.keyword { color: #f43f5e; }
.variable { color: #38bdf8; }
.property { color: #fbbf24; }
.string { color: #4ade80; }
.method { color: #a78bfa; }

/* Sections */
.section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 1.5rem;
}

.bg-card {
  background: var(--bg-card);
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

.section-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.section-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.section-subtitle {
  color: var(--text-muted);
  font-size: 1.05rem;
}

/* Filters */
.filters-bar {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-btn {
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-muted);
  padding: 0.5rem 1.2rem;
  border-radius: 9999px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.filter-btn.active, .filter-btn:hover {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

/* Projects Grid */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.75rem;
}

.project-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  transition: var(--transition);
  display: flex;
  flex-direction: column;
}

.project-card:hover {
  transform: translateY(-6px);
  border-color: var(--accent-light);
  box-shadow: 0 16px 30px rgba(0, 0, 0, 0.2);
}

.project-thumbnail {
  height: 180px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.project-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  color: #fff;
  font-size: 0.75rem;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  font-weight: 600;
}

.project-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.project-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.project-desc {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin-bottom: 1.25rem;
  flex: 1;
}

.project-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background: rgba(255, 255, 255, 0.05);
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  color: var(--text-muted);
}

/* Interactive widget */
.skills-interactive-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
  padding: 1.5rem;
}

.skill-bar-item {
  margin-bottom: 1.25rem;
}

.skill-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  margin-bottom: 0.4rem;
  font-weight: 500;
}

.progress-track {
  height: 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--purple));
  border-radius: 9999px;
}

.quote-selector {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin: 1.25rem 0;
}

.quote-opt {
  text-align: left;
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--text-main);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: var(--transition);
}

.quote-opt.active {
  border-color: var(--accent);
  background: rgba(59, 130, 246, 0.1);
}

.quote-result {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
  font-size: 1.1rem;
}

.quote-result strong {
  font-size: 1.75rem;
  color: var(--accent-light);
}

/* Contact */
.contact-box {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 3rem;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.contact-box h2 {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.contact-box p {
  color: var(--text-muted);
  margin-bottom: 2rem;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

input, textarea {
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--text-main);
  padding: 0.85rem 1.2rem;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.95rem;
  outline: none;
  transition: var(--transition);
}

input:focus, textarea:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.form-feedback {
  margin-top: 1rem;
  font-size: 0.95rem;
  font-weight: 500;
  display: none;
}

.form-feedback.success {
  display: block;
  color: #10b981;
}

/* Footer */
.footer {
  text-align: center;
  padding: 2.5rem 1.5rem;
  border-top: 1px solid var(--border);
  color: var(--text-muted);
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
    text-align: center;
    padding-top: 3rem;
  }
  .hero-description {
    margin-left: auto;
    margin-right: auto;
  }
  .hero-actions {
    justify-content: center;
  }
  .stats-row {
    justify-content: center;
  }
  .skills-interactive-container {
    grid-template-columns: 1fr;
  }
  .form-row {
    grid-template-columns: 1fr;
  }
}
`,
    'script.js': `// Données des projets
const projectsData = [
  {
    id: 1,
    title: "NeuroForge AI Studio",
    category: "ai",
    badge: "Intelligence Artificielle",
    desc: "Plateforme SaaS générative permettant la synthèse multimodale de code et de prototypes graphiques.",
    tags: ["React", "IA Générative", "WebSockets"],
    gradient: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)"
  },
  {
    id: 2,
    title: "Pulse Analytics Engine",
    category: "saas",
    badge: "SaaS & Cloud",
    desc: "Tableau de bord financier haute vélocité traitant plus de 50 000 transactions à la seconde.",
    tags: ["TypeScript", "D3.js", "Tailwind"],
    gradient: "linear-gradient(135deg, #064e3b 0%, #065f46 100%)"
  },
  {
    id: 3,
    title: "Aura Design System",
    category: "design",
    badge: "Design System",
    desc: "Système de composants UI accessible et tokenisé avec support multi-thèmes et animations fluides.",
    tags: ["CSS Modules", "Storybook", "Figma API"],
    gradient: "linear-gradient(135deg, #4c0519 0%, #881337 100%)"
  }
];

// Rendu des projets
function renderProjects(category = 'all') {
  const container = document.getElementById('projects-container');
  if (!container) return;

  const filtered = category === 'all' 
    ? projectsData 
    : projectsData.filter(p => p.category === category);

  container.innerHTML = filtered.map(project => \`
    <article class="project-card">
      <div class="project-thumbnail" style="background: \${project.gradient};">
        <span class="project-badge">\${project.badge}</span>
      </div>
      <div class="project-content">
        <h3 class="project-title">\${project.title}</h3>
        <p class="project-desc">\${project.desc}</p>
        <div class="project-tags">
          \${project.tags.map(t => \`<span class="tag">\${t}</span>\`).join('')}
        </div>
      </div>
    </article>
  \`).join('');
}

// Filtres de projets
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProjects(btn.dataset.filter);
  });
});

// Animation des compteurs
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    let count = 0;
    const speed = target / 30;
    const update = () => {
      count += speed;
      if (count < target) {
        counter.innerText = Math.ceil(count);
        requestAnimationFrame(update);
      } else {
        counter.innerText = target;
      }
    };
    update();
  });
}

// Sélecteur de devis interactif
document.querySelectorAll('.quote-opt').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.quote-opt').forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
    const rate = opt.getAttribute('data-rate');
    const display = document.getElementById('quote-price');
    if (display) {
      display.innerText = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(rate);
    }
  });
});

// Mode Ambiance / Thème
const themeBtn = document.getElementById('theme-btn');
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const isLight = document.body.getAttribute('data-theme') === 'light';
    if (isLight) {
      document.body.removeAttribute('data-theme');
      document.getElementById('theme-icon').innerText = '✨';
    } else {
      document.body.setAttribute('data-theme', 'light');
      document.getElementById('theme-icon').innerText = '🌙';
    }
  });
}

// Formulaire de contact
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const feedback = document.getElementById('form-feedback');
    const name = document.getElementById('name').value;
    feedback.className = 'form-feedback success';
    feedback.innerText = \`Merci \${name} ! Votre message a bien été transmis. Je vous répondrai sous 24h.\`;
    contactForm.reset();
  });
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  renderProjects('all');
  animateCounters();
  console.log("Portfolio d'Alexandre V. chargé avec succès !");
});
`,
    'README.md': `# Portfolio Studio Créatif Alexandre V.

Site vitrine moderne, responsive et interactif.

## Fonctionnalités incluses :
- **Design dark/light mode** avec transition fluide.
- **Section Projets interactive** avec filtres par catégorie dynamiques.
- **Simulateur de devis instantané** avec calcul en temps réel.
- **Compteurs de statistiques animés**.
- **Formulaire de contact fonctionnel** avec validation et retour utilisateur.
- **Architecture de code propre** séparant HTML, CSS et JS.

## Pour tester en local :
Double-cliquez sur \`index.html\` pour l'ouvrir dans n'importe quel navigateur moderne !`
  }
};

export const PROMPT_SUGGESTIONS: Array<{ title: string; prompt: string; icon: string }> = [
  {
    title: '💬 Échanger sur une idée de projet',
    prompt: 'J\'ai une idée de projet web en tête, mais j\'aimerais d\'abord échanger avec toi pour affiner le concept. Peux-tu me poser quelques questions pour cerner mes objectifs, ma cible et mes besoins avant de faire quoi que ce soit ?',
    icon: 'MessageSquare',
  },
  {
    title: '📋 Élaborer le plan & l\'arborescence d\'un site',
    prompt: 'Je souhaite créer un site vitrine haut de gamme pour une activité de conseil & audit. Peux-tu me proposer un plan détaillé avec les sections recommandées, l\'arborescence et le parcours utilisateur idéal avant de passer au codage ?',
    icon: 'ListChecks',
  },
  {
    title: '🎨 Conseils Design, Couleurs & Typographie',
    prompt: 'Quelles sont les meilleures tendances actuelles en matière d\'UI/UX, de palettes de couleurs et de choix typographiques pour un site de réservation d\'expériences de voyage éco-responsables ?',
    icon: 'Sparkles',
  },
  {
    title: '✍️ Rédiger les textes & le copywriting d\'un site',
    prompt: 'Aide-moi à rédiger le contenu textuel complet pour ma page d\'accueil : une accroche percutante (hero header), les 3 arguments clés de vente, et un appel à l\'action convaincant.',
    icon: 'FileText',
  },
  {
    title: '🚀 Valider & générer une application SaaS Kanban',
    prompt: 'Conçois une application web SaaS de gestion de tâches (style Linear/Notion). Inclus un tableau Kanban interactif, un formulaire d\'ajout de tâches avec priorité, un mode sombre et un code modulaire propre.',
    icon: 'LayoutGrid',
  },
];
