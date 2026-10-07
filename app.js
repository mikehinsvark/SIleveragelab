(() => {
  const slides = Array.from(document.querySelectorAll('[data-slide]'));
  const dots = Array.from(document.querySelectorAll('[data-carousel-dot]'));
  const previous = document.querySelector('[data-carousel-prev]');
  const next = document.querySelector('[data-carousel-next]');
  const pauseButton = document.querySelector('[data-carousel-pause]');
  const counter = document.querySelector('[data-carousel-count]');
  const carousel = document.querySelector('.carousel');
  const viewport = document.querySelector('.carousel-viewport');
  const captionLink = document.querySelector('[data-slide-link]');
  const captionNumber = document.querySelector('[data-slide-number]');
  const captionKicker = document.querySelector('[data-slide-kicker]');
  const captionTitle = document.querySelector('[data-slide-title]');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeSlide = 0;
  let intervalId;
  let paused = motionPreference.matches;
  let pointerStart = null;

  const stopAutoplay = () => {
    window.clearInterval(intervalId);
    intervalId = undefined;
  };

  const startAutoplay = (userRequested = false) => {
    stopAutoplay();
    if (paused || document.hidden || slides.length < 2) return;
    if (document.querySelector('[data-video-dialog]')?.open) return;
    if (!userRequested && (carousel?.matches(':hover') || carousel?.contains(document.activeElement))) return;
    intervalId = window.setInterval(() => showSlide(activeSlide + 1), 6500);
  };

  const updatePauseButton = () => {
    if (!pauseButton) return;
    pauseButton.setAttribute('aria-label', paused ? 'Play carousel' : 'Pause carousel');
    pauseButton.setAttribute('aria-pressed', String(paused));
    pauseButton.textContent = paused ? '▶' : 'Ⅱ';
  };

  const showSlide = (index, userInitiated = false) => {
    if (!slides.length) return;
    activeSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const selected = slideIndex === activeSlide;
      slide.classList.toggle('is-active', selected);
      slide.setAttribute('aria-hidden', String(!selected));
    });
    dots.forEach((dot, dotIndex) => {
      const selected = dotIndex === activeSlide;
      dot.classList.toggle('is-active', selected);
      dot.setAttribute('aria-pressed', String(selected));
    });
    const slide = slides[activeSlide];
    if (captionLink) captionLink.setAttribute('href', slide.dataset.href);
    if (captionNumber) captionNumber.textContent = String(activeSlide + 1).padStart(2, '0');
    if (captionKicker) captionKicker.textContent = slide.dataset.kicker;
    if (captionTitle) captionTitle.textContent = slide.dataset.title;
    if (counter) counter.textContent = `${String(activeSlide + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    if (userInitiated) {
      paused = true;
      stopAutoplay();
      updatePauseButton();
    }
  };

  previous?.addEventListener('click', () => showSlide(activeSlide - 1, true));
  next?.addEventListener('click', () => showSlide(activeSlide + 1, true));
  dots.forEach((dot) => dot.addEventListener('click', () => showSlide(Number(dot.dataset.carouselDot), true)));
  pauseButton?.addEventListener('click', () => {
    paused = !paused;
    updatePauseButton();
    if (paused) stopAutoplay();
    else startAutoplay(true);
  });

  carousel?.addEventListener('mouseenter', stopAutoplay);
  carousel?.addEventListener('mouseleave', () => startAutoplay());
  carousel?.addEventListener('focusin', stopAutoplay);
  carousel?.addEventListener('focusout', (event) => {
    if (!carousel.contains(event.relatedTarget)) startAutoplay();
  });
  carousel?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showSlide(activeSlide + (event.key === 'ArrowLeft' ? -1 : 1), true);
    }
  });

  viewport?.addEventListener('pointerdown', (event) => {
    pointerStart = { x: event.clientX, y: event.clientY };
  });
  viewport?.addEventListener('pointerup', (event) => {
    if (!pointerStart) return;
    const horizontal = event.clientX - pointerStart.x;
    const vertical = event.clientY - pointerStart.y;
    pointerStart = null;
    if (Math.abs(horizontal) > 45 && Math.abs(horizontal) > Math.abs(vertical)) {
      showSlide(activeSlide + (horizontal < 0 ? 1 : -1), true);
    }
  });
  viewport?.addEventListener('pointercancel', () => { pointerStart = null; });
  document.addEventListener('intro-video-open', stopAutoplay);
  document.addEventListener('intro-video-close', () => startAutoplay());
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoplay();
    else startAutoplay();
  });
  motionPreference.addEventListener('change', () => {
    if (motionPreference.matches) {
      paused = true;
      stopAutoplay();
      updatePauseButton();
    }
  });

  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();
  showSlide(0);
  updatePauseButton();
  startAutoplay();
})();
