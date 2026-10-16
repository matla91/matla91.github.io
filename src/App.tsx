import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  ArrowLeft,
  Plus,
  Minus,
  Download,
  ChevronRight,
  X,
} from "lucide-react";
import Header from "./components/Header";
import ScientificVisual from "./components/ScientificVisual";
import ProjectVisual from "./components/ProjectVisual";
import {
  profile,
  projects,
  organizations,
  skills,
  archive,
  type Project,
} from "./content/portfolio";

function useReveals(path: string) {
  useEffect(() => {
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const elements = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-revealed");
            observer.unobserve(e.target);
          }
        }
      },
      { threshold: 0.08 },
    );
    elements.forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add("will-reveal");
        observer.observe(el);
      }
    });
    return () => observer.disconnect();
  }, [path]);
}
const Label = ({
  number,
  children,
}: {
  number: string;
  children: React.ReactNode;
}) => (
  <p className="section-label micro">
    <span>{number}</span> {children}
  </p>
);
function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <a href="/" className="footer-name">
          Matthis Lahargoue<span>ML · Vision · Scientific Computing</span>
        </a>
        <p className="micro">
          © {new Date().getFullYear()} · MADE WITH INTENTION
        </p>
        <a href="#top">
          Back to top <ArrowUpRight size={15} />
        </a>
      </div>
    </footer>
  );
}
function Contact() {
  return (
    <section id="contact" className="contact section-dark">
      <div className="container" data-reveal>
        <Label number="08">START A CONVERSATION</Label>
        <div className="contact-main">
          <h2>
            Good questions.
            <br />
            <span>Meaningful work.</span>
          </h2>
          <a
            href={`mailto:${profile.email}`}
            className="contact-circle"
            aria-label={`Email ${profile.name}`}
          >
            <ArrowUpRight size={46} strokeWidth={1} />
          </a>
        </div>
        <div className="contact-bottom">
          <p>
            I’m interested in ML, vision and scientific computing
            <br className="desktop-break" /> opportunities, especially in
            Switzerland.
          </p>
          <div className="contact-links">
            <a href={`mailto:${profile.email}`}>
              Email <ArrowUpRight size={15} />
            </a>
            <a href={profile.linkedin}>
              LinkedIn <ArrowUpRight size={15} />
            </a>
            <a href={profile.github}>
              GitHub <ArrowUpRight size={15} />
            </a>
            <a href={profile.cv} download>
              Download CV <Download size={15} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
function Organizations() {
  const [selected, setSelected] = useState<string | null>(null);
  const close = () => {
    const button = document.getElementById(`organization-${selected}`);
    setSelected(null);
    button?.focus();
  };
  return (
    <section
      id="organizations"
      className="organizations section-light"
      onKeyDown={(event) => {
        if (event.key === "Escape" && selected) {
          event.stopPropagation();
          close();
        }
      }}
    >
      <div className="container" data-reveal>
        <div className="org-heading">
          <Label number="02">PEOPLE & PLACES</Label>
          <h2>
            Organizations
            <br />
            behind the work<span className="period">.</span>
          </h2>
          <p>
            Research, industry and a double-degree <br />
            pathway between France and Canada.
          </p>
        </div>
        <div className="org-groups">
          {["professional", "academic"].map((group) => (
            <div key={group} className="org-group">
              <p className="micro">
                {group === "professional"
                  ? "PROFESSIONAL EXPERIENCE"
                  : "ACADEMIC INSTITUTIONS"}
              </p>
              <div className="logo-row">
                {organizations
                  .filter((o) => o.group === group)
                  .map((o) => (
                    <button
                      key={o.id}
                      id={`organization-${o.id}`}
                      type="button"
                      className={`logo-tile logo-${o.id} ${selected === o.id ? "selected" : ""}`}
                      aria-label={`${o.name} — ${o.kind}`}
                      aria-expanded={selected === o.id}
                      aria-controls={`organization-details-${o.id}`}
                      onClick={() =>
                        setSelected(selected === o.id ? null : o.id)
                      }
                    >
                      <img
                        src={o.logo}
                        alt={o.name}
                        loading="lazy"
                        width="200"
                        height="90"
                      />
                      <span>
                        {o.kind}
                        <Plus size={16} aria-hidden="true" />
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
        <div
          id="organization-details"
          className="org-detail-wrap"
          aria-live="polite"
        >
          {/* All panels occupy the same grid cell, reserving the tallest panel's space. */}
          {organizations.map((item) => (
            <div
              key={item.id}
              id={`organization-details-${item.id}`}
              className="org-detail"
              role="region"
              aria-labelledby={`organization-${item.id}`}
              aria-hidden={selected !== item.id}
              inert={selected !== item.id}
            >
              <div>
                <strong>{item.name}</strong>
                <span>
                  {item.kind} · {item.period}
                </span>
              </div>
              <p>{item.detail}</p>
              <a href={item.target}>
                View {item.group === "academic" ? "education" : "experience"}
                <ArrowDown size={15} />
              </a>
              <button
                className="icon-button org-close"
                type="button"
                aria-label="Close organization details"
                onClick={close}
              >
                <X size={18} />
              </button>
            </div>
          ))}
          {!selected && (
            <p className="org-hint micro">
              Select a logo to explore my role, the collaboration and its
              context.
              <Plus size={16} aria-hidden="true" />
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
function Education() {
  return (
    <section id="education" className="education section-light">
      <div className="container">
        <div className="section-heading" data-reveal>
          <div>
            <Label number="04">EDUCATION</Label>
            <h2>
              Engineering foundations.
              <br />
              <span className="muted">Research perspective.</span>
            </h2>
          </div>
          <p>
            A double-degree pathway.
            <br />
            Two countries, a shared focus on computing.
          </p>
        </div>
        <div className="education-timeline">
          <article id="education-ensisa" className="education-item" data-reveal>
            <div className="edu-date micro">
              IN PROGRESS<span>Diploma expected May 2027</span>
            </div>
            <div className="edu-main">
              <p className="micro">ENSISA · UNIVERSITÉ DE HAUTE-ALSACE</p>
              <h3>
                Engineering Degree
                <br />
                in Computer Science
              </h3>
              <p>
                Computer Science & Network Engineering. A foundation in software
                engineering, computing systems, mathematics and image
                processing.
              </p>
              <div className="tag-row">
                <span>France</span>
                <span>Engineering pathway</span>
              </div>
            </div>
            <img
              src={organizations.find((o) => o.id === "ensisa")!.logo}
              width="180"
              height="80"
              loading="lazy"
              alt="ENSISA"
            />
          </article>
          <article id="education-uqac" className="education-item" data-reveal>
            <div className="edu-date micro">
              2025 — 2026<span>Studies · degree pending</span>
            </div>
            <div className="edu-main">
              <p className="micro">UNIVERSITÉ DU QUÉBEC À CHICOUTIMI</p>
              <h3>
                Master’s in Computer Science
                <br />
                <span className="muted">Artificial Intelligence</span>
              </h3>
              <p>
                Graduate study in machine learning, large-scale data processing,
                business intelligence and research-oriented computing.
              </p>
              <div className="tag-row">
                <span>Canada</span>
                <span>Double-degree pathway</span>
              </div>
            </div>
            <img
              src={organizations.find((o) => o.id === "uqac")!.logo}
              width="180"
              height="80"
              loading="lazy"
              alt="UQAC"
            />
          </article>
        </div>
      </div>
    </section>
  );
}
function Experience() {
  return (
    <section id="experience" className="experience section-dark">
      <div className="container">
        <div className="section-heading" data-reveal>
          <div>
            <Label number="03">RESEARCH & PROFESSIONAL EXPERIENCE</Label>
            <h2>
              From physical questions
              <br />
              to working systems.
            </h2>
          </div>
          <a href={profile.linkedin} className="text-link">
            More on LinkedIn <ArrowUpRight size={16} />
          </a>
        </div>
        <div className="experience-list" data-reveal>
          <details className="experience-item" id="experience-isl" open>
            <summary>
              <span className="experience-date micro">JUL 2026 — PRESENT</span>
              <span className="experience-title">
                <strong>Research Intern</strong>
                <span>ISL · Computational Imaging & NLOS</span>
              </span>
              <span className="disclosure-icon">
                <Plus className="plus" size={20} />
                <Minus className="minus" size={20} />
              </span>
            </summary>
            <div className="experience-body">
              <p>
                Working at the intersection of transient-light simulation,
                inverse problems and learning-based reconstruction at the
                French-German Research Institute of Saint-Louis.
              </p>
              <ul>
                <li>
                  Build experimental pipelines from simulation and data
                  preparation to training and evaluation.
                </li>
                <li>
                  Explore computational imaging and machine learning through
                  reproducible scientific computing.
                </li>
                <li>
                  Study reconstruction beyond a camera’s direct line of sight.
                </li>
              </ul>
              <div className="experience-bottom">
                <div className="tag-row">
                  <span>PyTorch</span>
                  <span>Mitsuba 3</span>
                  <span>Dr.Jit</span>
                  <span>CUDA</span>
                </div>
                <a
                  className="text-link"
                  href="/projects/nlos-computational-imaging/"
                >
                  Research overview <ArrowUpRight size={15} />
                </a>
              </div>
              <p className="fine-print">
                Public overview only. Institutional data, code and unpublished
                findings are excluded.
              </p>
            </div>
          </details>
          <details className="experience-item" id="experience-magyar">
            <summary>
              <span className="experience-date micro">JUN 2025</span>
              <span className="experience-title">
                <strong>Computer Vision Project</strong>
                <span>MAGYAR SA · Applied Machine Learning</span>
              </span>
              <span className="disclosure-icon">
                <Plus className="plus" size={20} />
                <Minus className="minus" size={20} />
              </span>
            </summary>
            <div className="experience-body">
              <p>
                An end-to-end CNN prototype for classifying industrial tank
                images, developed in a two-person team.
              </p>
              <ul>
                <li>
                  Collect, clean and label approximately 1,000 proprietary
                  images.
                </li>
                <li>
                  Handle class imbalance, variable capture conditions and
                  visually similar categories.
                </li>
                <li>
                  Deliver an offline prototype and evaluate class-level
                  precision, recall and F1.
                </li>
              </ul>
              <div className="experience-bottom">
                <div className="tag-row">
                  <span>CNN</span>
                  <span>Transfer learning</span>
                  <span>Data curation</span>
                </div>
                <a
                  className="text-link"
                  href="/projects/industrial-computer-vision/"
                >
                  View case study <ArrowUpRight size={15} />
                </a>
              </div>
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
function Skills() {
  return (
    <section id="skills" className="skills section-dark">
      <div className="container">
        <div className="section-heading" data-reveal>
          <div>
            <Label number="05">TECHNICAL TOOLKIT</Label>
            <h2>
              The tools follow
              <br />
              <span className="muted">the question.</span>
            </h2>
          </div>
          <p>
            Simulation. Learning. Evaluation.
            <br />
            And the engineering that connects them.
          </p>
        </div>
        <div className="skills-list">
          {skills.map((skill) => (
            <article key={skill.number} className="skill-row" data-reveal>
              <span className="micro skill-num">{skill.number}</span>
              <div>
                <h3>{skill.title}</h3>
                <p>{skill.text}</p>
              </div>
              <div className="skill-tools">
                {skill.tools.map((tool) => (
                  <span key={tool}>{tool}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
function Highlights() {
  const [expanded, setExpanded] = useState(false);
  return (
    <section id="highlights" className="highlights section-light">
      <div className="container">
        <div className="section-heading" data-reveal>
          <div>
            <Label number="06">SELECTED HIGHLIGHTS</Label>
            <h2>
              Evidence over
              <br />
              <span className="muted">impressions.</span>
            </h2>
          </div>
          <p>
            Research practice, public work
            <br />
            and lessons worth sharing.
          </p>
        </div>
        <div className="highlight-grid" data-reveal>
          <article>
            <span className="micro">01 / REPRODUCIBILITY</span>
            <h3>
              When a baseline
              <br />
              changes the story.
            </h3>
            <p>
              A public CNN reproduction study that puts temporal validation and
              naive baselines at the center of the evaluation.
            </p>
            <a href="/projects/cnn-reproducibility/">
              Read the study <ArrowUpRight size={16} />
            </a>
          </article>
          <article>
            <span className="micro">02 / HACK AM RHEIN WARM-UP</span>
            <h3>
              Open data.
              <br />A local question.
            </h3>
            <p>
              Basel Tram Air makes historical sensor measurements explorable
              through an interactive map of tram corridors.
            </p>
            <a href="/projects/basel-tram-air/">
              Explore the project <ArrowUpRight size={16} />
            </a>
          </article>
        </div>
        <div
          id="more-highlights"
          hidden={!expanded}
          className="more-highlights"
        >
          <article>
            <p className="micro">03 / DISTRIBUTED ML</p>
            <h3>Learning to think beyond one machine.</h3>
            <p>
              PySpark and approximate nearest-neighbor experiments on Calcul
              Québec infrastructure, as part of a graduate project at UQAC.
            </p>
            <a href="/projects/distributed-sentiment-analysis/">
              View project <ArrowUpRight size={16} />
            </a>
          </article>
        </div>
        <button
          className="expand-button"
          aria-expanded={expanded}
          aria-controls="more-highlights"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Show fewer highlights" : "Show all highlights"}
          {expanded ? <Minus size={16} /> : <Plus size={16} />}
        </button>
      </div>
    </section>
  );
}
function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article
      className={`project-feature ${index % 2 ? "project-reverse" : ""}`}
      data-reveal
    >
      <a
        href={`/projects/${project.slug}/`}
        className="project-art-link"
        aria-label={`Read ${project.shortTitle} case study`}
        tabIndex={-1}
      >
        <div className="project-art">
          <ProjectVisual project={project} />
          <span className="project-art-index micro">
            {project.number} / SELECTED WORK
          </span>
          <span className="project-art-arrow">
            <ArrowUpRight size={24} />
          </span>
        </div>
      </a>
      <div className="project-copy">
        <p className="micro project-category">
          {project.category} <span>· {project.year}</span>
        </p>
        <h3>
          <a href={`/projects/${project.slug}/`}>{project.title}</a>
        </h3>
        <p>{project.summary}</p>
        <div className="tag-row">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <div className="project-metric">
          <strong>{project.metric}</strong>
          <span className="micro">{project.metricLabel}</span>
        </div>
        <a href={`/projects/${project.slug}/`} className="text-link">
          Read case study <ArrowUpRight size={16} />
        </a>
      </div>
    </article>
  );
}
function Projects() {
  const [showArchive, setShowArchive] = useState(false);
  return (
    <section id="projects" className="projects section-light">
      <div className="container">
        <div className="section-heading project-section-heading" data-reveal>
          <div>
            <Label number="07">SELECTED WORK / 2025 — 2026</Label>
            <h2>
              Questions become
              <br />
              <em>projects.</em>
            </h2>
          </div>
          <p>
            From hidden geometry to public data.
            <br />A closer look at the work.
          </p>
        </div>
        <div className="project-list">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
        <div className="archive" data-reveal>
          <div className="archive-heading">
            <div>
              <p className="micro">PROJECT ARCHIVE</p>
              <h3>More things I’ve built.</h3>
            </div>
            <button
              className="expand-button"
              aria-expanded={showArchive}
              aria-controls="archive-list"
              onClick={() => setShowArchive(!showArchive)}
            >
              {showArchive ? "Close archive" : "Open archive"}
              {showArchive ? <Minus size={17} /> : <Plus size={17} />}
            </button>
          </div>
          <div id="archive-list" hidden={!showArchive}>
            {archive.map((p, i) => (
              <a
                className="archive-row"
                href={p.url}
                aria-label={`${p.title} — ${p.category}`}
                key={p.title}
              >
                <span className="micro">0{i + 1}</span>
                <div>
                  <strong>{p.title}</strong>
                  <span>{p.category}</span>
                </div>
                <span className="archive-tags micro">{p.tags}</span>
                <ArrowUpRight size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
function Home() {
  return (
    <>
      <Header home />
      <main id="main" tabIndex={-1}>
        <section className="hero section-dark" aria-labelledby="hero-title">
          <div className="hero-grid" aria-hidden="true" />
          <div className="container hero-inner">
            <div className="hero-copy">
              <p className="micro hero-eyebrow">
                <span className="tiny-cross">+</span> MACHINE LEARNING ·
                COMPUTER VISION · SCIENTIFIC COMPUTING
              </p>
              <h1 id="hero-title" aria-label={profile.name}>
                MATTHIS
                <br />
                <span>LAHARGOUE</span>
                <span className="hero-title-period">.</span>
              </h1>
              <p className="hero-signature">
                From physical signals
                <br />
                to meaningful models.
              </p>
              <p className="hero-description">
                Engineering student & research intern at ISL.
                <br />
                Machine learning, vision and computational imaging.
                <span className="hero-location">
                  Saint-Louis · Basel region · Open to opportunities in
                  Switzerland
                </span>
              </p>
              <div className="hero-actions">
                <a href="#projects" className="button button-light">
                  Explore my work <ArrowDown size={17} />
                </a>
                <a href={profile.cv} className="hero-cv">
                  Download CV <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
            <ScientificVisual />
            <div className="hero-bottom">
              <div className="hero-profile">
                <img
                  src="/assets/avatar.webp"
                  width="42"
                  height="42"
                  alt="My monochrome GitHub avatar"
                />
                <div>
                  <span>Research intern @ ISL</span>
                  <p className="micro">ENSISA × UQAC · DOUBLE DEGREE</p>
                </div>
              </div>
              <div className="hero-socials">
                <a href={profile.github}>
                  GitHub <ArrowUpRight size={14} />
                </a>
                <a href={profile.linkedin}>
                  LinkedIn <ArrowUpRight size={14} />
                </a>
              </div>
              <a href="#about" className="scroll-cue micro">
                SCROLL TO EXPLORE <ArrowDown size={14} />
              </a>
            </div>
          </div>
        </section>
        <section id="about" className="about section-light">
          <div className="container">
            <div className="about-intro" data-reveal>
              <Label number="01">THE THREAD THROUGH MY WORK</Label>
              <div>
                <h2>
                  I build models.
                  <br />I care about what
                  <br />
                  <span className="muted">they actually learn.</span>
                </h2>
                <p>
                  I’m a French engineering student pursuing a double degree at
                  ENSISA and UQAC. At ISL, I work where machine learning meets
                  physical measurement.
                </p>
                <p>
                  I enjoy building the whole experimental pipeline: simulation,
                  data preparation, training, quantitative evaluation and
                  visualization.
                </p>
              </div>
            </div>
            <div className="focus-grid" data-reveal>
              <a href="#projects">
                <span className="focus-number micro">01 / LEARN</span>
                <h3>
                  Machine Learning
                  <br />& Computer Vision
                </h3>
                <p>
                  Useful baselines. Careful experiments.
                  <br />
                  Models that earn their conclusions.
                </p>
                <ArrowUpRight size={20} />
              </a>
              <a href="/projects/nlos-computational-imaging/">
                <span className="focus-number micro">02 / RECONSTRUCT</span>
                <h3>
                  Computational Imaging
                  <br />& Inverse Problems
                </h3>
                <p>
                  From measured light to hidden structure.
                  <br />
                  Physics and learning in the same loop.
                </p>
                <ArrowUpRight size={20} />
              </a>
              <a href="/projects/cnn-reproducibility/">
                <span className="focus-number micro">03 / VERIFY</span>
                <h3>
                  Scientific Computing
                  <br />& Reproducible Research
                </h3>
                <p>
                  Transparent methods. Honest evaluation.
                  <br />
                  Results others can inspect.
                </p>
                <ArrowUpRight size={20} />
              </a>
            </div>
            <div className="research-loop micro" data-reveal>
              <span>MY EXPERIMENTAL LOOP</span>
              <span>
                SIMULATE <ChevronRight size={12} /> TRAIN{" "}
                <ChevronRight size={12} /> EVALUATE <ChevronRight size={12} />{" "}
                UNDERSTAND <span className="loop-symbol">↺</span>
              </span>
            </div>
          </div>
        </section>
        <Organizations />
        <Experience />
        <Education />
        <Skills />
        <Highlights />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
function ProjectPage({ project }: { project: Project }) {
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} className="case-page">
        <section className="case-hero section-dark">
          <div className="container">
            <a href="/#projects" className="back-link">
              <ArrowLeft size={16} /> All projects
            </a>
            <p className="micro">
              {project.category} / {project.year}
            </p>
            <h1>{project.title}</h1>
            <p className="case-summary">{project.summary}</p>
            <div className="case-meta">
              <div className="tag-row">
                {project.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <div className="case-links">
                {project.demo && (
                  <a href={project.demo} className="button button-light">
                    Open live project <ArrowUpRight size={16} />
                  </a>
                )}
                {project.source && (
                  <a href={project.source} className="text-link">
                    {project.sourceLabel} <ArrowUpRight size={16} />
                  </a>
                )}
              </div>
            </div>
            <dl className="case-brief">
              <div>
                <dt className="micro">MY CONTRIBUTION</dt>
                <dd>{project.contribution}</dd>
              </div>
              <div>
                <dt className="micro">EVIDENCE & SCOPE</dt>
                <dd>{project.evidence}</dd>
              </div>
            </dl>
          </div>
        </section>
        <section className="case-content section-light">
          <div className="container">
            <figure className="case-figure">
              <ProjectVisual project={project} />
              <figcaption>{project.caption}</figcaption>
            </figure>
            <div className="case-text">
              <aside>
                <span className="micro">PROJECT {project.number}</span>
                <strong>{project.metric}</strong>
                <span>{project.metricLabel}</span>
              </aside>
              <div>
                <section>
                  <p className="micro">01 / THE QUESTION</p>
                  <h2>Context & problem.</h2>
                  <p>{project.context}</p>
                </section>
                <section>
                  <p className="micro">02 / THE WORK</p>
                  <h2>Approach.</h2>
                  <ol>
                    {project.approach.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </section>
                <section>
                  <p className="micro">03 / WHAT CAME OUT</p>
                  <h2>Outcome.</h2>
                  <p>{project.outcome}</p>
                </section>
                <section className="limitations">
                  <p className="micro">04 / READING THE EVIDENCE</p>
                  <h2>Scope & limitations.</h2>
                  <p>{project.limitation}</p>
                  {project.source && (
                    <a href={project.source} className="text-link">
                      {project.sourceLabel} <ArrowUpRight size={16} />
                    </a>
                  )}
                </section>
              </div>
            </div>
            <a className="next-project" href={`/projects/${next.slug}/`}>
              <span className="micro">NEXT CASE STUDY</span>
              <strong>{next.shortTitle}</strong>
              <ArrowUpRight size={32} />
            </a>
          </div>
        </section>
        <Contact />
      </main>
      <Footer />
    </>
  );
}
function NotFound() {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} className="not-found section-dark">
        <div className="container">
          <p className="micro">404 / OUTSIDE THE FIELD OF VIEW</p>
          <h1>
            Let’s find
            <br />a clearer path.
          </h1>
          <a href="/" className="button button-light">
            Back to the portfolio <ArrowUpRight size={16} />
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
export default function App({ path = "/" }: { path?: string }) {
  useReveals(path);
  useEffect(() => {
    const revealTarget = () => {
      let id = "";
      try {
        id = decodeURIComponent(window.location.hash.slice(1));
      } catch {
        return;
      }
      const target = document.getElementById(id);
      if (target instanceof HTMLDetailsElement) target.open = true;
    };
    revealTarget();
    window.addEventListener("hashchange", revealTarget);
    return () => window.removeEventListener("hashchange", revealTarget);
  }, [path]);
  const clean = path.replace(/\/+$/, "") || "/";
  const project = projects.find((p) => clean === `/projects/${p.slug}`);
  return (
    <>
      <div id="top" className="app-shell">
        {clean === "/" ? (
          <Home />
        ) : project ? (
          <ProjectPage project={project} />
        ) : (
          <NotFound />
        )}
      </div>
    </>
  );
}
