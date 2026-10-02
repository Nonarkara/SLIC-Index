(function () {
  var qs = window.location.search;
  if (qs.indexOf('?p=') !== 0) return;
  try {
    var decoded = decodeURIComponent(qs.slice(3));
    var hashIdx = decoded.indexOf('#');
    var hash = hashIdx !== -1 ? decoded.slice(hashIdx) : '';
    var pathAndQuery = hashIdx !== -1 ? decoded.slice(0, hashIdx) : decoded;
    var qIdx = pathAndQuery.indexOf('&');
    var path = '/' + (qIdx !== -1 ? pathAndQuery.slice(0, qIdx) : pathAndQuery).replace(/^\/+/, '');
    var query = qIdx !== -1 ? '?' + pathAndQuery.slice(qIdx + 1) : '';
    window.history.replaceState(null, '', path + query + hash);
  } catch {
    // Malformed incoming URLs must not prevent the application from loading.
  }
})();
