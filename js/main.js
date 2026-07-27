(function () {
  'use strict';

  /* Mobile nav toggle */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      links.classList.toggle('is-open', !open);
    });
    links.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        links.classList.remove('is-open');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        toggle.setAttribute('aria-expanded', 'false');
        links.classList.remove('is-open');
        toggle.focus();
      }
    });
  }

  /* Footer year */
  var yearEl = document.getElementById('current_year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Stats counter, animated once when scrolled into view */
  var counters = document.querySelectorAll('.counter');
  if (counters.length && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.dataset.target; });
  }

  function animateCounter(el) {
    var target = parseFloat(el.dataset.target);
    var isFloat = target % 1 !== 0;
    var duration = 1400;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = target * eased;
      el.textContent = isFloat ? value.toFixed(1) : Math.floor(value);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = isFloat ? target.toFixed(1) : target;
    }
    requestAnimationFrame(step);
  }

  /* Infinite-feeling scroll-snap carousel: clones of the real cards are placed
     before and after the real set, so prev/next always animate a single step
     in the direction clicked. Once that step lands on a clone, we silently
     (no animation) snap to the identical-looking real card underneath it, so
     looping never shows a long slide back to the start. */
  document.querySelectorAll('[data-carousel]').forEach(function (root) {
    var track = root.querySelector('[data-carousel-track]');
    var prev = root.querySelector('[data-carousel-prev]');
    var next = root.querySelector('[data-carousel-next]');
    if (!track) return;

    var originals = Array.prototype.slice.call(track.children);
    var count = originals.length;
    if (count < 2) return;

    var beforeClones = document.createDocumentFragment();
    var afterClones = document.createDocumentFragment();
    originals.forEach(function (node) {
      var b = node.cloneNode(true);
      b.setAttribute('aria-hidden', 'true');
      b.setAttribute('inert', '');
      beforeClones.appendChild(b);
      var a = node.cloneNode(true);
      a.setAttribute('aria-hidden', 'true');
      a.setAttribute('inert', '');
      afterClones.appendChild(a);
    });
    track.insertBefore(beforeClones, track.firstChild);
    track.appendChild(afterClones);

    var index = count; // land on the first real card, past the prepended clone block

    function stepWidth() {
      var card = track.children[0];
      return card ? card.getBoundingClientRect().width + 16 : track.clientWidth;
    }
    function setPosition(i, smooth) {
      track.scrollTo({ left: i * stepWidth(), behavior: smooth ? 'smooth' : 'auto' });
    }
    function normalize() {
      if (index >= count * 2) { index -= count; setPosition(index, false); }
      else if (index < count) { index += count; setPosition(index, false); }
    }

    setPosition(index, false);

    if ('onscrollend' in window) {
      track.addEventListener('scrollend', normalize);
    } else {
      var scrollTimer;
      track.addEventListener('scroll', function () {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(normalize, 150);
      });
    }

    if (prev) prev.addEventListener('click', function () { index -= 1; setPosition(index, true); });
    if (next) next.addEventListener('click', function () { index += 1; setPosition(index, true); });
  });

  /* Typeform embed: load only when the visitor opts in (facade pattern avoids
     third-party cookies/scripts for visitors who never intend to fill the form) */
  document.querySelectorAll('[data-tf-trigger]').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var panel = trigger.closest('.contact-cta__panel');
      if (!panel) return;
      var placeholder = panel.querySelector('[data-tf-placeholder]');
      var frame = document.createElement('div');
      frame.className = 'tf-embed-frame';
      frame.setAttribute('data-tf-live', trigger.dataset.tfTrigger);
      panel.appendChild(frame);
      if (placeholder) placeholder.remove();
      if (!document.querySelector('script[data-typeform]')) {
        var s = document.createElement('script');
        s.src = 'https://embed.typeform.com/next/embed.js';
        s.async = true;
        s.dataset.typeform = 'true';
        document.body.appendChild(s);
      }
    });
  });
})();
