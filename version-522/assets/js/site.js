(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var navPanel = document.querySelector('[data-nav-panel]');

  if (menuButton && navPanel) {
    menuButton.addEventListener('click', function () {
      navPanel.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    var show = function (nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });

      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    };

    var play = function () {
      if (timer) {
        clearInterval(timer);
      }

      timer = setInterval(function () {
        show(index + 1);
      }, 5000);
    };

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        play();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        play();
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        play();
      });
    });

    play();
  }

  var pageFilter = document.querySelector('[data-page-filter]');

  if (pageFilter) {
    pageFilter.addEventListener('input', function () {
      var value = pageFilter.value.trim().toLowerCase();
      var cards = document.querySelectorAll('.filter-target .movie-card');

      cards.forEach(function (card) {
        var text = ((card.getAttribute('data-title') || '') + ' ' + (card.getAttribute('data-meta') || '')).toLowerCase();
        card.classList.toggle('is-hidden', value && text.indexOf(value) === -1);
      });
    });
  }
})();
