// Progressive enhancement: mark JS-enabled
document.documentElement.classList.add('js');

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Simple search demo
const form = document.getElementById('searchForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const q = new FormData(form).get('q')?.trim();
  alert(q ? `Searching for: "${q}"` : 'Type something to search 🙂');
});

/* ---------- Dropdown handling (About + Services) ---------- */
function closeAllDropdowns(except = null) {
  document.querySelectorAll('.has-dropdown.open').forEach((item) => {
    if (item !== except) {
      item.classList.remove('open');
      const btn = item.querySelector('.nav-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
  });
}

document.querySelectorAll('.has-dropdown .nav-btn').forEach((btn) => {
  const parent = btn.closest('.has-dropdown');
  const menu = parent.querySelector('.dropdown');

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const willOpen = !parent.classList.contains('open');
    closeAllDropdowns(willOpen ? parent : null);
    parent.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(willOpen));
  });

  
  menu.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => closeAllDropdowns())
  );
});


document.addEventListener('click', () => closeAllDropdowns());
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAllDropdowns(); });
document.getElementById('q').addEventListener('focus', () => closeAllDropdowns());


const allSections = Array.from(document.querySelectorAll('[data-section]'));
const aboutRoutes   = new Set(['mission','staff','locations','advisory']);
const serviceRoutes = new Set(['borrow','research','reserve']);

function setActiveNav(route){
 
  document.querySelectorAll('.nav-menu a, .nav-btn').forEach(el => el.removeAttribute('aria-current'));

  const link = document.querySelector(`[data-route="${route}"]`);
  if (link) link.setAttribute('aria-current','page');

  
  if (aboutRoutes.has(route)) {
    const aboutBtn = document.querySelector('.has-dropdown .nav-btn[aria-controls="about-submenu"]');
    aboutBtn?.setAttribute('aria-current','page');
  }
  if (serviceRoutes.has(route)) {
    const svcBtn = document.querySelector('.has-dropdown .nav-btn[aria-controls="services-submenu"]');
    svcBtn?.setAttribute('aria-current','page');
  }
}

function showSection(route) {
  let found = false;
  allSections.forEach(sec => {
    const match = sec.dataset.section === route;
    sec.classList.toggle('active', match);
    sec.setAttribute('aria-hidden', match ? 'false' : 'true');
    if (match) found = true;
  });

  if (found) {
    history.pushState(null, '', `#${route}`);
    setActiveNav(route);
    const el = document.querySelector(`[data-section="${route}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}


document.querySelectorAll('[data-route]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const route = link.getAttribute('data-route');
    showSection(route);
  });
});


window.addEventListener('load', () => {
  history.replaceState(null, '', location.pathname + location.search);
  showSection('news');
});


window.addEventListener('keydown', (e) => {
  if (e.key === '/') {
    const q = document.getElementById('q');
    if (document.activeElement !== q) {
      e.preventDefault();
      q.focus();
    }
  }
});
