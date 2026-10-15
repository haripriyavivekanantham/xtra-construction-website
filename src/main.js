import './style.css';
import { projects, posts } from './data.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const img = (name) => `/images/${name}`;

/* ---------- Header: active link, mobile menu, dropdowns ---------- */
const page = document.body.dataset.page;
$$('[data-nav]').forEach((a) => a.dataset.nav === page && a.classList.add('current'));

const navToggle = $('.nav-toggle');
const navWrap = $('.nav-wrap');
const navBackdrop = $('.nav-backdrop');
const setMenu = (open) => {
  navWrap.classList.toggle('open', open);
  navBackdrop.hidden = !open;
  navToggle.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
};
navToggle?.addEventListener('click', () => setMenu(!navWrap.classList.contains('open')));
$('.nav-close')?.addEventListener('click', () => setMenu(false));
navBackdrop?.addEventListener('click', () => setMenu(false));
$$('.nav a:not([data-toggle-sub]), .nav-social a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
window.addEventListener('resize', () => window.innerWidth > 1024 && setMenu(false));
$$('[data-toggle-sub]').forEach((a) =>
  a.addEventListener('click', (e) => {
    e.preventDefault();
    a.parentElement.classList.toggle('open');
  })
);

/* ---------- Search overlay ---------- */
const overlay = $('.search-overlay');
const closeSearch = () => overlay && (overlay.hidden = true);
$('.search-btn')?.addEventListener('click', () => {
  overlay.hidden = false;
  $('#site-search').focus();
});
$('.search-close')?.addEventListener('click', closeSearch);
document.addEventListener('keydown', (e) => e.key === 'Escape' && (closeSearch(), closeVideo(), setMenu(false)));
$('#search-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const q = new FormData(e.target).get('s').toString().trim();
  if (q) location.href = `/blog.html?s=${encodeURIComponent(q)}`;
});

/* ---------- Footer: year, back to top ---------- */
$$('#year, .year-copy').forEach((y) => (y.textContent = new Date().getFullYear()));
const toTop = $('.backtotop');
toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
window.addEventListener('scroll', () => toTop?.classList.toggle('show', window.scrollY > 400), { passive: true });


/* ---------- Header: no sticky behavior on scroll ---------- */
const siteHeader = $('.site-header');
const headerMain = $('.header-main');

headerMain?.classList.remove('is-sticky');
if (siteHeader) {
  siteHeader.style.minHeight = '';
}


/* ---------- Cookie notice ---------- */
const COOKIE_KEY = 'xtra-cookie-v2';
let cookie = $('.cookie');
if (!cookie) {
  cookie = document.createElement('div');
  cookie.className = 'cookie';
  cookie.hidden = true;
  cookie.innerHTML = '<span class="cookie-text">This website uses cookies to improve user experience.</span><button class="cookie-btn" type="button">Accept</button>';
  document.body.appendChild(cookie);
}
try { if (!localStorage.getItem(COOKIE_KEY)) cookie.hidden = false; } catch { cookie.hidden = false; }
$('.cookie-btn', cookie)?.addEventListener('click', () => {
  cookie.hidden = true;
  try { localStorage.setItem(COOKIE_KEY, '1'); } catch { /* ignore */ }
});
/* ---------- Floating icon box: home page only; any tap/click elsewhere hides it ---------- */
/* ---------- Floating icon box: home page only, stays visible down to the end of the page ---------- */
const sideTools = $('.side-tools');
if (sideTools && page !== 'home') sideTools.remove();

/* ---------- Hero slider ---------- */
const hero = $('.hero');
if (hero) {
  const slides = $$('.slide', hero);
  let i = 0;
  let timer;
  const show = (n) => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('active', k === i));
  };
  const auto = () => {
    clearInterval(timer);
    timer = setInterval(() => show(i + 1), 7000);
  };
  $('.hero-prev', hero).addEventListener('click', () => { show(i - 1); auto(); });
  $('.hero-next', hero).addEventListener('click', () => { show(i + 1); auto(); });
  show(0);
  auto();
}

/* ---------- Video modal ---------- */
const modal = $('.video-modal');
function closeVideo() {
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  $('iframe', modal).src = '';
}
$$('[data-video]').forEach((a) =>
  a.addEventListener('click', (e) => {
    e.preventDefault();
    $('iframe', modal).src = `https://www.youtube-nocookie.com/embed/${a.dataset.video}?autoplay=1`;
    modal.hidden = false;
  })
);
modal?.addEventListener('click', (e) => e.target.closest('[data-close]') && closeVideo());


/* ---------- Flip cards: one open at a time ---------- */
$$('.flip').forEach((card) => {
  const toggle = () => {
    const wasFlipped = card.classList.contains('is-flipped');

    $$('.flip.is-flipped').forEach((other) => {
      other.classList.remove('is-flipped');
      other.setAttribute('aria-pressed', 'false');
    });

    if (!wasFlipped) {
      card.classList.add('is-flipped');
      card.setAttribute('aria-pressed', 'true');
    }
  };

  card.addEventListener('click', (e) => {
    if (e.target.closest('a')) return;
    toggle();
  });

  card.addEventListener('keydown', (e) => {
    if (e.target !== card) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  });
});

/* ---------- Partner logos: one active at a time ----------
   Click/tap = one smooth flip + "Construction Company" label.
   The previously active logo flips back to normal and its label disappears. */
