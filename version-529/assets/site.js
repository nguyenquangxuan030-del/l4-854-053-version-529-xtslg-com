(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    function startHero() {
      clearInterval(timer);
      timer = setInterval(function () {
        showSlide(current + 1);
      }, 5000);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        startHero();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        startHero();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        startHero();
      });
    });

    showSlide(0);
    startHero();
  }

  var searchInput = document.querySelector('[data-search-input]');
  var typeFilter = document.querySelector('[data-filter-type]');
  var categoryFilter = document.querySelector('[data-filter-category]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));

  function filterCards() {
    if (!cards.length) {
      return;
    }

    var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    var type = typeFilter ? typeFilter.value : '';
    var category = categoryFilter ? categoryFilter.value : '';

    cards.forEach(function (card) {
      var text = (card.getAttribute('data-tags') || '').toLowerCase();
      var cardType = card.getAttribute('data-type') || '';
      var cardCategory = card.getAttribute('data-category') || '';
      var matchesQuery = !query || text.indexOf(query) !== -1;
      var matchesType = !type || cardType === type;
      var matchesCategory = !category || cardCategory === category;

      card.classList.toggle('is-hidden', !(matchesQuery && matchesType && matchesCategory));
    });
  }

  if (searchInput) {
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');

    if (q) {
      searchInput.value = q;
    }

    searchInput.addEventListener('input', filterCards);
  }

  if (typeFilter) {
    typeFilter.addEventListener('change', filterCards);
  }

  if (categoryFilter) {
    categoryFilter.addEventListener('change', filterCards);
  }

  filterCards();

  var player = document.querySelector('[data-player]');

  if (player) {
    var video = player.querySelector('video');
    var playButton = player.querySelector('[data-play-button]');
    var overlay = player.querySelector('[data-play-overlay]');
    var hlsInstance = null;
    var prepared = false;

    function prepareVideo() {
      if (!video || prepared) {
        return;
      }

      var src = video.getAttribute('data-src');

      if (!src) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        prepared = true;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(src);
        hlsInstance.attachMedia(video);
        prepared = true;
        return;
      }

      video.src = src;
      prepared = true;
    }

    function startVideo() {
      prepareVideo();

      if (!video) {
        return;
      }

      if (overlay) {
        overlay.classList.add('is-hidden');
      }

      video.setAttribute('controls', 'controls');
      var playPromise = video.play();

      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          if (overlay) {
            overlay.classList.remove('is-hidden');
          }
        });
      }
    }

    if (playButton) {
      playButton.addEventListener('click', startVideo);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          startVideo();
        }
      });

      video.addEventListener('ended', function () {
        if (overlay) {
          overlay.classList.remove('is-hidden');
        }
      });
    }

    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }
})();
