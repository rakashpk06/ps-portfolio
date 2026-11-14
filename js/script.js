/* Vanilla JS. Everything is visible by default; JS only adds behaviour. */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;

  /* Theme (remembered when storage is allowed) */
  try { const t = localStorage.getItem('theme'); if (t) root.dataset.theme = t; } catch (e) {}
  $('#th').addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
  });

  /* Reading progress + back to top */
  const bar = $('#pbar'), up = $('#up');
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (h > 0 ? scrollY / h * 100 : 0) + '%';
    up.classList.toggle('show', scrollY > 600);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  up.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  /* Mobile menu */
  const links = $('#links'), bg = $('#bg');
  bg.addEventListener('click', () => bg.setAttribute('aria-expanded', links.classList.toggle('open')));
  $$('a', links).forEach(a => a.addEventListener('click', () => { links.classList.remove('open'); bg.setAttribute('aria-expanded', 'false'); }));

  /* Skill meters animate when seen */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.style.width = e.target.dataset.l + '%'; io.unobserve(e.target);
  }), { threshold: .4 });
  $$('.bar i').forEach(i => io.observe(i));

  /* Chapter rail follows the week being read */
  const railLinks = $$('.rail a');
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    railLinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
    const on = $('.rail a.on'); if (on && getComputedStyle($('.rail')).display === 'flex') on.scrollIntoView({ inline: 'center', block: 'nearest' });
  }), { rootMargin: '-30% 0px -60% 0px' });
  $$('.chap').forEach(c => spy.observe(c));

  /* CV checklist counter */
  const cl = $('.cl');
  cl.addEventListener('change', () => { $('#clc').textContent = $$('input:checked', cl).length; });

  /* Quiz: each question can be answered once */
  $$('.q').forEach(q => q.addEventListener('click', e => {
    const o = e.target.closest('.opt'); if (!o || q.dataset.done) return; q.dataset.done = 1;
    $$('.opt', q).forEach(b => b.classList.add(b.dataset.ok === '1' ? 'ok' : 'no'));
    $('.fb', q).hidden = false;
  }));

  /* Gallery filter */
  $$('.filters button').forEach(b => b.addEventListener('click', () => {
    $$('.filters button').forEach(x => x.classList.toggle('on', x === b));
    $$('#gal .shot').forEach(s => s.hidden = b.dataset.f !== 'all' && s.dataset.c !== b.dataset.f);
  }));

  /* Lightbox for any real image slot */
  const lb = $('#lb'), lbi = $('#lbi');
  document.addEventListener('click', e => {
    const img = e.target.closest('.shot img'); if (!img) return;
    lbi.src = img.src; lbi.alt = img.alt; lb.showModal();
  });
  $('#lbx').addEventListener('click', () => lb.close());
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });

  /* Missing images become labelled placeholders */
  $$('img[data-ph]').forEach(img => {
    const fail = () => { const d = document.createElement('div'); d.className = 'ph'; d.textContent = img.dataset.ph; img.replaceWith(d); };
    img.addEventListener('error', fail);
    if (img.complete && !img.naturalWidth) fail();
  });
})();
