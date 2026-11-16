document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.navbar nav') || document.querySelector('.topbar nav');
  if (nav && !nav.querySelector('.nav-cta')) {
    const cta = document.createElement('a');
    cta.className = 'nav-cta'; cta.href = nav.closest('.topbar') ? 'quiz.html' : (location.pathname.includes('/pages/') ? 'quiz.html' : 'pages/quiz.html');
    cta.textContent = 'ابدأ الاختبار';
    nav.append(cta);
  }
  if (nav) {
    const current = location.pathname.split('/').pop();
    nav.querySelectorAll('a[href]').forEach(link => {
      try { if (new URL(link.href).pathname.split('/').pop() === current && !link.hash) link.setAttribute('aria-current', 'page'); } catch (_) {}
    });
  }
  let toggle = document.querySelector('.nav-toggle');
  if (nav && !toggle) {
    toggle = document.createElement('button'); toggle.className = 'nav-toggle'; toggle.type = 'button'; toggle.textContent = 'القائمة';
    toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-controls', 'main-navigation'); toggle.setAttribute('aria-label', 'فتح القائمة');
    if (!nav.id) nav.id = 'main-navigation';
    nav.before(toggle);
  }
  if (nav && toggle) {
    const focusable = () => [...nav.querySelectorAll('a,button,[tabindex]:not([tabindex="-1"])')];
    const close = (restore = false) => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'فتح القائمة');
      if (restore) toggle.focus();
    };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
      if (open) focusable()[0]?.focus();
    });
    nav.addEventListener('click', event => { if (event.target.closest('a')) close(); });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) close(true);
      if (event.key !== 'Tab' || !nav.classList.contains('is-open')) return;
      const items = focusable();
      if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items.at(-1)?.focus(); }
      else if (!event.shiftKey && document.activeElement === items.at(-1)) { event.preventDefault(); items[0]?.focus(); }
    });
  }

  const setupUtility = () => {
  const bar = document.querySelector('.fm-bar');
  if (bar && !bar.dataset.csEnhanced) {
    bar.dataset.csEnhanced = 'true';
    const help = document.createElement('button');
    help.className = 'fm-btn'; help.type = 'button'; help.setAttribute('aria-label', 'المساعدة والأسئلة الشائعة'); help.title = 'المساعدة';
    help.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.3 2.3 0 1 1 3.8 1.7c-1 .8-1.6 1.2-1.6 2.8M12 17h.01"/></svg>';
    help.addEventListener('click', () => {
      const faq = document.querySelector('#faq');
      if (faq) faq.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      else location.href = document.documentElement.lang === 'ar' ? '../index.html#faq' : '#';
    });
    const login = bar.querySelector('#fmLogin');
    const settings = bar.querySelector('#fmSettings');
    if (login) login.hidden = false;
    if (settings) settings.hidden = false;
    const colors = bar.querySelector('#fmColors');
    if (colors) colors.setAttribute('aria-label', 'تغيير المظهر');
    bar.append(help);
  }
  };
  window.setTimeout(setupUtility, 0);

  const video = document.querySelector('.video-container video');
  const play = document.querySelector('.video-play');
  if (video && play) {
    const showPlaying = () => { play.hidden = true; video.controls = true; };
    video.addEventListener('play', showPlaying);
    video.addEventListener('error', () => { video.controls = false; video.pause(); play.hidden = false; });
    play.addEventListener('click', () => {
      video.controls = true;
      const attempt = video.play();
      if (attempt?.catch) attempt.catch(() => { video.controls = false; play.hidden = false; });
    });
  }

  document.querySelectorAll('.faq-container').forEach(group => group.addEventListener('toggle', event => {
    const item = event.target;
    if (item.matches('details[open]')) group.querySelectorAll('details[open]').forEach(other => { if (other !== item) other.open = false; });
  }, true));

  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: .12 });
    document.querySelectorAll('.how-step,.tool-card,.field-map-card,.cv-card,.faq-card').forEach(item => { item.classList.add('reveal'); observer.observe(item); });
  }
});
