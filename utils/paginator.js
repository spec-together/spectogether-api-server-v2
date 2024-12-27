function createPagination(count, page, limit) {
  const totalItems = count;
  const totalPages = Math.ceil(totalItems / limit);
  // const currentPage = page;
  const next = page < totalPages ? `/events?page=${page + 1}` : null;
  const previous = page > 1 ? `/events?page=${page - 1}` : null;
  const pagination = {
    totalItems,
    totalPages,
    next,
    previous,
    page,
    limit,
  };
  return pagination;
}

module.exports = { createPagination };