const logoItems = $$('.logo-item');
logoItems.forEach((item) => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const wasActive = item.classList.contains('is-active');
    logoItems.forEach((o) => o.classList.remove('is-active'));
    if (!wasActive) item.classList.add('is-active');
  });
});

/* ---------- Projects grid (home) ---------- */
const grid = $('#projects-grid');
if (grid) {
  grid.innerHTML = projects
    .map(
      (p) => `
    <a class="project" href="/project.html?id=${p.slug}" title="${p.title}">
      <img src="${img(p.img)}" width="600" height="600" loading="lazy" alt="${p.title}">
      <span class="project-details">
        <span class="project-icon"><svg class="icon"><use href="#i-plus"/></svg></span>
        <h3>${p.title}</h3>
        <small>${p.cats.join(', ')}</small>
      </span>
    </a>`
    )
    .join('');
}

/* ---------- Project detail page ---------- */
const root = $('#project-root');
if (root) {
  const id = new URLSearchParams(location.search).get('id');
  const idx = projects.findIndex((p) => p.slug === id);
  if (idx === -1) {
    document.title = 'Project not found – XTRA Construction';
    $('#project-title').textContent = 'Project not found';
    $('#project-crumb').textContent = 'Project not found';
    root.innerHTML = `<p>Sorry, we could not find that project.</p><p><a class="btn" href="/#projects">See all projects</a></p>`;
  } else {
    const p = projects[idx];
    const prev = projects[(idx - 1 + projects.length) % projects.length];
    const next = projects[(idx + 1) % projects.length];
    document.title = `${p.title} – XTRA Construction`;
    $('#project-title').textContent = p.title;
    $('#project-crumb').textContent = p.title;
    root.innerHTML = `
      <div class="project-detail">
        <div class="project-photo"><img src="${img(p.img)}" alt="${p.title}"></div>
        <div class="project-info">
          <span class="eyebrow">PROJECT</span>
          <h2 class="title">${p.title}</h2>
          <div class="chips">${p.cats.map((c) => `<span>${c}</span>`).join('')}</div>
          <p>This project shows how our team turns ideas and visions into winning results: careful planning, excellent engineering and grade #1 materials, delivered on time and built to last.</p>
          <ul class="info-list">
            <li><strong>Project:</strong> ${p.title}</li>
            <li><strong>Categories:</strong> ${p.cats.join(', ')}</li>
            <li><strong>Services:</strong> Engineering, construction and maintenance</li>
          </ul>
          <a class="btn" href="/contact.html">Free Consultation</a>
        </div>
      </div>
      <nav class="project-nav" aria-label="More projects">
        <a href="/project.html?id=${prev.slug}"><svg class="icon"><use href="#i-left"/></svg> ${prev.title}</a>
        <a href="/project.html?id=${next.slug}">${next.title} <svg class="icon"><use href="#i-right"/></svg></a>
      </nav>`;
  }
}

/* ---------- Blog list (with search filter) ---------- */
const blogList = $('#blog-list');
if (blogList) {
  const q = (new URLSearchParams(location.search).get('s') || '').toLowerCase().trim();
  const found = posts.filter((p) => !q || (p.title + ' ' + p.text).toLowerCase().includes(q));
  const info = $('#blog-search-info');
  if (q && info) {
    info.hidden = false;
    info.innerHTML = `Search results for “${q.replace(/[<>&"]/g, '')}”: ${found.length} found. <a href="/blog.html">Show all posts</a>`;
  }
  blogList.innerHTML = found.length
    ? found
        .map(
          (p) => `
      <article class="post">
        <img src="${img(p.img)}" width="600" height="600" loading="lazy" alt="">
        <div class="post-body">
          <small>${p.date}</small>
          <h3>${p.title}</h3>
          <p>${p.text}</p>
          <a class="btn" href="/coming-soon.html">Read More</a>
        </div>
      </article>`
        )
        .join('')
    : '<p>No posts match your search.</p>';
}

/* ---------- Testimonials carousel ---------- */
const carousel = $('.carousel');
if (carousel) {
  const track = $('.carousel-track', carousel);
  const items = $$('.carousel-track > *', carousel);
  const dotsBox = $('.dots', carousel);
  let c = 0;

  const go = (n) => {
    c = (n + items.length) % items.length;
    track.style.transform = `translateX(calc(-${c} * (100% + var(--tgap, 160px))))`;

    items.forEach((item, k) => {
      item.classList.toggle('active', k === c);
    });

    $$('button', dotsBox).forEach((d, k) => {
      d.classList.toggle('active', k === c);
    });
  };

  items.forEach((_, k) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `Go to testimonial ${k + 1}`);
    b.addEventListener('click', () => go(k));
    dotsBox.appendChild(b);
  });
  let startX = null;
  carousel.addEventListener('pointerdown', (e) => (startX = e.clientX));
  carousel.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 50) go(c + (dx < 0 ? 1 : -1));
    startX = null;
  });
  go(0);
}

/* ---------- Forms (front-end only: validate + friendly confirmation) ---------- */
$$('form[data-form]').forEach((form) => {
  const msg = $('.form-msg', form);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    msg.textContent = 'Thank you! Your message has been received. We will get back to you soon.';
    msg.hidden = false;
    form.reset();
  });
});