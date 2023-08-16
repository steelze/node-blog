function getFullUrl(req) {
  let url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  // Remove trailing slash
  return url.replace(/\/$/, '');
}

function getBaseUrl(req) {
  let url = `${req.protocol}://${req.get('host')}`;
  // Remove trailing slash
  return url.replace(/\/$/, '');
}

module.exports = {
  getFullUrl,
  getBaseUrl,
};
