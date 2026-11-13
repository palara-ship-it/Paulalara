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
  $$('.slot img, img[data-fallback]').forEach(img => {
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
      return m ? { H, BASE: 64, STRIDE: 92, DOCK: 92, CLOSED: Math.floor((H - 64 - 20) / 4) }
               : { H, BASE: 130, STRIDE: 86, DOCK: 76, CLOSED: 190 };
    };
    const yFor = (j, k, g) => k === 0 ? g.BASE + (j - 1) * g.CLOSED
      : j <= k ? g.BASE + (j - 1) * g.STRIDE : g.H - (4 - j + 1) * g.DOCK;
    const render = k => {
      // en celular la carpeta abierta crece para mostrar todo su contenido sin cortarlo
      stack.style.height = '';
      if (k && matchMedia('(max-width:820px)').matches) {
        const g0 = geo(), c = $('.content', folders[k - 1]), sq = $('.sq', c);
        const need = yFor(k, k, g0) + sq.offsetTop + sq.offsetHeight + 40 + (4 - k) * g0.DOCK + 56;
        stack.style.height = Math.max(need, g0.H) + 'px';
      }
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
      $('.close', f).addEventListener('click', () => {
        go(0); $('.folder-hit', f).focus({ preventScroll: true });
        // deja las 4 carpetas a la vista, justo debajo de la barra de navegación
        const nav = document.querySelector('.nav'), nh = nav ? nav.offsetHeight : 0;
        const y = stack.getBoundingClientRect().top + scrollY - nh - 8;
        scrollTo({ top: Math.max(0, y), behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth' });
      });
    });
    addEventListener('keydown', e => { if (e.key === 'Escape' && cur) $('.close', folders[cur - 1]).click(); });
    addEventListener('resize', () => render(cur));
    folders.forEach(f => f.style.transition = 'none');
    render(0);
    requestAnimationFrame(() => requestAnimationFrame(() => folders.forEach(f => f.style.transition = '')));
  }
})();

/* Videos del proceso: si el archivo existe, reemplaza la imagen fija; si no, queda la imagen */
document.querySelectorAll('.proceso').forEach(sec=>{
  const v=sec.querySelector('.vframe video'); if(!v) return;
  const on=()=>{sec.classList.add('has-video');const p=v.play();if(p&&p.catch)p.catch(()=>{});};
  v.addEventListener('loadeddata',on,{once:true});
  if(v.readyState>=2) on();
});


/* ───────── Texto que rueda (split por letras, escalonado) ───────── */
(()=>{
  if(matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const SEL='.nav-link,.cta,.btn-red,.case-foot a,.back,.close,.menu-btn';
  document.querySelectorAll(SEL).forEach(el=>{
    const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.nodeValue.trim()&&!n.parentElement.closest('[aria-hidden="true"]')?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT});
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    if(!nodes.length) return;
    if(!el.hasAttribute('aria-label')) el.setAttribute('aria-label',el.textContent.replace(/\s+/g,' ').trim());
    nodes.forEach(n=>{
      const txt=n.nodeValue.replace(/\s+/g,' ');
      const lead=/^\s/.test(txt)?' ':'', trail=/\s$/.test(txt)&&txt.trim()?' ':'';
      const build=(cls)=>{const s=document.createElement('span');s.className=cls;s.setAttribute('aria-hidden','true');
        [...txt.trim()].forEach((c,i)=>{const ch=document.createElement('span');ch.className='ch';ch.style.setProperty('--i',i);ch.textContent=c;s.appendChild(ch)});return s};
      const wrap=document.createElement('span');wrap.className='roll';
      wrap.append(build('roll-out'),build('roll-in'));
      const frag=document.createDocumentFragment();
      if(lead)frag.append(' ');frag.append(wrap);if(trail)frag.append(' ');
      n.replaceWith(frag);
    });
    el.classList.add('has-roll');
  });
})();

