(function () {
  function start(video, stream, overlay) {
    if (!video || !stream) {
      return;
    }
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      if (video.src !== stream) {
        video.src = stream;
      }
      video.play().catch(function () {});
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      if (video.hlsInstance) {
        video.hlsInstance.destroy();
      }
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      video.hlsInstance = hls;
      hls.loadSource(stream);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.play().catch(function () {});
      });
      return;
    }
    video.src = stream;
    video.play().catch(function () {});
  }

  document.addEventListener('DOMContentLoaded', function () {
    var buttons = Array.prototype.slice.call(document.querySelectorAll('.play-overlay'));
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var id = button.getAttribute('data-video');
        var stream = button.getAttribute('data-stream');
        start(document.getElementById(id), stream, button);
      });
    });
  });
})();
