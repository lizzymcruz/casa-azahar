/* Motion layer: Lenis smooth scroll + GSAP ScrollTrigger.
   Everything here is optional decoration: content is fully visible without it,
   and nothing runs when the visitor prefers reduced motion or turns motion off
   in the accessibility panel. */
(function () {
  'use strict';
  var html = document.documentElement;
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  var lenis = null, ctx = null;
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduced = function () { return html.classList.contains('a-motion'); };

  function start() {
    if (reduced() || ctx) return;
    html.classList.add('js-anim');
    if (window.Lenis) {
      lenis = new Lenis({ duration: 1.1, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      /* freeze the page behind the date picker and mobile menu */
      new MutationObserver(function () { if (!lenis) return; var b = document.body.classList; (b.contains('dp-open') || b.contains('menu-open')) ? lenis.stop() : lenis.start(); }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
      gsap.ticker.add(function (t) { lenis && lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
      $$('a[href^="#"]').forEach(function (a) { a.addEventListener('click', function (e) { var id = a.getAttribute('href'); if (id.length > 1 && document.querySelector(id)) { e.preventDefault(); lenis.scrollTo(id, { offset: -80 }); } }); });
    }
    ctx = gsap.context(function () {
      /* hero: words rise, media settles */
      var hero = document.querySelector('[data-hero]');
      if (hero) {
        var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
        tl.from($$('.w > span', hero), { yPercent: 115, duration: 1.2, stagger: 0.06 })
          .from($$('[data-hero-fade]', hero), { y: 24, autoAlpha: 0, duration: 1, stagger: 0.1 }, '-=0.9');
        $$('[data-hero-media]').forEach(function (m) { tl.fromTo(m, { scale: 1.12 }, { scale: 1, duration: 2.2, ease: 'power3.out' }, 0); });
      }
      /* headings: word-by-word reveal when they enter */
      $$('[data-split]:not([data-hero] [data-split])').forEach(function (h) {
        gsap.from($$('.w > span', h), { yPercent: 110, duration: 1, ease: 'expo.out', stagger: 0.04, scrollTrigger: { trigger: h, start: 'top 88%' } });
      });
      /* generic fade-up */
      $$('[data-reveal]').forEach(function (el) {
        gsap.from(el, { y: 36, autoAlpha: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
      });
      /* staggered children (cards, lists) */
      $$('[data-stagger]').forEach(function (el) {
        gsap.from(el.children, { y: 40, autoAlpha: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: el, start: 'top 88%' } });
      });
      /* image reveal: curtain wipes up while the photo eases out of a zoom */
      $$('.reveal-img').forEach(function (w) {
        var img = w.querySelector('img');
        var t = gsap.timeline({ scrollTrigger: { trigger: w, start: 'top 85%' } });
        t.fromTo(w, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut' });
        if (img) t.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 1.6, ease: 'expo.out' }, 0.1);
      });
      /* parallax drift */
      $$('[data-parallax]').forEach(function (el) {
        var amt = parseFloat(el.dataset.parallax) || 0.12;
        gsap.fromTo(el, { yPercent: -amt * 50 }, { yPercent: amt * 50, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
      /* section transition: framed image opens to full bleed as you scroll in */
      $$('[data-open]').forEach(function (el) {
        gsap.fromTo(el, { clipPath: 'inset(10% 14% 10% 14%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 20%', scrub: true } });
      });
      /* numbers count up */
      $$('[data-count]').forEach(function (el) {
        var end = parseFloat(el.dataset.count), o = { v: 0 }, suffix = el.dataset.suffix || '';
        gsap.to(o, { v: end, duration: 1.6, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%' }, onUpdate: function () { el.textContent = Math.round(o.v) + suffix; } });
      });
      /* horizontal room rail on wide screens */
      var rail = document.querySelector('[data-rail]');
      if (rail && window.matchMedia('(min-width: 1024px)').matches) {
        var track = rail.querySelector('[data-rail-track]');
        var dist = function () { return Math.max(0, track.scrollWidth - rail.clientWidth); };
        if (dist() > 40) gsap.to(track, { x: function () { return -dist(); }, ease: 'none', scrollTrigger: { trigger: rail, start: 'top 15%', end: function () { return '+=' + dist(); }, scrub: 0.6, pin: true, invalidateOnRefresh: true } });
      }
    });
    addEventListener('load', function () { ScrollTrigger.refresh(); });
  }
  function stop() {
    if (ctx) { ctx.revert(); ctx = null; }
    if (lenis) { lenis.destroy(); lenis = null; }
    html.classList.remove('js-anim');
  }
  document.addEventListener('a11y:change', function () { if (reduced()) stop(); else start(); });
  /* text size changes the layout, so recalculate trigger positions */
  document.addEventListener('a11y:change', function () { setTimeout(function () { ScrollTrigger.refresh(); }, 60); });
  start();
})();
