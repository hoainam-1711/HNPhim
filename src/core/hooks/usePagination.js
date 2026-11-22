import { useMemo } from "react";

/**
 * usePagination
 * Hỗ trợ tính toán range trang hiển thị (kèm dấu "...") và cắt lát (slice) mảng dữ liệu client-side.
 *
 * @param {Object} options
 * @param {number} options.totalItems - Tổng số items
 * @param {number} [options.itemsPerPage=24] - Số items mỗi trang
 * @param {number} [options.currentPage=1] - Trang hiện tại
 * @param {Array} [options.data=[]] - Mảng dữ liệu cần paginate client-side (tùy chọn)
 * @param {number} [options.siblingCount=1] - Số trang hiển thị cạnh trang hiện tại
 */
export function usePagination({
  totalItems = 0,
  itemsPerPage = 24,
  currentPage = 1,
  data = [],
  siblingCount = 1,
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Tạo danh sách trang kèm dấu '...'
  const paginationRange = useMemo(() => {
    const range = [];
    const rangeWithDots = [];

    for (let page = 1; page <= totalPages; page++) {
      const isFirstPage = page === 1;
      const isLastPage = page === totalPages;
      const isNearCurrent =
        page >= currentPage - siblingCount && page <= currentPage + siblingCount;

      if (isFirstPage || isLastPage || isNearCurrent) {
        range.push(page);
      }
    }

    let previousPage = 0;
    for (const page of range) {
      if (previousPage && page - previousPage > 1) {
        rangeWithDots.push("...");
      }
      rangeWithDots.push(page);
      previousPage = page;
    }

    return rangeWithDots;
  }, [totalPages, currentPage, siblingCount]);

  // Cắt mảng data nếu có truyền mảng vào (cho client-side pagination như Favorites)
  const paginatedItems = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  return {
    totalPages,
    currentPage,
    paginationRange,
    paginatedItems,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}

export default usePagination;
