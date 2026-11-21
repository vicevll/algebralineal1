/* Álgebra Lineal paso a paso — interacción del curso */
(function () {
  'use strict';
  var KEY = 'algebralineal1-completados';
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } }
  function save(a) { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {} }

  document.addEventListener('DOMContentLoaded', function () {
    var body = document.body;

    /* ---------- menú en móvil ---------- */
    var btn = document.getElementById('menu-btn');
    var overlay = document.getElementById('overlay');
    if (btn) btn.addEventListener('click', function () { body.classList.toggle('menu-open'); });
    if (overlay) overlay.addEventListener('click', function () { body.classList.remove('menu-open'); });
    document.querySelectorAll('.sidebar a').forEach(function (a) {
      a.addEventListener('click', function () { body.classList.remove('menu-open'); });
    });

    /* ---------- capítulos desplegables ---------- */
    document.querySelectorAll('.chap-toggle').forEach(function (t) {
      t.addEventListener('click', function (e) {
        e.preventDefault();
        t.closest('.chap').classList.toggle('open');
      });
    });
    var cur = document.querySelector('.chap.current');
    if (cur) {
      var sb = document.getElementById('sidebar');
      var bottom = cur.offsetTop + cur.offsetHeight;
      if (bottom > sb.clientHeight - 40) sb.scrollTop = cur.offsetTop - 140;
    }

    /* ---------- progreso ---------- */
    function paintProgress() {
      var done = load();
      document.querySelectorAll('[data-chap]').forEach(function (el) {
        var n = parseInt(el.getAttribute('data-chap'), 10);
        if (el.classList.contains('chap') || el.classList.contains('card')) {
          el.classList.toggle('completed', done.indexOf(n) >= 0);
        }
      });
      var t = document.getElementById('prog-text');
      var f = document.getElementById('prog-fill');
      if (t) t.textContent = done.length + ' / 10';
      if (f) f.style.width = (done.length * 10) + '%';
      document.querySelectorAll('.complete-btn').forEach(function (b) {
        var n = parseInt(b.getAttribute('data-chap'), 10);
        var ok = done.indexOf(n) >= 0;
        b.classList.toggle('is-done', ok);
        b.textContent = ok ? '✓ Capítulo completado (clic para desmarcar)' : 'Marcar capítulo como completado';
      });
    }
    document.querySelectorAll('.complete-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        var n = parseInt(b.getAttribute('data-chap'), 10);
        var done = load();
        var i = done.indexOf(n);
        if (i >= 0) done.splice(i, 1); else done.push(n);
        save(done);
        paintProgress();
      });
    });
    paintProgress();

    /* ---------- soluciones ---------- */
    function openSol(id) {
      var d = document.getElementById(id);
      if (d) { d.open = true; }
    }
    document.querySelectorAll('a.ver-sol').forEach(function (a) {
      a.addEventListener('click', function () { openSol(a.getAttribute('data-sol')); });
    });
    if (location.hash && location.hash.indexOf('#sol-') === 0) openSol(location.hash.slice(1));
    var solList = document.querySelector('ol.soluciones');
    if (solList) {
      var tools = document.createElement('div');
      tools.className = 'sol-tools';
      tools.innerHTML = '<button type="button" data-a="open">Mostrar todas las soluciones</button>' +
                        '<button type="button" data-a="close">Ocultar todas</button>';
      solList.parentNode.insertBefore(tools, solList);
      tools.addEventListener('click', function (e) {
        var a = e.target.getAttribute('data-a');
        if (!a) return;
        solList.querySelectorAll('details').forEach(function (d) { d.open = (a === 'open'); });
      });
    }

    /* ---------- sección activa en la barra lateral ---------- */
    var links = {};
    document.querySelectorAll('.chap.current .secs a').forEach(function (a) {
      links[a.getAttribute('data-target')] = a;
    });
    var heads = Array.prototype.slice.call(document.querySelectorAll('.content h2[id]'));
    function spy() {
      var y = window.scrollY + 140, active = null;
      heads.forEach(function (h) { if (h.offsetTop <= y) active = h.id; });
      Object.keys(links).forEach(function (k) { links[k].classList.toggle('active', k === active); });
      var bar = document.getElementById('read-progress');
      if (bar) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
      }
    }
    window.addEventListener('scroll', spy, { passive: true });
    window.addEventListener('resize', spy);
    spy();
  });
})();
