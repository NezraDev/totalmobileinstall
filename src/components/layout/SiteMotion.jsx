import { useEffect } from 'react';

const arrivalGroups = [
  [
    '.section-heading, .split-copy, .contact-copy, .legal-copy, .closing-cta > .container',
    'copy',
  ],
  ['.editorial-photo, .why-photo', 'media'],
  ['.service-grid > .service-card, .photo-grid > .photo-tile', 'collection'],
];

/** Progressive enhancement: content stays visible without observers or motion. */
export default function SiteMotion({ routeKey }) {
  useEffect(() => {
    const header = document.querySelector('.site-header');
    let frame;
    const update = () => {
      if (header) header.dataset.scrolled = String(window.scrollY > 16);
      frame = undefined;
    };
    const onScroll = () => {
      if (frame === undefined) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame !== undefined) cancelAnimationFrame(frame);
      header?.removeAttribute('data-scrolled');
    };
  }, []);

  useEffect(() => {
    const main = document.getElementById('main-content');
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!main || !('IntersectionObserver' in window)) return;
    let intersection;
    let mutations;
    let registered = new WeakSet();

    const finishArrival = (event) => {
      if (
        event.target.hasAttribute('data-arrival') &&
        event.animationName.startsWith('premium-arrive-')
      ) {
        event.target.classList.remove('motion-arrived');
        event.target.dataset.motionSeen = 'true';
      }
    };

    const stop = () => {
      intersection?.disconnect();
      mutations?.disconnect();
      main.removeEventListener('animationend', finishArrival);
      main.querySelectorAll('[data-arrival]').forEach((element) => {
        element.classList.remove('motion-arrived');
        element.removeAttribute('data-arrival');
        element.removeAttribute('data-motion-seen');
        element.style.removeProperty('--arrival-delay');
      });
      registered = new WeakSet();
    };

    const start = () => {
      stop();
      if (preference.matches) return;
      intersection = new IntersectionObserver(
        (entries) => {
          entries.forEach(({ target, isIntersecting }) => {
            if (!isIntersecting) return;
            intersection.unobserve(target);
            if (document.hidden || target.contains(document.activeElement)) {
              target.dataset.motionSeen = 'true';
              return;
            }
            target.classList.add('motion-arrived');
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -24px 0px' },
      );

      const register = (root) => {
        if (
          !(root instanceof Element) ||
          root.closest('.map-canvas, .photo-hero')
        )
          return;
        arrivalGroups.forEach(([selector, kind]) => {
          const matches = [...root.querySelectorAll(selector)];
          if (root.matches(selector)) matches.unshift(root);
          matches.forEach((element) => {
            if (
              registered.has(element) ||
              element.closest('.map-canvas, .photo-hero')
            )
              return;
            registered.add(element);
            const rect = element.getBoundingClientRect();
            // The first viewport has its own route/hero sequence. Do not replay it.
            if (rect.top < innerHeight * 0.92 || rect.height === 0) return;
            element.dataset.arrival = kind;
            if (kind === 'collection') {
              const index = [...element.parentElement.children].indexOf(
                element,
              );
              element.style.setProperty(
                '--arrival-delay',
                `${Math.min(index * 55, 165)}ms`,
              );
            }
            intersection.observe(element);
          });
        });
      };

      main.addEventListener('animationend', finishArrival);
      register(main);
      mutations = new MutationObserver((records) => {
        records.forEach(({ addedNodes }) => addedNodes.forEach(register));
      });
      mutations.observe(main, { childList: true, subtree: true });
    };

    start();
    preference.addEventListener('change', start);
    return () => {
      preference.removeEventListener('change', start);
      stop();
    };
  }, [routeKey]);

  return null;
}
