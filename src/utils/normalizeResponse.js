/**
 * Response Normalizer (Adapter Pattern)
 *
 * Chuẩn hóa các định dạng dữ liệu trả về từ các endpoint khác nhau của phimapi.com
 * thành một cấu trúc đồng nhất, đồng thời giữ tương thích ngược 100% với các component cũ.
 */

/**
 * Chuẩn hóa response danh sách phim (Danh sách mới, Tìm kiếm, Thể loại, Quốc gia)
 * @param {Object} response
 * @returns {Object}
 */
export const normalizeMovieList = (response) => {
  if (!response) {
    return {
      items: [],
      titlePage: "",
      totalPages: 1,
      currentPage: 1,
      totalItems: 0,
      data: {
        items: [],
        titlePage: "",
        params: {
          pagination: {
            totalPages: 1,
            currentPage: 1,
            totalItems: 0,
          },
        },
      },
    };
  }

  // Trích xuất items
  const items =
    response.data?.items ||
    response.items ||
    (Array.isArray(response.data) ? response.data : []) ||
    [];

  // Trích xuất titlePage
  const titlePage = response.data?.titlePage || response.titlePage || "";

  // Trích xuất pagination params
  const rawPagination =
    response.data?.params?.pagination ||
    response.params?.pagination ||
    response.pagination ||
    {};

  const totalPages =
    Number(rawPagination.totalPages || rawPagination.total_pages) || 1;
  const currentPage =
    Number(rawPagination.currentPage || rawPagination.current_page) || 1;
  const totalItems =
    Number(rawPagination.totalItems || rawPagination.total_items) ||
    items.length;

  return {
    ...response,
    items,
    titlePage,
    totalPages,
    currentPage,
    totalItems,
    pagination: {
      totalPages,
      currentPage,
      totalItems,
    },
    // Giữ cấu trúc data.* để code cũ vẫn truy cập được không bị undefined
    data: {
      ...(response.data || {}),
      items,
      titlePage,
      params: {
        ...(response.data?.params || {}),
        pagination: {
          ...(response.data?.params?.pagination || {}),
          totalPages,
          currentPage,
          totalItems,
        },
      },
    },
  };
};

/**
 * Chuẩn hóa response chi tiết phim
 * @param {Object} response
 * @returns {Object}
 */
export const normalizeMovieDetail = (response) => {
  if (!response) {
    return {
      movie: {},
      episodes: [],
      data: { item: {} },
    };
  }

  const movie = response.movie || response.data?.item || response.item || {};
  const episodes =
    response.episodes || response.data?.item?.episodes || movie.episodes || [];

  return {
    ...response,
    movie,
    episodes,
    data: {
      ...(response.data || {}),
      item: {
        ...(response.data?.item || {}),
        ...movie,
        episodes,
      },
    },
  };
};

/**
 * Chuẩn hóa response danh sách thể loại / quốc gia
 * @param {Object} response
 * @returns {Object}
 */
export const normalizeFilterList = (response) => {
  if (!response) {
    return { items: [], data: { items: [] } };
  }

  const items = Array.isArray(response)
    ? response
    : response.data?.items ||
      response.items ||
      (Array.isArray(response.data) ? response.data : []);

  return {
    ...response,
    items,
    data: {
      ...(response.data || {}),
      items,
    },
  };
};
