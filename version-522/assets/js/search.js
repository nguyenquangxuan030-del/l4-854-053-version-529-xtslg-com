(function () {
  var input = document.getElementById('site-search');
  var results = document.getElementById('search-results');
  var form = document.querySelector('.search-box');
  var items = window.SiteSearchItems || [];

  if (!input || !results) {
    return;
  }

  var card = function (item) {
    var tagHtml = (item.tags || []).slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');

    return '' +
      '<article class="movie-card">' +
      '<a class="card-cover" href="' + escapeHtml(item.url) + '">' +
      '<img src="' + escapeHtml(item.cover) + '" alt="' + escapeHtml(item.title) + '" loading="lazy">' +
      '<span class="card-play">▶</span>' +
      '</a>' +
      '<div class="card-body">' +
      '<h3><a href="' + escapeHtml(item.url) + '">' + escapeHtml(item.title) + '</a></h3>' +
      '<p class="card-desc">' + escapeHtml(item.line) + '</p>' +
      '<div class="card-meta">' + escapeHtml(item.meta) + '</div>' +
      '<div class="tag-row">' + tagHtml + '</div>' +
      '</div>' +
      '</article>';
  };

  var render = function (query) {
    var q = query.trim().toLowerCase();
    var pool = q ? items.filter(function (item) {
      var text = [item.title, item.line, item.meta, (item.tags || []).join(' ')].join(' ').toLowerCase();
      return text.indexOf(q) !== -1;
    }) : items.slice(0, 24);

    results.innerHTML = pool.slice(0, 80).map(card).join('');
  };

  var escapeHtml = function (value) {
    return String(value || '').replace(/[&<>"]/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[char];
    });
  };

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    render(input.value);
  });

  input.addEventListener('input', function () {
    render(input.value);
  });

  var params = new URLSearchParams(window.location.search);
  var initial = params.get('q') || '';
  input.value = initial;
  render(initial);
})();
