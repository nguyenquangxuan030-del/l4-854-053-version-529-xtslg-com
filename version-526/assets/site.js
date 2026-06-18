(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function initMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function initHero() {
    document.querySelectorAll("[data-hero]").forEach(function (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var prev = hero.querySelector("[data-hero-prev]");
      var next = hero.querySelector("[data-hero-next]");
      var index = 0;
      var timer = null;

      function show(nextIndex) {
        if (!slides.length) {
          return;
        }
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          var active = slideIndex === index;
          slide.classList.toggle("is-active", active);
          slide.setAttribute("aria-hidden", active ? "false" : "true");
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === index);
        });
      }

      function restart() {
        if (timer) {
          window.clearInterval(timer);
        }
        timer = window.setInterval(function () {
          show(index + 1);
        }, 5000);
      }

      if (prev) {
        prev.addEventListener("click", function () {
          show(index - 1);
          restart();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(index + 1);
          restart();
        });
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          show(Number(dot.getAttribute("data-hero-dot")) || 0);
          restart();
        });
      });

      show(0);
      restart();
    });
  }

  function initFilters() {
    document.querySelectorAll("[data-filter-input]").forEach(function (input) {
      var section = input.closest("section") || document;
      var cards = Array.prototype.slice.call(section.querySelectorAll("[data-filter-card]"));
      input.addEventListener("input", function () {
        var keyword = input.value.trim().toLowerCase();
        cards.forEach(function (card) {
          var text = (card.getAttribute("data-search") || "").toLowerCase();
          card.classList.toggle("is-hidden", keyword && text.indexOf(keyword) === -1);
        });
      });
    });
  }

  ready(function () {
    initMenu();
    initHero();
    initFilters();
  });
})();

function initMoviePlayer(videoId, overlayId, buttonId, source) {
  var video = document.getElementById(videoId);
  var overlay = document.getElementById(overlayId);
  var button = document.getElementById(buttonId);
  var loaded = false;
  var hls = null;

  if (!video || !source) {
    return;
  }

  function loadSource() {
    if (loaded) {
      return;
    }
    loaded = true;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
    } else if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls();
      hls.loadSource(source);
      hls.attachMedia(video);
    } else {
      video.src = source;
    }
  }

  function startPlayback() {
    loadSource();
    if (overlay) {
      overlay.classList.add("is-hidden");
    }
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {});
    }
  }

  if (overlay) {
    overlay.addEventListener("click", startPlayback);
  }

  if (button) {
    button.addEventListener("click", startPlayback);
  }

  video.addEventListener("click", function () {
    if (!loaded || video.paused) {
      startPlayback();
    }
  });

  window.addEventListener("beforeunload", function () {
    if (hls && typeof hls.destroy === "function") {
      hls.destroy();
    }
  });
}
