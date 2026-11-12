(function () {
  'use strict';

  var preloader = document.getElementById('preloader');
  window.addEventListener('load', function () {
    setTimeout(function () { preloader.classList.add('done'); }, 700);
  });
  setTimeout(function () { preloader.classList.add('done'); }, 3500);

  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  var burger = document.getElementById('burger');
  var navLinks = document.getElementById('navLinks');
  burger.addEventListener('click', function () {
    navLinks.classList.toggle('open');
    burger.classList.toggle('active');
  });
  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { navLinks.classList.remove('open'); });
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  document.querySelectorAll('.reveal').forEach(function (el, i) {
    el.style.transitionDelay = (i % 4) * 90 + 'ms';
    io.observe(el);
  });

  var cartCount = document.getElementById('cartCount');
  var toast = document.getElementById('toast');
  var count = 0, toastTimer = null;
  var faDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  function toFa(n) {
    return String(n).split('').map(function (d) { return faDigits[+d] || d; }).join('');
  }
  document.querySelectorAll('.add-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      count++;
      cartCount.textContent = toFa(count);
      var card = btn.closest('.menu-card');
      var name = card ? card.dataset.name : '';
      var price = card ? card.dataset.price : '';
      toast.textContent = '✓ ' + name + ' به سبد اضافه شد (' + price + ' تومان)';
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2400);
      btn.textContent = 'اضافه شد ✓';
      setTimeout(function () { btn.textContent = 'افزودن +'; }, 1400);
    });
  });

  document.getElementById('subscribeForm').addEventListener('submit', function (e) {
    e.preventDefault();
    toast.textContent = '🎉 عضویت انجام شد! کد تخفیف ۲۰٪ برایت ارسال می‌شود.';
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 3000);
    this.reset();
  });

  var dot = document.getElementById('cursorDot');
  var ring = document.getElementById('cursorRing');
  var mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', function (e) {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = 'translate(' + (mx - 3.5) + 'px,' + (my - 3.5) + 'px)';
    var hoverable = e.target.closest('a, button, .menu-card, .g-item, canvas');
    ring.classList.toggle('grow', !!hoverable);
  }, { passive: true });
  (function ringLoop() {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    var size = ring.classList.contains('grow') ? 32 : 18;
    ring.style.transform = 'translate(' + (rx - size) + 'px,' + (ry - size) + 'px)';
    requestAnimationFrame(ringLoop);
  })();
})();
