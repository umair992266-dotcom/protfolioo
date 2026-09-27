import './index.css';
import './App.css';
import NeuralCanvas from './NeuralCanvas';
import { useScrollReveal, useNavScroll, useTypewriter } from './hooks';

/* ─────────────────────────────────────────────────────────
   DATA
   ───────────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Expertise', href: '#expertise' },
  { label: 'Work', href: '#work' },
  { label: 'Benchmarks', href: '#benchmarks' },
  { label: 'Contact', href: '#contact' },
];

const SKILLS = [
  {
    num: '01',
    icon: '🤖',
    title: 'LLM & Agents',
    tags: ['LangChain', 'OpenAI API', 'Tool Use', 'Function Calling', 'RAG', 'Prompt Engineering', 'Multi-Step Orchestration', 'n8n'],
  },
  {
    num: '02',
    icon: '📊',
    title: 'Evaluation & Training',
    tags: ['Terminal Bench', 'TB Harbor 2.0', 'OSWorld', 'SWE-bench', 'RLHF', 'Supervised Fine-Tuning', 'Task Authoring', 'Annotation QA'],
  },
  {
    num: '03',
    icon: '🔍',
    title: 'Retrieval & Data',
    tags: ['FAISS', 'Custom Chunking', 'Embedding Strategies', 'Ingestion Pipelines', 'Vector DBs', 'Scale Annotation'],
  },
  {
    num: '04',
    icon: '⚙️',
    title: 'Engineering & Ops',
    tags: ['Docker', 'Linux', 'pytest', 'Git / GitHub', 'CI/CD', 'Containerized Environments', 'Reproducible Setups'],
  },
];

const PROJECTS = [
  {
    index: '001',
    title: 'AI Workflow Automator',
    desc: 'Multi-step agentic system routing incoming Slack messages to CRMs and Notion with intelligent classification. Achieves 90%+ production accuracy across enterprise workflows with near-zero latency.',
    metric: '90%+',
    metricLabel: 'Production\nAccuracy',
    tags: ['LangChain', 'OpenAI API', 'Slack', 'n8n', 'Docker', 'CRM Integration'],
  },
  {
    index: '002',
    title: 'RAG-Powered Knowledge Base Q&A',
    desc: 'Domain-specific FAISS vector retrieval pipeline for enterprise knowledge bases. Open-sourced implementation with custom chunking and embedding strategies, achieving 50+ GitHub stars.',
    metric: '50+',
    metricLabel: 'GitHub\nStars',
    tags: ['FAISS', 'Embeddings', 'RAG', 'Custom Chunking', 'Open Source'],
  },
  {
    index: '003',
    title: 'Terminal Bench (TB Harbor 2.0)',
    desc: 'Custom evaluation framework designed to rigorously test complex agentic reasoning in terminal environments. Authored as part of the AI POD\'s benchmark suite for RLHF and SFT research.',
    metric: 'RLHF',
    metricLabel: 'Core\nMethodology',
    tags: ['Terminal Bench', 'Agentic Eval', 'RLHF', 'SFT', 'Benchmark Design'],
  },
  {
    index: '004',
    title: 'OSWorld Benchmark Tasks',
    desc: 'Authored custom benchmark tasks within the OSWorld framework for evaluating agentic reasoning across operating system interactions. Designed to probe multi-step task completion in realistic environments.',
    metric: 'OS',
    metricLabel: 'Cross-Platform\nBenchmark',
    tags: ['OSWorld', 'Task Authoring', 'Agentic Reasoning', 'Evaluation'],
  },
];

const STATS = [
  { value: '90%+', label: 'Agent Production Accuracy' },
  { value: '4+',   label: 'Benchmark Frameworks' },
  { value: '50+',  label: 'GitHub Stars (RAG OSS)' },
  { value: '2',    label: 'OSWorld Benchmark Sets' },
];

/* ─────────────────────────────────────────────────────────
   SVG ICONS
   ───────────────────────────────────────────────────────── */
