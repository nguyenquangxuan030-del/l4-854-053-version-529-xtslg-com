(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function initMenu() {
    var button = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-nav]');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  function initHero() {
    var root = document.querySelector('[data-hero]');
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-dot]'));
    var prev = root.querySelector('[data-hero-prev]');
    var next = root.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(target) {
      index = (target + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }

    function restart() {
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(parseInt(dot.getAttribute('data-hero-dot'), 10));
        restart();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        restart();
      });
    }

    show(0);
    restart();
  }

  function initCatalog() {
    var panels = Array.prototype.slice.call(document.querySelectorAll('.content-section'));
    panels.forEach(function (panel) {
      var cards = Array.prototype.slice.call(panel.querySelectorAll('.movie-card'));
      if (!cards.length) {
        return;
      }
      var search = panel.querySelector('.catalog-search');
      var filters = Array.prototype.slice.call(panel.querySelectorAll('.catalog-filter'));
      var empty = panel.querySelector('[data-empty]');

      function readCard(card, name) {
        return (card.getAttribute('data-' + name) || '').toLowerCase();
      }

      function apply() {
        var keyword = search ? search.value.trim().toLowerCase() : '';
        var active = {};
        filters.forEach(function (filter) {
          var key = filter.getAttribute('data-filter');
          active[key] = filter.value.toLowerCase();
        });
        var visible = 0;
        cards.forEach(function (card) {
          var haystack = [
            readCard(card, 'title'),
            readCard(card, 'tags'),
            readCard(card, 'region'),
            readCard(card, 'type'),
            readCard(card, 'category'),
            readCard(card, 'year')
          ].join(' ');
          var ok = !keyword || haystack.indexOf(keyword) !== -1;
          Object.keys(active).forEach(function (key) {
            if (active[key] && readCard(card, key) !== active[key]) {
              ok = false;
            }
          });
          card.style.display = ok ? '' : 'none';
          if (ok) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle('visible', visible === 0);
        }
      }

      if (search) {
        search.addEventListener('input', apply);
      }
      filters.forEach(function (filter) {
        filter.addEventListener('change', apply);
      });
      apply();
    });
  }

  ready(function () {
    initMenu();
    initHero();
    initCatalog();
  });
})();
