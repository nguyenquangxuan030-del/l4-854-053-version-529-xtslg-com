(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        initMobileMenu();
        initHero();
        initScrollRows();
        initFilters();
        initSearchQuery();
    });

    function initMobileMenu() {
        var button = document.querySelector(".menu-button");
        var menu = document.getElementById("mobileMenu");

        if (!button || !menu) {
            return;
        }

        button.addEventListener("click", function () {
            var opened = button.getAttribute("aria-expanded") === "true";
            button.setAttribute("aria-expanded", String(!opened));
            button.textContent = opened ? "☰" : "×";
            menu.hidden = opened;
        });
    }

    function initHero() {
        var hero = document.querySelector("[data-hero]");

        if (!hero) {
            return;
        }

        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5000);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
        }

        if (prev) {
            prev.addEventListener("click", function () {
                show(current - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
                start();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                start();
            });
        });

        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function initScrollRows() {
        var wraps = document.querySelectorAll("[data-scroll-wrap]");

        wraps.forEach(function (wrap) {
            var row = wrap.querySelector("[data-scroll-row]");
            var left = wrap.querySelector("[data-scroll-left]");
            var right = wrap.querySelector("[data-scroll-right]");

            if (!row) {
                return;
            }

            if (left) {
                left.addEventListener("click", function () {
                    row.scrollBy({ left: -420, behavior: "smooth" });
                });
            }

            if (right) {
                right.addEventListener("click", function () {
                    row.scrollBy({ left: 420, behavior: "smooth" });
                });
            }
        });
    }

    function initFilters() {
        var input = document.querySelector("[data-filter-input]");
        var type = document.querySelector("[data-type-filter]");
        var cards = Array.prototype.slice.call(document.querySelectorAll(".filter-card"));
        var empty = document.querySelector("[data-empty-state]");

        if (!input || cards.length === 0) {
            return;
        }

        function apply() {
            var keyword = normalize(input.value);
            var typeValue = type ? normalize(type.value) : "";
            var visible = 0;

            cards.forEach(function (card) {
                var text = normalize(card.getAttribute("data-search") || card.textContent || "");
                var cardType = normalize(card.getAttribute("data-type") || "");
                var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
                var matchType = !typeValue || cardType.indexOf(typeValue) !== -1 || text.indexOf(typeValue) !== -1;
                var show = matchKeyword && matchType;

                card.hidden = !show;

                if (show) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.hidden = visible !== 0;
            }
        }

        input.addEventListener("input", apply);

        if (type) {
            type.addEventListener("change", apply);
        }

        apply();
    }

    function initSearchQuery() {
        var input = document.querySelector("[data-filter-input]");

        if (!input) {
            return;
        }

        var params = new URLSearchParams(window.location.search);
        var q = params.get("q");

        if (q) {
            input.value = q;
            input.dispatchEvent(new Event("input", { bubbles: true }));
        }
    }

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    window.initMoviePlayer = function (source) {
        ready(function () {
            var video = document.getElementById("moviePlayer");
            var overlay = document.getElementById("playOverlay");
            var attached = false;
            var hls = null;

            if (!video || !source) {
                return;
            }

            function attach() {
                if (attached) {
                    return;
                }

                attached = true;

                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = source;
                    return;
                }

                if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                    hls.loadSource(source);
                    hls.attachMedia(video);
                    return;
                }

                video.src = source;
            }

            function play() {
                attach();

                if (overlay) {
                    overlay.classList.add("is-hidden");
                    overlay.setAttribute("aria-hidden", "true");
                }

                var promise = video.play();

                if (promise && typeof promise.catch === "function") {
                    promise.catch(function () {});
                }
            }

            if (overlay) {
                overlay.addEventListener("click", play);
            }

            video.addEventListener("play", function () {
                if (overlay) {
                    overlay.classList.add("is-hidden");
                }
            });

            video.addEventListener("click", function () {
                if (video.paused) {
                    play();
                }
            });

            window.addEventListener("beforeunload", function () {
                if (hls) {
                    hls.destroy();
                }
            });
        });
    };
})();
