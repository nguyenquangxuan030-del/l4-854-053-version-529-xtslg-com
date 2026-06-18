(function () {
  const panels = Array.from(document.querySelectorAll('[data-watch-panel]'));

  const startVideo = function (panel) {
    const video = panel.querySelector('video');
    if (!video) {
      return;
    }

    const stream = video.getAttribute('data-stream');
    if (!stream) {
      return;
    }

    panel.classList.add('is-playing');

    const play = function () {
      const promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    };

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      if (!video.getAttribute('src')) {
        video.setAttribute('src', stream);
      }
      play();
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      if (!video.__hlsInstance) {
        const hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        video.__hlsInstance = hls;
        hls.loadSource(stream);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, play);
      } else {
        play();
      }
      return;
    }

    if (!video.getAttribute('src')) {
      video.setAttribute('src', stream);
    }
    play();
  };

  panels.forEach(function (panel) {
    const button = panel.querySelector('.play-overlay');
    const video = panel.querySelector('video');

    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        startVideo(panel);
      });
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          startVideo(panel);
        }
      });
      video.addEventListener('play', function () {
        panel.classList.add('is-playing');
      });
    }
  });
})();