function LinkedInIcon() {
  return (
    <svg className="btn-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg className="btn-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="btn-icon btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────
   COMPONENTS
   ───────────────────────────────────────────────────────── */

function Nav() {
  useNavScroll();
  return (
    <nav className="nav">
      <a href="#" className="nav-logo">
        <span className="nav-logo-dot" />
        UK // AI Engineer
      </a>
      <ul className="nav-links">
        {NAV_LINKS.map((l) => (
          <li key={l.href}>
            <a href={l.href}>{l.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Hero() {
  const typeRef = useTypewriter('AI Engineer — Agentic Systems, LLM Evaluation & Automation', 38, 800);

  return (
    <section className="hero" id="hero">
      <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Available for Projects &amp; Collaboration
        </div>

        <h1 className="hero-title">
          <span className="hero-title-fill">UMAIR</span>
          <span className="hero-title-outline">KHAN</span>
        </h1>

        <p className="hero-subtitle">
          <span ref={typeRef} />
          <span className="cursor" />
        </p>

        <div className="hero-meta">
          {['RLHF Lead', 'Terminal Bench Designer', 'OSWorld Author', 'AI POD Tech Lead'].map((tag) => (
            <span key={tag} className="hero-meta-tag">{tag}</span>
          ))}
        </div>

        <div className="hero-buttons">
          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/umair-khan-3a546a418/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-3d btn-linkedin"
          >
            <LinkedInIcon />
            <div className="btn-label">
              <span className="btn-label-primary">LinkedIn</span>
              <span className="btn-label-secondary">// Profile</span>
            </div>
            <ArrowRightIcon />
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/umair992266-dotcom"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-3d btn-github"
          >
            <div className="repo-tags">
              ★ Terminal Bench &nbsp;·&nbsp; RAG Q&amp;A &nbsp;·&nbsp; OSWorld Tasks
            </div>
            <GitHubIcon />
            <div className="btn-label">
              <span className="btn-label-primary">GitHub</span>
              <span className="btn-label-secondary">// Code &amp; Benchmark Repos</span>
            </div>
            <ArrowRightIcon />
          </a>

          {/* CV Download */}
          <a
            href="https://github.com/umair992266-dotcom/cv/raw/main/Umair_Khan_CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-3d btn-cv"
          >
            <DownloadIcon />
            <div className="btn-label">
              <span className="btn-label-primary">Download CV</span>
              <span className="btn-label-secondary">// PDF Resume</span>
            </div>
          </a>
        </div>

        {/* Bio blurb */}
        <div
          className="glass"
          style={{
            marginTop: 'var(--sp-12)',
            padding: 'var(--sp-6)',
            maxWidth: 620,
            animation: 'fadeInUp 1s cubic-bezier(0.34,1.56,0.64,1) 1.2s both',
          }}
        >
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.8, letterSpacing: '0.04em' }}>
            <span style={{ color: 'var(--text-muted)' }}>&gt; profile.bio</span><br />
            Leads an AI POD focused on <strong style={{ color: '#fff' }}>RLHF</strong> and <strong style={{ color: '#fff' }}>Supervised Fine-Tuning (SFT)</strong>.
            Designer of <strong style={{ color: '#fff' }}>Terminal Bench (TB Harbor 2.0)</strong> and author of
            <strong style={{ color: '#fff' }}> OSWorld</strong> benchmark tasks for agentic reasoning.
            Builds production-grade agentic systems, evaluation frameworks, and RAG pipelines.
          </p>
        </div>
      </div>

      <div className="scroll-indicator">
        <span className="scroll-text">scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}

function Stats() {
  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 var(--sp-8)' }}>
      <div className="stats-row reveal">
        {STATS.map((s) => (
          <div key={s.label} className="stat-item">
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Expertise() {
  return (
    <section className="section" id="expertise">
      <div className="section-header reveal">
        <div className="section-eyebrow">Technical Matrix</div>
        <h2 className="section-title">Core Expertise</h2>
        <p className="section-desc">
          End-to-end AI engineering — from benchmark design and model evaluation to production agentic pipelines.
        </p>
      </div>

      <div className="skills-grid">
        {SKILLS.map((skill, i) => (
          <div
            key={skill.num}
            className="skill-card reveal"
            data-delay={i * 80}
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <div className="skill-card-num">{skill.num} / {SKILLS.length.toString().padStart(2, '0')}</div>
            <div className="skill-card-icon">{skill.icon}</div>
            <div className="skill-card-title">{skill.title}</div>
            <div className="skill-tags">
              {skill.tags.map((t) => (
                <span key={t} className="skill-tag">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Work() {
  return (
    <section className="section" id="work">
      <div className="section-header reveal">
        <div className="section-eyebrow">Selected Work</div>
        <h2 className="section-title">Case Studies</h2>
        <p className="section-desc">
          Production systems, open-source tools, and evaluation frameworks built for real-world AI deployment.
        </p>
      </div>

      <div className="projects-list">
        {PROJECTS.slice(0, 2).map((p, i) => (
          <div
            key={p.index}
            className="project-card reveal"
            data-delay={i * 100}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <div>
              <div className="project-index">Case Study {p.index}</div>
              <div className="project-title">{p.title}</div>
              <p className="project-desc">{p.desc}</p>
              <div className="project-tags">
                {p.tags.map((t) => (
                  <span key={t} className="project-tag">{t}</span>
                ))}
              </div>
            </div>
            <div className="project-metric">
              <div className="metric-value">{p.metric}</div>
              <div className="metric-label" style={{ whiteSpace: 'pre-line' }}>{p.metricLabel}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Benchmarks() {
  return (
    <section className="section" id="benchmarks">
      <div className="section-header reveal">
        <div className="section-eyebrow">Evaluation Research</div>
        <h2 className="section-title">Benchmark<br />Frameworks</h2>
        <p className="section-desc">
          Custom evaluation frameworks designed to push the boundaries of agentic AI assessment.
        </p>
      </div>

      <div className="projects-list">
        {PROJECTS.slice(2).map((p, i) => (
          <div
            key={p.index}
            className="project-card reveal"
            data-delay={i * 100}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <div>
              <div className="project-index">Benchmark {p.index}</div>
              <div className="project-title">{p.title}</div>
              <p className="project-desc">{p.desc}</p>
              <div className="project-tags">
                {p.tags.map((t) => (
                  <span key={t} className="project-tag">{t}</span>
                ))}
              </div>
            </div>
            <div className="project-metric">
              <div className="metric-value" style={{ fontSize: '1.4rem' }}>{p.metric}</div>
              <div className="metric-label" style={{ whiteSpace: 'pre-line' }}>{p.metricLabel}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Terminal aesthetic display */}
      <div
        className="glass reveal"
        style={{
          marginTop: 'var(--sp-12)',
          padding: 'var(--sp-6) var(--sp-8)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          lineHeight: 2,
          letterSpacing: '0.04em',
        }}
      >
        <div style={{ color: 'var(--text-muted)', marginBottom: 'var(--sp-4)' }}>
          $ benchmark-suite --list-all
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>✓</span>{' '}
          <span style={{ color: '#fff' }}>Terminal Bench</span>
          <span style={{ color: 'var(--text-muted)', marginLeft: 'var(--sp-4)' }}>TB Harbor 2.0 &nbsp;·&nbsp; Agentic Terminal Evaluation</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>✓</span>{' '}
          <span style={{ color: '#fff' }}>OSWorld Tasks</span>
          <span style={{ color: 'var(--text-muted)', marginLeft: 'var(--sp-4)' }}>Cross-Platform OS Interaction Benchmark</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>✓</span>{' '}
          <span style={{ color: '#fff' }}>SWE-bench</span>
          <span style={{ color: 'var(--text-muted)', marginLeft: 'var(--sp-4)' }}>Software Engineering Task Evaluation</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>→</span>{' '}
          <span style={{ color: 'var(--text-secondary)' }}>Specialization:</span>
          <span style={{ color: 'var(--text-muted)', marginLeft: 'var(--sp-2)' }}>RLHF · SFT · Task Authoring · Annotation QA</span>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact">
      <div className="contact-section">
        <div className="section-eyebrow reveal" style={{ justifyContent: 'center', marginBottom: 'var(--sp-6)' }}>
          Get In Touch
        </div>
        <h2 className="contact-title reveal">
          <span style={{ background: 'linear-gradient(180deg, #ffffff 0%, #666 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Let's Build<br />Together
          </span>
        </h2>
        <p className="contact-subtitle reveal">
          Open to collaborations on agentic AI systems, LLM evaluation research, and production-grade automation pipelines.
        </p>
        <div className="contact-links reveal">
          <a
            href="https://www.linkedin.com/in/umair-khan-3a546a418/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-3d btn-linkedin"
          >
            <LinkedInIcon />
            <div className="btn-label">
              <span className="btn-label-primary">LinkedIn</span>
              <span className="btn-label-secondary">// Connect</span>
            </div>
          </a>
          <a
            href="https://github.com/umair992266-dotcom"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-3d btn-github"
          >
            <div className="repo-tags">★ Terminal Bench &nbsp;·&nbsp; RAG Q&amp;A &nbsp;·&nbsp; OSWorld</div>
            <GitHubIcon />
            <div className="btn-label">
              <span className="btn-label-primary">GitHub</span>
              <span className="btn-label-secondary">// Repositories</span>
            </div>
          </a>
          <a
            href="https://github.com/umair992266-dotcom/cv/raw/main/Umair_Khan_CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-3d btn-cv"
          >
            <DownloadIcon />
            <div className="btn-label">
              <span className="btn-label-primary">Download CV</span>
              <span className="btn-label-secondary">// Full Résumé</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <span className="footer-copy">
        © 2026 Umair Khan &nbsp;·&nbsp; AI Engineer &nbsp;·&nbsp; Built with Three.js & React
      </span>
      <div className="footer-links">
        <a href="https://www.linkedin.com/in/umair-khan-3a546a418/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="https://github.com/umair992266-dotcom" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://github.com/umair992266-dotcom/cv/raw/main/Umair_Khan_CV.pdf" target="_blank" rel="noopener noreferrer">CV</a>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────
   ROOT APP
   ───────────────────────────────────────────────────────── */
export default function App() {
  useScrollReveal();

  return (
    <div className="noise">
      {/* Fixed grid overlay */}
      <div className="grid-bg" />

      {/* Three.js neural network background */}
      <NeuralCanvas />

      {/* Navigation */}
      <Nav />

      {/* Scrollable main content */}
      <main className="main-content">
        <Hero />
        <Stats />
        <Expertise />
        <Work />
        <Benchmarks />
        <Contact />
        <Footer />
      </main>
    </div>
  );
}
