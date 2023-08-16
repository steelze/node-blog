const UrlHelper = require('./UrlHelper');

function createPaginatedDataFromArray(req, data, page = 1, limit = 10) {
  const total = data.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const lastPage = Math.ceil(total / limit)

  const content = data.slice(start, end);

  const fullUrl = UrlHelper.getFullUrl(req);

  const firstPageUrl = new URL(fullUrl);
  firstPageUrl.searchParams.set('page', 1);

  const lastPageUrl = new URL(fullUrl);
  lastPageUrl.searchParams.set('page', lastPage);

  const prevPageUrl = (page > 1) ? new URL(fullUrl) : null;
  if (prevPageUrl) {
    prevPageUrl.searchParams.set('page', page - 1);
  }

  const nextPageUrl = (page < lastPage) ? new URL(fullUrl) : null;
  if (nextPageUrl) {
    nextPageUrl.searchParams.set('page', page + 1);
  }

  const meta = {
    total,
    per_page: limit,
    current_page: parseInt(page),
    last_page: lastPage,
    from: start + 1,
    to: end,
    path: fullUrl,
    first_page_url: firstPageUrl.toString(),
    last_page_url: lastPageUrl.toString(),
    prev_page_url: (prevPageUrl) ? prevPageUrl.toString() : null,
    next_page_url: (nextPageUrl) ? nextPageUrl.toString() : null,
  };

  return { content, meta };
}

module.exports = {
  createPaginatedDataFromArray
};
