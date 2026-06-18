(function () {
  var players = document.querySelectorAll('.movie-player');

  players.forEach(function (shell) {
    var video = shell.querySelector('video');
    var button = shell.querySelector('.player-start');

    if (!video || !button) {
      return;
    }

    var stream = video.getAttribute('data-stream');
    var ready = false;
    var hlsInstance = null;

    var loadStream = function () {
      if (ready || !stream) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          maxBufferLength: 30,
          enableWorker: true
        });
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
      }

      ready = true;
    };

    var start = function () {
      loadStream();
      shell.classList.add('is-playing');
      var attempt = video.play();

      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(function () {});
      }
    };

    button.addEventListener('click', start);

    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });
})();
