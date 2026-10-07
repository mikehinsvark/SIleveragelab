(() => {
  const launcher = document.querySelector('[data-video-open]');
  const dialog = document.querySelector('[data-video-dialog]');
  const video = document.querySelector('[data-intro-video]');
  const closeButton = document.querySelector('[data-video-close]');
  const status = document.querySelector('[data-video-status]');
  const transcript = document.querySelector('[data-video-transcript]');
  if (!launcher || !dialog || !video || typeof dialog.showModal !== 'function') return;

  let returnFocus = launcher;
  let originalOverflow = '';
  let originalPadding = '';

  const showStatus = (message) => {
    if (status) status.textContent = message;
  };
  const closeVideo = () => {
    video.pause();
    dialog.close();
  };

  launcher.addEventListener('click', (event) => {
    event.preventDefault();
    if (dialog.open) return;
    returnFocus = document.activeElement;
    originalOverflow = document.documentElement.style.overflow;
    originalPadding = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const currentPadding = parseFloat(window.getComputedStyle(document.body).paddingRight) || 0;
    document.documentElement.style.overflow = 'hidden';
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
    dialog.showModal();
    launcher.setAttribute('aria-expanded', 'true');
    document.dispatchEvent(new Event('intro-video-open'));
    showStatus('');

    // No source or movie request is assigned until this explicit user action.
    if (!video.getAttribute('src')) video.src = video.dataset.src;
    const playback = video.play();
    playback?.catch(() => {
      if (dialog.open) showStatus('Press Play to start the video.');
    });
  });

  closeButton?.addEventListener('click', closeVideo);
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    const outside = event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom;
    if (outside) closeVideo();
  });
  // Stop sound synchronously on Escape; native dialog supplies focus containment.
  dialog.addEventListener('cancel', () => video.pause());
  dialog.addEventListener('close', () => {
    video.pause();
    if (video.readyState > 0) video.currentTime = 0;
    if (transcript) transcript.open = false;
    showStatus('');
    launcher.setAttribute('aria-expanded', 'false');
    document.documentElement.style.overflow = originalOverflow;
    document.body.style.paddingRight = originalPadding;
    document.dispatchEvent(new Event('intro-video-close'));
    if (returnFocus && typeof returnFocus.focus === 'function') returnFocus.focus({ preventScroll: true });
  });
  video.addEventListener('playing', () => showStatus(''));
  video.addEventListener('error', () => {
    if (dialog.open) showStatus('The video could not load. Please use “Open video separately” below.');
  });
  window.addEventListener('pagehide', () => video.pause());
})();
