(() => {
  const navigation = document.querySelector('[data-page-navigator]');
  if (!navigation) return;
  const up = navigation.querySelector('[data-scroll-up]');
  const down = navigation.querySelector('[data-scroll-down]');
  const markers = Array.from(navigation.querySelectorAll('[data-page-stop]'));
  const status = navigation.querySelector('[data-scroll-status]');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let framePending = false;

  const positions = () => {
    const maximum = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const headerOffset = (document.querySelector('.site-header')?.getBoundingClientRect().height || 0) + 12;
    return markers.map((marker, index) => {
      if (index === 0) return 0;
      if (index === markers.length - 1) return maximum;
      const element = document.querySelector(marker.dataset.pageStop);
      if (!element) return 0;
      return Math.min(maximum, Math.max(0, element.getBoundingClientRect().top + window.scrollY - headerOffset));
    });
  };

  const goTo = (position) => {
    window.scrollTo({ top: position, behavior: motion.matches ? 'instant' : 'smooth' });
  };

  const move = (direction) => {
    const stops = positions();
    const current = window.scrollY;
    if (direction > 0) {
      goTo(stops.find((position) => position > current + 8) ?? stops[stops.length - 1]);
    } else {
      goTo(stops.slice().reverse().find((position) => position < current - 8) ?? 0);
    }
  };

  const update = () => {
    const stops = positions();
    let active = 0;
    stops.forEach((position, index) => {
      if (Math.abs(position - window.scrollY) <= Math.abs(stops[active] - window.scrollY)) active = index;
    });
    markers.forEach((marker, index) => {
      const selected = index === active;
      marker.classList.toggle('is-active', selected);
      if (selected) marker.setAttribute('aria-current', 'step');
      else marker.removeAttribute('aria-current');
    });
    const disableUp = window.scrollY <= 2;
    const disableDown = window.scrollY >= stops[stops.length - 1] - 2;
    if ((disableUp && document.activeElement === up) || (disableDown && document.activeElement === down)) {
      navigation.focus({ preventScroll: true });
    }
    if (up) up.disabled = disableUp;
    if (down) down.disabled = disableDown;
    if (status) status.textContent = `${String(active + 1).padStart(2, '0')} / ${String(stops.length).padStart(2, '0')}`;
    framePending = false;
  };

  const requestUpdate = () => {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(update);
  };

  up?.addEventListener('click', () => move(-1));
  down?.addEventListener('click', () => move(1));
  markers.forEach((marker, index) => marker.addEventListener('click', () => goTo(positions()[index])));
  navigation.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      move(event.key === 'ArrowUp' ? -1 : 1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      const stops = positions();
      goTo(event.key === 'Home' ? 0 : stops[stops.length - 1]);
    }
  });
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  window.addEventListener('load', requestUpdate);
  document.fonts?.ready.then(requestUpdate);
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(requestUpdate).observe(document.body);
  update();
})();