/* ───────── Cursor rosa con resorte (stiffness 120, damping 25, mass 1.3) ───────── */
(()=>{
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const dot=document.createElement('div');dot.className='cursor-dot';dot.setAttribute('aria-hidden','true');document.body.appendChild(dot);
  const K=120,C=25,M=1.3;
  let tx=innerWidth/2,ty=innerHeight/2,x=tx,y=ty,vx=0,vy=0,last=0,run=false,seen=false;
  const step=t=>{
    const dt=Math.min((t-last)/1000||0.016,.04);last=t;
    vx+=((K*(tx-x)-C*vx)/M)*dt;vy+=((K*(ty-y)-C*vy)/M)*dt;x+=vx*dt;y+=vy*dt;
    dot.style.transform=`translate3d(${x}px,${y}px,0)`;
    if(Math.abs(tx-x)+Math.abs(ty-y)+Math.abs(vx)+Math.abs(vy)>.05) requestAnimationFrame(step); else run=false;
  };
  const kick=()=>{if(!run){run=true;last=performance.now();requestAnimationFrame(step)}};
  addEventListener('pointermove',e=>{
    tx=e.clientX;ty=e.clientY;
    if(!seen){seen=true;x=tx;y=ty;dot.style.transform=`translate3d(${x}px,${y}px,0)`;dot.classList.add('is-visible')}
    dot.classList.toggle('is-big',!!e.target.closest('a,button,.tilt,[role="button"]'));
    kick();
  },{passive:true});
  document.documentElement.addEventListener('pointerleave',()=>dot.classList.remove('is-visible'));
  document.documentElement.addEventListener('pointerenter',()=>seen&&dot.classList.add('is-visible'));
})();

/* ───────── Título de portada: split por letras con entrada escalonada ───────── */
(()=>{
  const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const split=(sp,k0)=>{ // parte un texto en letras dentro de <span class="word">
    let k=k0;const text=sp.textContent;sp.textContent='';
    text.split(' ').forEach((w,wi,arr)=>{
      const word=document.createElement('span');word.className='word';word.setAttribute('aria-hidden','true');
      [...w].forEach(c=>{const ch=document.createElement('span');ch.className='char';ch.style.setProperty('--i',k++);ch.textContent=c;word.appendChild(ch)});
      sp.appendChild(word);if(wi<arr.length-1)sp.appendChild(document.createTextNode(' '));
    });return k;
  };
  const title=document.querySelector('.title');
  if(reduce) return;
  if(title){let k=0;title.querySelectorAll('.line>span').forEach(sp=>{k=split(sp,k)});title.classList.add('is-split');}
  // resto de títulos grandes: entran letra por letra al aparecer en pantalla
  const heads=[...document.querySelectorAll('.proj-head h2, .about-exp h2, #tools-title, .contact h2, .exp h2, section h2')].filter((h,i,a)=>a.indexOf(h)===i&&!h.closest('.hero'));
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-in-title');io.unobserve(e.target)}}),{threshold:.3});
  heads.forEach(h=>{
    if(h.classList.contains('title')) return;
    const label=h.getAttribute('aria-label')||h.textContent.replace(/\s+/g,' ').trim();
    h.setAttribute('aria-label',label);h.classList.add('split-h');
    const lines=h.querySelectorAll('.line>span');let k=0;
    if(lines.length){lines.forEach(sp=>{k=split(sp,k)});h.querySelectorAll('.line').forEach(l=>l.classList.add('mask'))}
    else{ // texto con <br>: cada línea en su propia máscara
      const parts=[];h.childNodes.forEach(n=>{if(n.nodeName==='BR')parts.push(null);else parts.push(n.textContent)});
      h.textContent='';let cur=[];const lns=[[]];parts.forEach(p=>{if(p===null)lns.push([]);else lns[lns.length-1].push(p)});
      lns.forEach(l=>{const line=document.createElement('span');line.className='mask';const sp=document.createElement('span');sp.className='ln';sp.textContent=l.join('');k=split(sp,k);line.appendChild(sp);h.appendChild(line)});
    }
    io.observe(h);
  });
})();
