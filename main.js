(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(hover:none)').matches;

  /* ── Menú móvil ── */
  const btn = $('.menu-btn'), menu = $('#menu');
  if (btn) {
    const set = open => { menu.classList.toggle('is-open', open); btn.setAttribute('aria-expanded', String(open)); };
    btn.addEventListener('click', () => set(!menu.classList.contains('is-open')));
    $$('.nav-link').forEach(a => a.addEventListener('click', () => set(false)));
    addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
  }

  /* ── Menú: página/sección actual (punto rosa; nunca azul por defecto) ── */
  const links = $$('.nav-link');
  const setActive = id => links.forEach(a => {
    const on = a.dataset.id === id;
    on ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current');
  });
  const pageId = document.body.dataset.page; // en las páginas de casos
  if (pageId) setActive(pageId);
  else if ($('#inicio')) {
    const map = { inicio: 'inicio', 'sobre-mi': 'sobre-mi', herramientas: 'sobre-mi', proyectos: 'proyectos', contacto: 'contacto' };
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setActive(map[e.target.id])),
      { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(id => { const el = document.getElementById(id); el && io.observe(el); });
  }

  /* ── Foto de portada: 4 fotos, clic las recorre en ciclo ── */
  $$('.slot img').forEach(img => {
    const fail = () => {
      const fb = img.dataset.fallback;
      if (fb && !img.dataset.tried) { img.dataset.tried = '1'; img.src = fb; } else img.remove();
    };
    img.addEventListener('error', fail);
    if (img.complete && img.naturalWidth === 0) fail();   // ya falló antes de que cargara el script
  });
  const photo = $('.photo');
  if (photo) {
    const slots = $$('.slot', photo);
    let i = 0;
    photo.addEventListener('click', () => {
      slots[i].classList.remove('is-on');
      i = (i + 1) % slots.length;
      slots[i].classList.add('is-on');
      photo.setAttribute('aria-label', `Cambiar fotografía (${i + 1} de ${slots.length})`);
      if (coarse) { photo.classList.add('is-blue'); setTimeout(() => photo.classList.remove('is-blue'), 700); }
    });
  }


  /* ── Contacto: el título se revela al entrar en pantalla ── */
  const contact = $('#contacto');
  if (contact) {
    if ('IntersectionObserver' in window) {
      const io2 = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { contact.classList.add('is-in'); io2.disconnect(); } }), { threshold: .25 });
      io2.observe(contact);
    } else contact.classList.add('is-in');
  }

  /* ── Experiencia: en móvil son acordeones (cerrados al inicio); en escritorio siempre abiertos ── */
  const xpBtns = $$('.xp-btn');
  if (xpBtns.length) {
    const mq = matchMedia('(max-width:820px)');
    const apply = () => xpBtns.forEach(b => {
      b.setAttribute('aria-expanded', String(!mq.matches));
      b.tabIndex = mq.matches ? 0 : -1;
      mq.matches ? b.removeAttribute('aria-disabled') : b.setAttribute('aria-disabled', 'true');
    });
    xpBtns.forEach(b => b.addEventListener('click', () => {
      if (!mq.matches) return;
      b.setAttribute('aria-expanded', String(b.getAttribute('aria-expanded') !== 'true'));
    }));
    mq.addEventListener('change', apply);
    apply();
  }

  /* ── Carpetas de proyectos ──
     El orden nunca cambia. Al abrir una, las de adelante bajan al fondo
     y dejan ver su contenido. Misma lógica que el prototipo de Figma. */
  const stack = $('.stack');
  if (stack) {
    const folders = $$('.folder', stack);
    const geo = () => {
      const m = matchMedia('(max-width:820px)').matches;
      const H = stack.clientHeight;
      return m ? { H, BASE: 64, STRIDE: 70, DOCK: 70, CLOSED: Math.floor((H - 64 - 20) / 4) }
               : { H, BASE: 90, STRIDE: 86, DOCK: 76, CLOSED: 190 };
    };
    const yFor = (j, k, g) => k === 0 ? g.BASE + (j - 1) * g.CLOSED
      : j <= k ? g.BASE + (j - 1) * g.STRIDE : g.H - (4 - j + 1) * g.DOCK;
    const render = k => {
      const g = geo();
      stack.dataset.active = k;
      folders.forEach((f, idx) => {
        const j = idx + 1, open = j === k;
        f.style.setProperty('--y', yFor(j, k, g) + 'px');
        f.classList.toggle('is-open', open);
        $('.folder-hit', f).setAttribute('aria-expanded', String(open));
        $('.folder-hit', f).tabIndex = open ? -1 : 0;
        $('.content', f).inert = !open;
      });
    };
    let cur = 0;
    const go = k => { cur = k; render(k); };
    folders.forEach((f, idx) => {
      $('.folder-hit', f).addEventListener('click', () => go(idx + 1));
      $('.close', f).addEventListener('click', () => { go(0); $('.folder-hit', f).focus(); });
    });
    addEventListener('keydown', e => { if (e.key === 'Escape' && cur) go(0); });
    addEventListener('resize', () => render(cur));
    // primer pintado sin animación
    stack.style.setProperty('--x', 0);
    folders.forEach(f => f.style.transition = 'none');
    render(0);
    requestAnimationFrame(() => requestAnimationFrame(() => folders.forEach(f => f.style.transition = '')));
    // enlaces de disciplinas (inicio / herramientas) abren la sección de proyectos
  }
})();
