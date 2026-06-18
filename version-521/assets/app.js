(function () {
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      const isOpen = mobileNav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
    });
  }

  const hero = document.querySelector('[data-hero]');
  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    const previous = hero.querySelector('[data-hero-prev]');
    const next = hero.querySelector('[data-hero-next]');
    let current = 0;
    let timer = null;

    const activate = function (index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    };

    const schedule = function () {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        activate(current + 1);
      }, 5000);
    };

    if (previous) {
      previous.addEventListener('click', function () {
        activate(current - 1);
        schedule();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        activate(current + 1);
        schedule();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        activate(Number(dot.dataset.heroDot || 0));
        schedule();
      });
    });

    activate(0);
    schedule();
  }

  const searchInput = document.querySelector('[data-search-input]');
  const yearFilter = document.querySelector('[data-filter-year]');
  const regionFilter = document.querySelector('[data-filter-region]');
  const categoryFilter = document.querySelector('[data-filter-category]');
  const cards = Array.from(document.querySelectorAll('.movie-card, .rank-item'));

  const applyFilters = function () {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const year = yearFilter ? yearFilter.value.trim() : '';
    const region = regionFilter ? regionFilter.value.trim() : '';
    const category = categoryFilter ? categoryFilter.value.trim() : '';

    cards.forEach(function (card) {
      const text = [
        card.dataset.title,
        card.dataset.region,
        card.dataset.year,
        card.dataset.genre,
        card.dataset.category,
        card.dataset.tags,
        card.textContent
      ].join(' ').toLowerCase();
      const matchesQuery = !query || text.indexOf(query) !== -1;
      const matchesYear = !year || String(card.dataset.year || '').indexOf(year) === 0;
      const matchesRegion = !region || String(card.dataset.region || '').indexOf(region) !== -1;
      const matchesCategory = !category || String(card.dataset.category || '').indexOf(category) !== -1;
      card.classList.toggle('is-hidden', !(matchesQuery && matchesYear && matchesRegion && matchesCategory));
    });
  };

  [searchInput, yearFilter, regionFilter, categoryFilter].forEach(function (control) {
    if (control) {
      control.addEventListener('input', applyFilters);
      control.addEventListener('change', applyFilters);
    }
  });

  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get('q');
  if (initialQuery && searchInput) {
    searchInput.value = initialQuery;
    applyFilters();
  }
})();
