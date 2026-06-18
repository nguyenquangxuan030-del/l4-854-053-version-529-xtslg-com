(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setupNavigation() {
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.querySelector(".mobile-nav");
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      menu.hidden = isOpen;
    });
  }

  function setupSearchForms() {
    document.querySelectorAll(".search-form").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = form.querySelector("input[name='q']");
        var query = input ? input.value.trim() : "";
        var target = "search.html";
        if (query) {
          target += "?q=" + encodeURIComponent(query);
        }
        window.location.href = target;
      });
    });
  }

  function setupHero() {
    var slider = document.querySelector("[data-hero-slider]");
    if (!slider) {
      return;
    }
    var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(slider.querySelectorAll(".hero-dot"));
    var prev = slider.querySelector(".hero-prev");
    var next = slider.querySelector(".hero-next");
    var index = 0;
    var timer;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function restart() {
      window.clearInterval(timer);
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
        show(Number(dot.getAttribute("data-slide")) || 0);
        restart();
      });
    });
    show(0);
    restart();
  }

  function normalize(value) {
    return String(value || "").toLowerCase();
  }

  function setupFilters() {
    document.querySelectorAll(".filter-scope").forEach(function (scope) {
      var input = scope.querySelector(".filter-input");
      var selects = Array.prototype.slice.call(scope.querySelectorAll(".filter-select"));
      var reset = scope.querySelector(".filter-reset");
      var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));
      var empty = scope.querySelector(".empty-state");
      var params = new URLSearchParams(window.location.search);
      var initialQuery = params.get("q") || "";
      if (input && initialQuery) {
        input.value = initialQuery;
      }

      function matchesSelect(card, select) {
        var value = select.value;
        var field = select.getAttribute("data-filter-field");
        if (!value || !field) {
          return true;
        }
        var data = card.getAttribute("data-" + field) || "";
        return normalize(data).indexOf(normalize(value)) !== -1;
      }

      function apply() {
        var query = input ? normalize(input.value.trim()) : "";
        var visible = 0;
        cards.forEach(function (card) {
          var text = normalize([
            card.getAttribute("data-title"),
            card.getAttribute("data-region"),
            card.getAttribute("data-type"),
            card.getAttribute("data-year"),
            card.getAttribute("data-genre"),
            card.getAttribute("data-tags"),
            card.getAttribute("data-category")
          ].join(" "));
          var passText = !query || text.indexOf(query) !== -1;
          var passSelects = selects.every(function (select) {
            return matchesSelect(card, select);
          });
          var pass = passText && passSelects;
          card.hidden = !pass;
          if (pass) {
            visible += 1;
          }
        });
        if (empty) {
          empty.hidden = visible !== 0;
        }
      }

      if (input) {
        input.addEventListener("input", apply);
      }
      selects.forEach(function (select) {
        select.addEventListener("change", apply);
      });
      if (reset) {
        reset.addEventListener("click", function () {
          if (input) {
            input.value = "";
          }
          selects.forEach(function (select) {
            select.value = "";
          });
          apply();
        });
      }
      apply();
    });
  }

  function setupPlayers() {
    document.querySelectorAll(".player").forEach(function (player) {
      var video = player.querySelector("video");
      var overlay = player.querySelector(".player-overlay");
      var stream = player.getAttribute("data-stream");
      var prepared = false;
      var hls;

      if (!video || !overlay || !stream) {
        return;
      }

      function showOverlay() {
        overlay.classList.remove("is-hidden");
      }

      function hideOverlay() {
        overlay.classList.add("is-hidden");
      }

      function prepare() {
        if (prepared) {
          return;
        }
        prepared = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = stream;
          return;
        }
        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(stream);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal) {
              if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                hls.startLoad();
              } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                hls.recoverMediaError();
              } else {
                overlay.querySelector("strong").textContent = "重新播放";
                showOverlay();
              }
            }
          });
          return;
        }
        video.src = stream;
      }

      function startPlayback() {
        prepare();
        hideOverlay();
        var attempt = video.play();
        if (attempt && typeof attempt.catch === "function") {
          attempt.catch(function () {
            showOverlay();
          });
        }
      }

      overlay.addEventListener("click", startPlayback);
      video.addEventListener("click", function () {
        if (video.paused) {
          startPlayback();
        }
      });
      video.addEventListener("play", hideOverlay);
      video.addEventListener("pause", function () {
        if (!video.ended) {
          showOverlay();
        }
      });
      video.addEventListener("ended", showOverlay);
      window.addEventListener("pagehide", function () {
        if (hls) {
          hls.destroy();
        }
      });
    });
  }

  ready(function () {
    setupNavigation();
    setupSearchForms();
    setupHero();
    setupFilters();
    setupPlayers();
  });
})();
