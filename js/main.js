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

  /* Generic scroll-snap carousel controls */
  document.querySelectorAll('[data-carousel]').forEach(function (root) {
    var track = root.querySelector('[data-carousel-track]');
    var prev = root.querySelector('[data-carousel-prev]');
    var next = root.querySelector('[data-carousel-next]');
    if (!track) return;
    function cardWidth() {
      var card = track.querySelector(':scope > *');
      return card ? card.getBoundingClientRect().width + 16 : track.clientWidth;
    }
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -cardWidth(), behavior: 'smooth' }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: cardWidth(), behavior: 'smooth' }); });
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

  /* Tawk.to live chat: load only when the visitor opts in via the chat launcher (facade pattern) */
  var chatLauncher = document.querySelector('.chat-launcher');
  if (chatLauncher) {
    var chatLoaded = false;
    var loadChat = function () {
      if (chatLoaded) return;
      chatLoaded = true;
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();
      window.Tawk_API.onLoad = function () {
        if (window.Tawk_API.maximize) window.Tawk_API.maximize();
      };
      var s1 = document.createElement('script');
      var s0 = document.getElementsByTagName('script')[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/665db6f8981b6c564777f747/1hvf15eol';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    };
    chatLauncher.addEventListener('click', loadChat);
  }
})();
