(function () {
  'use strict';

  // Supabase password-recovery links land on the site root; forward them to the admin panel.
  if (/type=recovery|error_code=/.test(location.hash) && !/admin\.html$/.test(location.pathname)) {
    location.replace('admin.html' + location.hash);
    return;
  }

  var PHONE = '+90 212 216 05 92', PHONE_RAW = '+902122160592';
  var EMAIL = 'aylinbingol@abreklamcilik.com';

  // header: solid background after scrolling, mobile menu
  var h = document.getElementById('site-header');
  if (h) {
    var burger = h.querySelector('.burger'), menu = h.querySelector('.menu');
    burger.addEventListener('click', function () {
      var o = menu.classList.toggle('open'); burger.classList.toggle('open', o); burger.setAttribute('aria-expanded', o);
    });
    menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') { menu.classList.remove('open'); burger.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); } });
    var onScroll = function () { h.classList.toggle('scrolled', window.scrollY > 40); };
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  }

  // contact form: preselect the service passed in ?hizmet=
  document.querySelectorAll('[data-service-options]').forEach(function (sel) {
    var q = new URLSearchParams(location.search).get('hizmet');
    if (q) { for (var i = 0; i < sel.options.length; i++) if (sel.options[i].text === q) sel.selectedIndex = i; }
  });

  // reveal on scroll (content is visible without JS; the .js class on <html> enables the effect)
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .12 });
    els.forEach(function (e) { io.observe(e); });
  } else els.forEach(function (e) { e.classList.add('in'); });

  // counters
  var cio = ('IntersectionObserver' in window) && new IntersectionObserver(function (en) {
    en.forEach(function (e) {
      if (!e.isIntersecting) return; cio.unobserve(e.target);
      var el = e.target, to = +el.getAttribute('data-count'), t0 = null;
      (function step(t) {
        if (!t0) t0 = t; var p = Math.min((t - t0) / 1600, 1);
        el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + (el.getAttribute('data-suffix') || '');
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
    });
  }, { threshold: .5 });
  document.querySelectorAll('[data-count]').forEach(function (el) { cio ? cio.observe(el) : (el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '')); });

  // quote form -> Supabase REST API (anon key is public by design; table is insert-only via RLS)
  var SB_URL = 'https://iexwdjvxsuofdctnvmkh.supabase.co', SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlleHdkanZ4c3VvZmRjdG52bWtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExMTUzMDIsImV4cCI6MjEwNjY5MTMwMn0.Oc12f-kG_nwpG9YZc-bsaVqNaw4Jr2SQ_9FTyGkwzA0';
  var form = document.getElementById('quote-form');
  if (form) {
    var note = document.getElementById('form-note'), btn = form.querySelector('button[type=submit]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      if (d.get('website')) return; // honeypot
      var row = { ad: d.get('ad'), firma: d.get('firma') || null, telefon: d.get('tel'), eposta: d.get('mail'), hizmet: d.get('hizmet') || null, mesaj: d.get('mesaj') || null };
      btn.disabled = true; note.style.color = ''; note.textContent = 'Gönderiliyor...';
      fetch(SB_URL + '/rest/v1/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, Prefer: 'return=minimal' },
        body: JSON.stringify(row)
      }).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        form.reset(); note.style.color = '#2e7d32';
        note.textContent = 'Talebiniz alındı. En kısa sürede sizinle iletişime geçeceğiz. Teşekkür ederiz!';
      }).catch(function () {
        note.style.color = '#b3261e';
        note.innerHTML = 'Gönderilemedi. Lütfen bizi arayın: <a href="tel:' + PHONE_RAW + '">' + PHONE + '</a> veya <a href="mailto:' + EMAIL + '">e-posta</a> gönderin.';
      }).finally(function () { btn.disabled = false; });
    });
  }
})();
