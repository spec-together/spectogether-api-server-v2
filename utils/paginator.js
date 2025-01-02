function createPagination(prefix, count, page, limit) {
  const totalItems = count;
  const totalPages = Math.ceil(totalItems / limit);
  // const currentPage = page;
  const next =
    page < totalPages ? `/${prefix}?page=${page + 1}&limit=${limit}` : null;
  const previous =
    page > 1 ? `/${prefix}?page=${page - 1}&limit=${limit}` : null;
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

module.exports = {
  createPagination,
};
