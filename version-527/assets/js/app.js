(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var carousel = document.querySelector('[data-hero-carousel]');

  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var prev = carousel.querySelector('[data-hero-prev]');
    var next = carousel.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, itemIndex) {
        slide.classList.toggle('is-active', itemIndex === index);
      });

      dots.forEach(function (dot, itemIndex) {
        dot.classList.toggle('is-active', itemIndex === index);
      });
    }

    function startTimer() {
      clearInterval(timer);
      timer = setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(index - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(index + 1);
        startTimer();
      });
    }

    dots.forEach(function (dot, itemIndex) {
      dot.addEventListener('click', function () {
        showSlide(itemIndex);
        startTimer();
      });
    });

    showSlide(0);
    startTimer();
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-scroll-row]')).forEach(function (row) {
    var block = row.closest('.section-block');
    var left = block ? block.querySelector('[data-scroll-left]') : null;
    var right = block ? block.querySelector('[data-scroll-right]') : null;

    if (left) {
      left.addEventListener('click', function () {
        row.scrollBy({ left: -320, behavior: 'smooth' });
      });
    }

    if (right) {
      right.addEventListener('click', function () {
        row.scrollBy({ left: 320, behavior: 'smooth' });
      });
    }
  });

  Array.prototype.slice.call(document.querySelectorAll('[data-filter-form]')).forEach(function (form) {
    var scope = form.parentElement || document;
    var list = scope.querySelector('[data-card-list]') || document.querySelector('[data-card-list]');

    if (!list) {
      return;
    }

    var searchInput = form.querySelector('[data-search-input]');
    var genreSelect = form.querySelector('[data-genre-select]');
    var yearInput = form.querySelector('[data-year-input]');
    var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card, .rank-item'));

    function valueOf(node) {
      return node ? node.value.trim().toLowerCase() : '';
    }

    function applyFilter() {
      var keyword = valueOf(searchInput);
      var genre = valueOf(genreSelect);
      var year = valueOf(yearInput);

      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-tags')
        ].join(' ').toLowerCase();
        var cardYear = (card.getAttribute('data-year') || '').toLowerCase();
        var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        var matchGenre = !genre || haystack.indexOf(genre) !== -1;
        var matchYear = !year || cardYear.indexOf(year) !== -1;

        card.classList.toggle('is-hidden', !(matchKeyword && matchGenre && matchYear));
      });
    }

    [searchInput, genreSelect, yearInput].forEach(function (input) {
      if (input) {
        input.addEventListener('input', applyFilter);
        input.addEventListener('change', applyFilter);
      }
    });
  });

  Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(function (player) {
    var video = player.querySelector('video');
    var button = player.querySelector('[data-player-start]');
    var started = false;
    var hlsInstance = null;

    function begin() {
      if (!video || started) {
        return;
      }

      started = true;
      player.classList.add('is-playing');

      var stream = video.getAttribute('data-stream');

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({ enableWorker: true });
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
          video.play().catch(function () {});
        });
      } else {
        video.src = stream;
        video.play().catch(function () {});
      }
    }

    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        begin();
      });
    }

    player.addEventListener('click', function (event) {
      if (!started && !event.target.closest('a')) {
        begin();
      }
    });

    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });
})();
