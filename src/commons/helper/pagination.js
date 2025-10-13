const createPagination = (page, size, totalItems) => {
  const currentPage = page ? +page : 1;
  const totalPages = Math.ceil(totalItems / size);

  return {
    totalItems,
    totalPages,
    currentPage,
    itemsPerPage: size,
  };
};

module.exports = { createPagination };