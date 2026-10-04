(function () {
  'use strict';

  // Supabase password-recovery links land on the site root; forward them to the admin panel.
  if (/type=recovery|error_code=/.test(location.hash) && !/admin\.html$/.test(location.pathname)) {
    location.replace('admin.html' + location.hash);
    return;
  }

  var PHONE = '+90 212 216 05 92', PHONE_RAW = '+902122160592';
  var MOBILE = '+90 532 235 46 36', MOBILE_RAW = '+905322354636', WA = '905322354636';
  var EMAIL = 'aylinbingol@abreklamcilik.com';
  var PAGES = [
    ['index.html', 'Ana Sayfa'], ['hakkimizda.html', 'Hakkımızda'], ['hizmetler.html', 'Hizmetler'],
    ['referanslar.html', 'Referanslar'], ['iletisim.html', 'İletişim']
  ];
  var REFS = [
    ['demak', 'Demak'], ['fenerbahce', 'Fenerbahçe'], ['profilo-avm', 'Profilo Alışveriş Merkezi'],
    ['electro-world', 'Electro World'], ['vera', 'Vera'], ['panasonic', 'Panasonic'], ['kipling', 'Kipling'],
    ['misirli-triko', 'Mısırlı Triko'], ['naturelgaz', 'Naturelgaz'], ['vodkar', 'Vodkar'], ['yuksel', 'Yüksel'],
    ['tartarini', 'Tartarini'], ['profilo-turkuaz', 'Profilo Turkuaz Koy Evleri'], ['profilo-60', 'Profilo'],
    ['panorama-towers', 'Panorama Towers']
  ];
  var I = {
    poster: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h4"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M9 7h6"/>',
    mag: '<path d="M3 5h8a2 2 0 0 1 2 2v13H5a2 2 0 0 1-2-2zM13 7h8v11a2 2 0 0 1-2 2h-6"/><path d="M6 9h4M6 13h4"/>',
    box: '<path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M3 7l9 5 9-5M12 12v10"/>',
    sign: '<rect x="2" y="4" width="20" height="11" rx="1.5"/><path d="M8 20h8M12 15v5M6 9h8M6 12h5"/>',
    print: '<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
    factory: '<path d="M3 21V10l6 4v-4l6 4V6h6v15z"/><path d="M7 21v-3M12 21v-3M17 21v-3"/>',
    video: '<rect x="2" y="6" width="14" height="12" rx="2"/><path d="M16 10l6-3v10l-6-3z"/>',
    tv: '<rect x="2" y="5" width="20" height="13" rx="2"/><path d="M8 21h8M9 2l3 3 3-3"/>',
    event: '<path d="M3 20h18M5 20V9l7-6 7 6v11"/><path d="M10 20v-6h4v6"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 6-7"/><path d="M16 7h4v4"/>',
    gift: '<rect x="3" y="8" width="18" height="4"/><path d="M5 12v9h14v-9M12 8v13M12 8S10 3 7.500 3a2.500 2.500 0 0 0 0 5zM12 8s2-5 4.500-5a2.500 2.500 0 0 1 0 5z"/>',
    pin: '<path d="M12 22s7-6.500 7-12a7 7 0 0 0-14 0c0 5.500 7 12 7 12z"/><circle cx="12" cy="10" r="2.500"/>',
    phone: '<path d="M5 3h4l2 5-2.500 1.500a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    print2: '<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>'
  };
  function icon(n) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (I[n] || '') + '</svg>'; }

  var GROUPS = [
    ['Tasarım', '01', [
      ['Afiş Tasarımları + Baskısı', 'poster', 'Dikkat çeken, markanızı sokakta ve mağazada öne çıkaran afişler; tasarımdan baskıya tek elden.'],
      ['Katalog ve Broşür Tasarımları + Baskısı', 'book', 'Ürün ve hizmetlerinizi satışa dönüştüren, profesyonel katalog ve broşürler.'],
      ['Dergi Tasarımları', 'mag', 'Kurumsal ve sektörel dergiler için okunaklı, şık ve markanıza özel editoryal tasarım.'],
      ['Ambalaj Tasarımları', 'box', 'Rafta fark edilen, ürününüzün değerini yansıtan ambalaj ve paket tasarımları.']
    ]],
    ['Baskı & Üretim', '02', [
      ['Matbaa, Ofset ve Dijital Baskı', 'print', 'Küçük ya da büyük tirajlı işlerde yüksek kalite, renk doğruluğu ve zamanında teslim.'],
      ['Fabrikalar İçin Büyük Koli Kutu Baskısı', 'factory', 'Üretim tesisleri için büyük adetli, dayanıklı ve markalı koli ve kutu baskısı.'],
      ['Promosyon Ürünler', 'gift', 'Markanızı müşterinizin elinde, masasında ve hatırasında yaşatan promosyon ürünleri.']
    ]],
    ['Medya & Reklam', '03', [
      ['Açık Hava Reklam Hizmetleri', 'sign', 'Billboard, tabela ve giydirme çözümleriyle şehrin her noktasında görünür olun.'],
      ['Gazete, Dergi, Radyo ve Tv Reklam Tasarım Çalışmaları', 'tv', 'Tüm mecralar için bütünlüklü, akılda kalıcı ve dönüşüm odaklı reklam kampanyaları.'],
      ['Medya Satın Alma Hizmeti', 'chart', 'Doğru mecra, doğru zaman, doğru bütçe: reklam yatırımınızın geri dönüşünü artırıyoruz.']
    ]],
    ['Prodüksiyon & Etkinlik', '04', [
      ['Video Çekimi ve Prodüksiyon', 'video', 'Tanıtım filmleri, reklam spotları ve kurumsal videolar; fikirden kurguya komple prodüksiyon.'],
      ['Etkinlik ve Organizasyon', 'event', 'Lansman, fuar ve kurumsal organizasyonlarınızı baştan sona sorunsuz yönetiyoruz.']
    ]]
  ];
  var FEATURED = ['Afiş Tasarımları + Baskısı', 'Katalog ve Broşür Tasarımları + Baskısı', 'Ambalaj Tasarımları', 'Açık Hava Reklam Hizmetleri', 'Video Çekimi ve Prodüksiyon', 'Medya Satın Alma Hizmeti'];

  function card(s, withLink) {
    return '<article class="card reveal"><div class="ico">' + icon(s[1]) + '</div><h3>' + s[0] + '</h3><p>' + s[2] + '</p>' +
      (withLink ? '<a class="more" href="iletisim.html?hizmet=' + encodeURIComponent(s[0]) + '">Teklif Al →</a>' : '') + '</article>';
  }
  function allServices() { var a = []; GROUPS.forEach(function (g) { g[2].forEach(function (s) { a.push(s); }); }); return a; }

  var cur = (location.pathname.split('/').pop() || 'index.html');
  if (cur === '') cur = 'index.html';

  function brand(light) {
    return '<a class="brand" href="index.html" aria-label="AB Reklamcılık Ana Sayfa"><img src="assets/img/ab-mark-light.svg" alt="AB"><span>REKLAMCILIK</span></a>';
  }

  // header
  var h = document.getElementById('site-header');
  if (h) {
    h.className = 'site';
    h.innerHTML = '<div class="container nav">' + brand() + '<button class="burger" aria-label="Menü" aria-expanded="false"><span></span></button><nav class="menu" id="menu">' +
      PAGES.map(function (p) { return '<a href="' + p[0] + '"' + (p[0] === cur ? ' class="active"' : '') + '>' + p[1] + '</a>'; }).join('') +
      '<a class="btn btn-gold" href="iletisim.html">Teklif Al</a></nav></div>';
    var burger = h.querySelector('.burger'), menu = h.querySelector('.menu');
    burger.addEventListener('click', function () {
      var o = menu.classList.toggle('open'); burger.classList.toggle('open', o); burger.setAttribute('aria-expanded', o);
    });
    menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') { menu.classList.remove('open'); burger.classList.remove('open'); } });
    var onScroll = function () { h.classList.toggle('scrolled', window.scrollY > 40); };
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  }

  // footer + floating buttons
  var f = document.getElementById('site-footer');
  if (f) {
    f.className = 'site-wrap';
    f.innerHTML = '<footer class="site"><div class="container f-grid">' +
      '<div>' + brand() + '<p>Zorlu piyasa şartlarında en iyi hedeflere ulaşmanızı sağlayan reklam ajansı. Tasarımdan baskıya, medyadan prodüksiyona tek noktadan tam hizmet.</p></div>' +
      '<div><h4>Sayfalar</h4><ul>' + PAGES.map(function (p) { return '<li><a href="' + p[0] + '">' + p[1] + '</a></li>'; }).join('') + '</ul></div>' +
      '<div><h4>Hizmetler</h4><ul>' + FEATURED.map(function (n) { return '<li><a href="hizmetler.html">' + n.replace(' + Baskısı', '') + '</a></li>'; }).join('') + '</ul></div>' +
      '<div><h4>İletişim</h4><ul>' +
      '<li>Cemal Sahir Cad. Altan Erbulak Sok.<br>Beşyol Apt. No:2/1<br>Mecidiyeköy / İstanbul</li>' +
      '<li>T: <a href="tel:' + PHONE_RAW + '">' + PHONE + '</a></li>' +
      '<li>M: <a href="tel:' + MOBILE_RAW + '">' + MOBILE + '</a></li>' +
      '<li><a href="mailto:' + EMAIL + '">' + EMAIL + '</a></li></ul></div></div>' +
      '<div class="f-band">AB Grafik Tasarımı ve Reklamcılık Paz. Tic. Ltd. Şti. &copy; ' + new Date().getFullYear() + '</div></footer>' +
      '<div class="float-btns"><a class="fab wa" href="https://wa.me/' + WA + '?text=' + encodeURIComponent('Merhaba, hizmetleriniz hakkında bilgi almak istiyorum.') + '" target="_blank" rel="noopener" aria-label="WhatsApp">' +
      '<svg viewBox="0 0 32 32"><path d="M16 3a13 13 0 0 0-11.100 19.700L3 29l6.500-1.700A13 13 0 1 0 16 3zm0 2.400a10.600 10.600 0 1 1-5.400 19.700l-.4-.2-3.800 1 1-3.700-.3-.4A10.600 10.600 0 0 1 16 5.400zm-4 5.300c-.3 0-.7.100-1 .5-.4.400-1.300 1.300-1.300 3.100s1.300 3.600 1.500 3.900c.2.200 2.600 4.100 6.400 5.600 3.200 1.200 3.800 1 4.500.9.700-.1 2.200-.9 2.500-1.800.3-.9.300-1.600.2-1.800-.1-.2-.4-.3-.8-.5s-2.200-1.100-2.500-1.200c-.3-.1-.6-.2-.8.200-.2.400-1 1.200-1.200 1.500-.2.200-.4.300-.8.100s-1.600-.6-3-1.800c-1.100-1-1.900-2.200-2.100-2.600-.2-.4 0-.6.200-.8l.6-.7c.2-.2.200-.4.400-.6.100-.3.100-.5 0-.7-.1-.2-.8-2-1.100-2.700-.3-.7-.6-.6-.8-.6z"/></svg></a>' +
      '<a class="fab tel" href="tel:' + MOBILE_RAW + '" aria-label="Ara"><svg viewBox="0 0 24 24">' + I.phone + '</svg></a></div>';
  }

  // services rendering
  document.querySelectorAll('[data-services]').forEach(function (el) {
    var mode = el.getAttribute('data-services');
    if (mode === 'featured') {
      el.innerHTML = allServices().filter(function (s) { return FEATURED.indexOf(s[0]) > -1; }).map(function (s) { return card(s, false); }).join('');
    } else if (mode === 'groups') {
      el.innerHTML = GROUPS.map(function (g) {
        return '<div class="group"><div class="group-title reveal"><span>' + g[1] + '</span><h2>' + g[0] + '</h2></div><div class="grid ' + (g[2].length === 2 ? 'g2' : 'g3') + '">' +
          g[2].map(function (s) { return card(s, true); }).join('') + '</div></div>';
      }).join('');
    }
  });
  document.querySelectorAll('[data-service-options]').forEach(function (sel) {
    sel.innerHTML = '<option value="">Hizmet seçiniz</option>' + allServices().map(function (s) { return '<option>' + s[0] + '</option>'; }).join('') + '<option>Diğer / Birden fazla hizmet</option>';
    var q = new URLSearchParams(location.search).get('hizmet');
    if (q) { for (var i = 0; i < sel.options.length; i++) if (sel.options[i].text === q) sel.selectedIndex = i; }
  });

  // references
  var track = document.getElementById('logo-track');
  if (track) {
    var html = REFS.map(function (r) { return '<img src="assets/img/refs/' + r[0] + '.png" alt="' + r[1] + '" loading="lazy">'; }).join('');
    track.innerHTML = html + html;
  }
  var rg = document.getElementById('ref-grid');
  if (rg) {
    rg.innerHTML = REFS.map(function (r, i) {
      return '<div class="ref reveal" style="transition-delay:' + (i % 5) * 70 + 'ms"><img src="assets/img/refs/' + r[0] + '.png" alt="' + r[1] + '" loading="lazy"></div>';
    }).join('');
  }

  // reveal
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
