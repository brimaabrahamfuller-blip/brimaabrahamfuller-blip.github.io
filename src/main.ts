import './styles.css';
import { services, siteConfig, steps } from './content';

const icon = (name: string) => {
  const paths: Record<string, string> = {
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    spark: '<path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3ZM19 17l.7 2.3L22 20l-2.3.7L19 23l-.7-2.3L16 20l2.3-.7L19 17Z"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
};

const productLink = (url: string, label: string) => url
  ? `<a class="text-link" href="${url}" target="_blank" rel="noreferrer">${label} ${icon('arrow')}</a>`
  : `<span class="pending-link">Public link pending approval</span>`;

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('App root not found');

app.innerHTML = `
  <header class="site-header">
    <a class="brand" href="#top" aria-label="NextGents Tech Firm home"><span class="brand-mark">N</span><span>NextGents<span class="brand-dot">.</span></span></a>
    <button class="menu-toggle" aria-expanded="false" aria-controls="primary-nav">${icon('menu')}<span class="sr-only">Open menu</span></button>
    <nav id="primary-nav" class="primary-nav" aria-label="Primary navigation">
      <a href="#about">About</a><a href="#services">Services</a><a href="#products">Products</a><a href="#work">Our work</a>
      <a class="nav-cta" href="#contact">Talk to NextGents ${icon('arrow')}</a>
    </nav>
  </header>

  <main id="top">
    <section class="hero section-wrap">
      <div class="hero-copy">
        <p class="eyebrow"><span class="eyebrow-line"></span> Technology from Monrovia, Liberia</p>
        <h1>Building useful technology for <em>practical progress.</em></h1>
        <p class="lede">NextGents Tech Firm builds practical digital products and technology solutions for businesses, institutions, and communities in Liberia and beyond.</p>
        <div class="hero-actions"><a class="button button-primary" href="#contact">Start a project ${icon('arrow')}</a><a class="button button-quiet" href="#products">Explore our products ${icon('arrow')}</a></div>
        <div class="hero-note"><span class="note-dot"></span><span>Digital products · Organization solutions · Community impact</span></div>
      </div>
      <div class="hero-art" aria-label="Abstract illustration representing connected communities">
        <div class="orb orb-one"></div><div class="orb orb-two"></div><div class="grid-sun"></div>
        <div class="art-card art-card-top"><span class="mini-label">Built for here</span><strong>Ideas → useful tools</strong></div>
        <div class="art-card art-card-bottom"><span class="mini-label">Based in</span><strong>Monrovia, LR</strong></div>
        <div class="orbit orbit-one"></div><div class="orbit orbit-two"></div>
      </div>
    </section>

    <section id="about" class="intro section-wrap section-pad">
      <div class="section-kicker">01 / The firm</div><div><h2>Technology should make the next step clearer.</h2><p class="body-copy">NextGents is a Liberia-based technology firm focused on building digital products and solutions that meet people where they are. We work across product design, web platforms, organizational systems, and technology support.</p><p class="body-copy">Our work is grounded in a simple belief: good technology is practical, understandable, and useful in the context it serves.</p></div>
      <div class="about-aside"><span class="quote-mark">“</span><p>We build with the realities of businesses, institutions, and communities in mind.</p><span class="aside-rule"></span><p class="aside-caption">NextGents Tech Firm, Inc.</p></div>
    </section>

    <section id="services" class="services section-wrap section-pad"><div class="section-heading"><div><div class="section-kicker">02 / Capabilities</div><h2>What we can build together.</h2></div><p>Focused technology support for organizations moving from idea to implementation.</p></div><div class="service-grid">${services.map(([number, title, copy]) => `<article class="service-card"><span class="service-number">${number}</span><h3>${title}</h3><p>${copy}</p><span class="card-arrow">${icon('arrow')}</span></article>`).join('')}</div></section>

    <section id="products" class="products section-pad"><div class="section-wrap"><div class="section-heading light"><div><div class="section-kicker">03 / Product studio</div><h2>Products with a purpose.</h2></div><p>Two products show how we turn local needs into useful digital experiences.</p></div>
      <div class="product-grid">
        <article class="product-card product-concerts"><div class="product-image"><img src="./assets/gentsconcerts-home.webp" alt="GentsConcerts event discovery interface" loading="lazy"><span class="product-tag">Event technology</span></div><div class="product-info"><div class="product-heading"><span class="product-index">01</span><h3>GentsConcerts</h3></div><p>A Liberia-focused event hosting and ticketing platform for event discovery, digital ticket purchasing, user accounts, organizer tools, and event management.</p><div class="product-meta"><span>Audience: event-goers, artists & organizers</span><span>Status: active product</span></div>${productLink(siteConfig.products.concerts, 'Visit GentsConcerts')}</div></article>
        <article class="product-card product-academy"><div class="product-image"><img src="./assets/gentsacademy-learning.jpg" alt="Young learner using a digital learning platform" loading="lazy"><span class="product-tag">Learning technology</span></div><div class="product-info"><div class="product-heading"><span class="product-index">02</span><h3>GentsAcademy</h3></div><p>A free online learning platform for young Liberians, with self-study courses, learning pathways, weekly learning materials, progress tools, and educational resources.</p><div class="product-meta"><span>Audience: young Liberian learners</span><span>Status: active product</span></div>${productLink(siteConfig.products.academy, 'Explore GentsAcademy')}</div></article>
      </div>
    </div></section>

    <section id="work" class="process section-wrap section-pad"><div class="section-heading"><div><div class="section-kicker">04 / How we work</div><h2>Clear steps. Less noise.</h2></div><p>Good work is collaborative, testable, and connected to the people who will use it.</p></div><div class="process-grid">${steps.map(([number, title, copy]) => `<div class="process-step"><span>${number}</span><h3>${title}</h3><p>${copy}</p></div>`).join('')}</div></section>

    <section id="contact" class="contact section-wrap section-pad"><div class="contact-panel"><div><div class="section-kicker">05 / Start a conversation</div><h2>Have a problem worth solving?</h2><p>Tell us what you are trying to make clearer, faster, or more useful. We will get back to you at the best available contact.</p></div><a class="button button-light" href="mailto:${siteConfig.email}?subject=Project inquiry for NextGents">Talk to NextGents ${icon('arrow')}</a></div></section>
  </main>

  <footer class="site-footer section-wrap"><div class="footer-brand"><a class="brand" href="#top"><span class="brand-mark">N</span><span>NextGents<span class="brand-dot">.</span></span></a><p>Practical technology for Liberia and beyond.</p></div><div class="footer-contact"><span>Monrovia, Montserrado County, Liberia</span><a href="mailto:${siteConfig.email}">${siteConfig.email}</a></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} NextGents Tech Firm, Inc.</span><span>Built for the next useful thing.</span></div></footer>
`;

const menuButton = document.querySelector<HTMLButtonElement>('.menu-toggle');
const nav = document.querySelector<HTMLElement>('.primary-nav');
menuButton?.addEventListener('click', () => { const open = nav?.classList.toggle('is-open') ?? false; menuButton.setAttribute('aria-expanded', String(open)); menuButton.innerHTML = `${icon(open ? 'close' : 'menu')}<span class="sr-only">${open ? 'Close' : 'Open'} menu</span>`; });
nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => { nav.classList.remove('is-open'); menuButton?.setAttribute('aria-expanded', 'false'); }));
