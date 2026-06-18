(function () {
    var menuButton = document.querySelector(".menu-toggle");
    var mobileNav = document.querySelector(".mobile-nav");
    if (menuButton && mobileNav) {
        menuButton.addEventListener("click", function () {
            mobileNav.classList.toggle("open");
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var current = 0;
    var timer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle("active", i === current);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle("active", i === current);
        });
    }

    function nextSlide() {
        showSlide(current + 1);
    }

    function resetTimer() {
        if (timer) {
            clearInterval(timer);
        }
        if (slides.length > 1) {
            timer = setInterval(nextSlide, 5000);
        }
    }

    var prevButton = document.querySelector("[data-hero-prev]");
    var nextButton = document.querySelector("[data-hero-next]");
    if (prevButton) {
        prevButton.addEventListener("click", function () {
            showSlide(current - 1);
            resetTimer();
        });
    }
    if (nextButton) {
        nextButton.addEventListener("click", function () {
            showSlide(current + 1);
            resetTimer();
        });
    }
    dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
            showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
            resetTimer();
        });
    });
    resetTimer();

    function filterCards(root, value) {
        var query = (value || "").trim().toLowerCase();
        var cards = root.querySelectorAll(".movie-card");
        cards.forEach(function (card) {
            var haystack = [
                card.getAttribute("data-title"),
                card.getAttribute("data-region"),
                card.getAttribute("data-type"),
                card.getAttribute("data-year"),
                card.getAttribute("data-tags")
            ].join(" ").toLowerCase();
            card.style.display = haystack.indexOf(query) === -1 ? "none" : "";
        });
    }

    document.querySelectorAll(".filter-page").forEach(function (page) {
        var input = page.querySelector(".js-search");
        if (!input) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var initial = params.get("q") || "";
        if (initial) {
            input.value = initial;
            filterCards(page, initial);
        }
        input.addEventListener("input", function () {
            filterCards(page, input.value);
        });
    });

    window.startMoviePlayer = function (videoId, coverId, streamUrl) {
        var video = document.getElementById(videoId);
        var cover = document.getElementById(coverId);
        if (!video || !streamUrl) {
            return;
        }
        var ready = false;
        var hls = null;

        function attach() {
            if (ready) {
                return;
            }
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({ enableWorker: true });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
            } else {
                video.src = streamUrl;
            }
            ready = true;
        }

        function play() {
            attach();
            video.setAttribute("controls", "controls");
            if (cover) {
                cover.classList.add("is-hidden");
            }
            var attempt = video.play();
            if (attempt && typeof attempt.catch === "function") {
                attempt.catch(function () {});
            }
        }

        if (cover) {
            cover.addEventListener("click", play);
        }
        video.addEventListener("click", function () {
            if (!ready || video.paused) {
                play();
            }
        });
        video.addEventListener("play", function () {
            if (cover) {
                cover.classList.add("is-hidden");
            }
        });
        window.addEventListener("beforeunload", function () {
            if (hls) {
                hls.destroy();
            }
        });
    };
})();
