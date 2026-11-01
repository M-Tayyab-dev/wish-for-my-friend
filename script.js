(function () {
  'use strict';
  var d = document, root = d.documentElement;
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var fine = !!(window.matchMedia && matchMedia('(pointer: fine)').matches);
  function $(s, c) { return (c || d).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }
  function safe(fn) { try { fn(); } catch (e) { if (window.console) console.warn(e); } }
  function rand(a, b) { return a + Math.random() * (b - a); }

  /* ---------- language: rm = Roman Urdu, en = English, ur = Urdu ---------- */
  var LANGS = ['rm', 'en', 'ur'];
  var DICT = window.ZEERA_I18N || {};
  function pickLang() {
    var h = (window.location.hash || '').replace('#', '');
    if (LANGS.indexOf(h) >= 0) return h;
    try { var s = localStorage.getItem('zeera-lang'); if (LANGS.indexOf(s) >= 0) return s; } catch (e) {}
    return 'rm';
  }
  var lang = pickLang();
  function tr(key) { var e = DICT[key]; if (!e) return key; return e[LANGS.indexOf(lang)] || e[0]; }
  function digits(n) {
    if (lang !== 'ur') return String(n);
    return String(n).replace(/\d/g, function (c) { return '۰۱۲۳۴۵۶۷۸۹'.charAt(+c); });
  }

  function split(el) {
    var text = el.textContent;
    el.setAttribute('aria-label', text);
    el.textContent = '';
    var i = 0;
    text.split(' ').forEach(function (word, wi, arr) {
      var w = d.createElement('span'); w.className = 'w'; w.setAttribute('aria-hidden', 'true');
      word.split('').forEach(function (ch) {
        var s = d.createElement('span'); s.className = 'l'; s.textContent = ch; s.style.setProperty('--i', i++); w.appendChild(s);
      });
      el.appendChild(w);
      if (wi < arr.length - 1) el.appendChild(d.createTextNode(' '));
    });
  }

  function apply(userSwitch) {
    root.setAttribute('lang', lang === 'ur' ? 'ur' : (lang === 'en' ? 'en' : 'ur-Latn'));
    root.setAttribute('dir', lang === 'ur' ? 'rtl' : 'ltr');
    root.setAttribute('data-lang', lang);
    $$('[data-i18n]').forEach(function (el) {
      el.innerHTML = tr(el.getAttribute('data-i18n'));
      el.classList.remove('urin');
      if (el.hasAttribute('data-split')) {
        el.removeAttribute('aria-label');
        if (lang === 'ur') el.classList.add('urin'); else split(el);
      }
    });
    $$('[data-i18n-aria]').forEach(function (el) { el.setAttribute('aria-label', tr(el.getAttribute('data-i18n-aria'))); });
    $$('.lang button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false'); });
    $$('a[href]').forEach(function (a) {
      var h = a.getAttribute('href');
      if (/^[\w-]+\.html(#\w+)?$/.test(h)) a.setAttribute('href', h.replace(/#\w+$/, '') + '#' + lang);
    });
    if (userSwitch && !reduce) {
      var m = $('main');
      if (m) { m.classList.remove('langfade'); void m.offsetWidth; m.classList.add('langfade'); }
    }
    d.dispatchEvent(new CustomEvent('zeera:lang', { detail: lang }));
  }
  function setLang(l) {
    lang = l;
    try { localStorage.setItem('zeera-lang', l); } catch (e) {}
    try { history.replaceState(null, '', '#' + l); } catch (e) {}
    apply(true);
  }
  safe(function () {
    $$('.lang button').forEach(function (b) {
      b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
    });
  });

  /* ---------- page curtain: wipe out when leaving ---------- */
  safe(function () {
    var curtain = $('.curtain');
    if (!curtain) return;
    d.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#' || a.target === '_blank' || /^[a-z]+:/i.test(href)) return;
      if (reduce) return;
      e.preventDefault();
      curtain.classList.add('leaving');
      setTimeout(function () { window.location.href = href; }, 650);
    });
    window.addEventListener('pageshow', function (e) { if (e.persisted) curtain.classList.remove('leaving'); });
  });

  root.classList.add('js-on');

  /* ---------- scroll reveal ---------- */
  safe(function () {
    var items = $$('.rv');
    items.forEach(function (el) {
      var n = 0, s = el.previousElementSibling;
      while (s) { if (s.classList.contains('rv')) n++; s = s.previousElementSibling; }
      el.style.setProperty('--i', n % 6);
    });
    if (!('IntersectionObserver' in window) || reduce) { items.forEach(function (el) { el.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting || e.boundingClientRect.top < 0) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -3% 0px' });
    items.forEach(function (el) { io.observe(el); });
    /* safety net: never leave anything near the viewport hidden */
    function sweep() {
      var vh = window.innerHeight;
      items.forEach(function (el) {
        if (!el.classList.contains('in') && el.getBoundingClientRect().top < vh * 1.1) el.classList.add('in');
      });
    }
    setTimeout(sweep, 1800);
    window.addEventListener('scroll', function () { clearTimeout(sweep.t); sweep.t = setTimeout(sweep, 400); }, { passive: true });
  });

  /* ---------- cursor spotlight ---------- */
  safe(function () {
    if (!fine) return;
    var gx = 0, gy = 0, pend = false;
    window.addEventListener('pointermove', function (e) {
      gx = e.clientX; gy = e.clientY;
      if (pend) return; pend = true;
      requestAnimationFrame(function () {
        root.style.setProperty('--mx', gx + 'px'); root.style.setProperty('--my', gy + 'px'); pend = false;
      });
    }, { passive: true });
  });

  /* ---------- 3D tilt ---------- */
  safe(function () {
    if (!fine || reduce) return;
    $$('[data-tilt]').forEach(function (el) {
      el.classList.add('tilt');
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(900px) rotateY(' + (x * 12).toFixed(2) + 'deg) rotateX(' + (-y * 12).toFixed(2) + 'deg)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  });

  /* ---------- magnetic buttons ---------- */
  safe(function () {
    if (!fine || reduce) return;
    $$('[data-magnet]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2);
        el.style.translate = (x * 0.2).toFixed(1) + 'px ' + (y * 0.3).toFixed(1) + 'px';
      });
      el.addEventListener('pointerleave', function () { el.style.translate = ''; });
    });
  });

  /* ---------- floating cumin seeds ---------- */
  safe(function () {
    var cv = $('#seeds');
    if (!cv || !cv.getContext) return;
    var ctx = cv.getContext('2d'), dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, seeds = [], mx = -999, my = -999, running = true, visible = true;
    var cols = ['#c79a52', '#9a6a33', '#f6a81c', '#b07a3a', '#e0b56a'];
    function size() {
      var r = cv.getBoundingClientRect(); W = r.width; H = r.height;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.max(18, Math.min(70, Math.round(W * H / 14000)));
      seeds = [];
      for (var i = 0; i < n; i++) {
        var z = rand(0.35, 1);
        seeds.push({ x: rand(0, W), y: rand(0, H), len: 3.5 + z * 7, z: z, a: rand(0, 6.28), va: rand(-0.01, 0.01), vy: 0.12 + z * 0.4,
          ph: rand(0, 6.28), sw: rand(0.4, 1.4), ox: 0, oy: 0, c: cols[(Math.random() * cols.length) | 0] });
      }
    }
    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      seeds.forEach(function (s) {
        if (!reduce) {
          s.y += s.vy; s.a += s.va;
          if (s.y > H + 20) { s.y = -20; s.x = rand(0, W); }
        }
        var dx = s.x - mx, dy = s.y - my, dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130 && dist > 0) { var f = (130 - dist) / 130 * 2.2; s.ox += dx / dist * f; s.oy += dy / dist * f; }
        s.ox *= 0.92; s.oy *= 0.92;
        var x = s.x + Math.sin(t / 1000 * s.sw + s.ph) * 14 * s.z + s.ox, y = s.y + s.oy;
        ctx.save(); ctx.translate(x, y); ctx.rotate(s.a); ctx.globalAlpha = 0.35 + s.z * 0.55; ctx.fillStyle = s.c;
        ctx.beginPath(); ctx.ellipse(0, 0, s.len, s.len * 0.36, 0, 0, 6.2832); ctx.fill();
        ctx.strokeStyle = 'rgba(19,12,8,.45)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-s.len * 0.7, 0); ctx.lineTo(s.len * 0.7, 0); ctx.stroke();
        ctx.restore();
      });
    }
    function loop(t) { if (running && visible) draw(t); requestAnimationFrame(loop); }
    size();
    window.addEventListener('resize', size);
    cv.parentNode.addEventListener('pointermove', function (e) { var r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
    cv.parentNode.addEventListener('pointerleave', function () { mx = my = -999; });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(cv);
    d.addEventListener('visibilitychange', function () { running = !d.hidden; });
    if (reduce) { draw(0); return; }
    requestAnimationFrame(loop);
  });

  /* ---------- scroll-lit statement ---------- */
  safe(function () {
    var el = $('.wfill');
    if (!el) return;
    var spans = [];
    function update() {
      var r = el.getBoundingClientRect(), vh = window.innerHeight;
      var p = (vh * 0.85 - r.top) / (r.height + vh * 0.25);
      p = Math.max(0, Math.min(1, p));
      var n = Math.round(p * spans.length);
      spans.forEach(function (s, i) { s.classList.toggle('on', i < n || reduce); });
    }
    function build() {
      var text = tr(el.getAttribute('data-i18n-words'));
      el.setAttribute('aria-label', text);
      el.textContent = '';
      var words = text.split(/\s+/);
      spans = words.map(function (w, i) {
        var s = d.createElement('span');
        s.className = 'wd' + (/zeera|tadka|زیرا|تڑکا|flavour|cumin/i.test(w) ? ' hot' : '');
        s.setAttribute('aria-hidden', 'true'); s.textContent = w; el.appendChild(s);
        if (i < words.length - 1) el.appendChild(d.createTextNode(' '));
        return s;
      });
      update();
    }
    var tick = false;
    window.addEventListener('scroll', function () { if (tick) return; tick = true; requestAnimationFrame(function () { update(); tick = false; }); }, { passive: true });
    window.addEventListener('resize', update);
    d.addEventListener('zeera:lang', build);
    build();
  });

  /* ---------- gallery: filters + lightbox ---------- */
  safe(function () {
    var roll = $('.roll');
    if (!roll) return;
    var all = $$('.polaroid', roll);
    $$('.chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var f = chip.getAttribute('data-filter');
        $$('.chip').forEach(function (c) { c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
        all.forEach(function (p, i) {
          var show = f === 'all' || p.getAttribute('data-kind') === f;
          p.hidden = !show;
          p.classList.remove('pop');
          if (show) { p.classList.add('in'); void p.offsetWidth; p.style.animationDelay = (i * 40) + 'ms'; p.classList.add('pop'); }
        });
      });
    });

    var lb = $('#lb'), img = $('#lbImg'), cap = $('#lbCap'), count = $('#lbCount'), closeBtn = $('#lbClose');
    var list = [], cur = 0, last = null;
    function show(n) {
      cur = (n + list.length) % list.length;
      var p = list[cur], im = $('img', p);
      img.classList.add('swap');
      setTimeout(function () {
        img.src = im.src; img.alt = im.alt;
        cap.textContent = $('figcaption', p).textContent;
        count.textContent = (cur + 1 < 10 ? '0' : '') + (cur + 1) + ' / ' + (list.length < 10 ? '0' : '') + list.length;
        img.classList.remove('swap');
      }, reduce ? 0 : 120);
    }
    function open(p) {
      list = all.filter(function (x) { return !x.hidden; });
      last = d.activeElement;
      lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); d.body.classList.add('lb-open');
      show(list.indexOf(p));
      closeBtn.focus();
    }
    function close() {
      lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); d.body.classList.remove('lb-open');
      if (last && last.focus) last.focus();
    }
    roll.addEventListener('click', function (e) {
      var p = e.target.closest('.polaroid');
      if (p) open(p);
    });
    closeBtn.addEventListener('click', close);
    $('#lbPrev').addEventListener('click', function () { show(cur - 1); });
    $('#lbNext').addEventListener('click', function () { show(cur + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb-stage')) close(); });
    d.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(cur - 1);
      else if (e.key === 'ArrowRight') show(cur + 1);
    });
    var sx = null;
    lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx; sx = null;
      if (Math.abs(dx) > 60) show(cur + (dx < 0 ? 1 : -1));
    });
  });

  /* ---------- wishes: cake + confetti ---------- */
  safe(function () {
    var cake = $('#cake');
    if (!cake) return;
    var btn = $('#blow'), btnTxt = $('#blowTxt'), msg = $('#msg'), cv = $('#confetti'), ctx = cv.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2), W = 0, H = 0, parts = [], running = false;
    var palette = ['#f6a81c', '#d93a22', '#5fae7e', '#f7ecdc', '#c79a52', '#ff7a45'];
    function fit() { W = window.innerWidth; H = window.innerHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    fit(); window.addEventListener('resize', fit);
    function burst(x, y, n) {
      for (var i = 0; i < n; i++) {
        var ang = -Math.PI / 2 + rand(-1.1, 1.1), sp = rand(6, 16), k = Math.random();
        parts.push({ x: x, y: y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, w: rand(6, 14), h: rand(4, 9), r: rand(0, 6.28), vr: rand(-0.3, 0.3),
          c: palette[(Math.random() * palette.length) | 0], t: k < 0.25 ? 's' : k < 0.5 ? 'c' : 'r', life: 0, max: rand(110, 200) });
      }
      if (!running) { running = true; requestAnimationFrame(tick); }
    }
    function tick() {
      ctx.clearRect(0, 0, W, H);
      parts = parts.filter(function (p) { return p.life < p.max && p.y < H + 40; });
      parts.forEach(function (p) {
        p.vy += 0.28; p.vx *= 0.992; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life++;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.globalAlpha = Math.min(1, (p.max - p.life) / 40); ctx.fillStyle = p.c;
        if (p.t === 'c') { ctx.beginPath(); ctx.arc(0, 0, p.h / 1.6, 0, 6.2832); ctx.fill(); }
        else if (p.t === 's') { ctx.beginPath(); ctx.ellipse(0, 0, p.w / 2, p.h / 3.2, 0, 0, 6.2832); ctx.fill(); }
        else { ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); }
        ctx.restore();
      });
      if (parts.length) requestAnimationFrame(tick); else { running = false; ctx.clearRect(0, 0, W, H); }
    }
    var out = false;
    function render(pop) {
      btnTxt.innerHTML = tr(out ? 'w.relight' : 'w.blow');
      msg.innerHTML = tr(out ? 'w.msg1' : 'w.msg0');
      msg.classList.remove('pop');
      if (pop) { void msg.offsetWidth; msg.classList.add('pop'); }
    }
    function toggle() {
      out = !out;
      cake.classList.toggle('out', out);
      render(out);
      if (out && !reduce) {
        var r = cake.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height * 0.3;
        burst(x, y, 90);
        setTimeout(function () { burst(W * 0.2, H * 0.75, 50); }, 250);
        setTimeout(function () { burst(W * 0.8, H * 0.75, 50); }, 450);
      }
    }
    btn.addEventListener('click', toggle);
    cake.addEventListener('click', toggle);
    d.addEventListener('zeera:lang', function () { render(false); });
  });

  /* ---------- dua page: light a candle ---------- */
  safe(function () {
    var btn = $('#diyaBtn');
    if (!btn) return;
    var box = $('#diyas'), cnt = $('#diyaCount'), n = 0, MAX = 60;
    try { n = Math.min(parseInt(localStorage.getItem('zeera-diyas') || '0', 10) || 0, MAX); } catch (e) {}
    var SVG = '<svg viewBox="0 0 60 60" aria-hidden="true"><g transform="translate(30,37)"><g class="flame" style="--k:K"><circle cx="0" cy="-9" r="15" fill="rgba(246,168,28,.28)"/><path d="M0 0 C-6 -7 -4 -15 0 -22 C4 -15 6 -7 0 0Z" fill="#f6a81c"/><path d="M0 -1 C-2.5 -5 -1.5 -9 0 -13 C1.5 -9 2.5 -5 0 -1Z" fill="#fff3c4"/></g></g><path d="M8 40 C8 51 18 57 30 57 C42 57 52 51 52 40 Z" fill="#c4622d"/><ellipse cx="30" cy="40" rx="22" ry="4.5" fill="#e08a4a"/><ellipse cx="30" cy="40.5" rx="17" ry="2.6" fill="#7a3411"/></svg>';
    function add(delay) {
      var s = d.createElement('div'); s.className = 'diya';
      s.style.animationDelay = delay + 'ms';
      s.innerHTML = SVG.replace('K', String(box.children.length % 5));
      box.appendChild(s);
    }
    function label() { cnt.textContent = n ? tr('d.count').replace('{n}', digits(n)) : tr('d.zero'); }
    for (var i = 0; i < n; i++) add(i * 60);
    btn.addEventListener('click', function () {
      if (n >= MAX) return;
      n++; add(0);
      try { localStorage.setItem('zeera-diyas', String(n)); } catch (e) {}
      label();
    });
    d.addEventListener('zeera:lang', label);
    label();
  });

  /* apply the chosen language last, so every block above can react to it */
  apply(false);
})();
