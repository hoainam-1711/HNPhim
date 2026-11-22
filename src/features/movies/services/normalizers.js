/**
 * Response Normalizers cho Feature Movies
 * Chuẩn hóa dữ liệu trả về từ API thành MỘT shape duy nhất, sạch sẽ, không nhân bản lồng nhau.
 */

/**
 * Chuẩn hóa response danh sách phim (Phim mới, Thể loại, Quốc gia, Tìm kiếm)
 * @param {Object} response
 * @returns {{ items: Array, titlePage: string, totalPages: number, currentPage: number, totalItems: number }}
 */
export const normalizeMovieList = (response) => {
  if (!response) {
    return {
      items: [],
      titlePage: "",
      totalPages: 1,
      currentPage: 1,
      totalItems: 0,
    };
  }

  const items =
    response.data?.items ||
    response.items ||
    (Array.isArray(response.data) ? response.data : []) ||
    [];

  const titlePage = response.data?.titlePage || response.titlePage || "";

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
    items,
    titlePage,
    totalPages,
    currentPage,
    totalItems,
  };
};

/**
 * Chuẩn hóa response chi tiết phim
 * @param {Object} response
 * @returns {{ movie: Object, episodes: Array }}
 */
export const normalizeMovieDetail = (response) => {
  if (!response) {
    return {
      movie: {},
      episodes: [],
    };
  }

  const movie = response.movie || response.data?.item || response.item || {};
  const episodes =
    response.episodes || response.data?.item?.episodes || movie.episodes || [];

  return {
    movie,
    episodes,
  };
};

/**
 * Chuẩn hóa response danh sách thể loại / quốc gia
 * @param {Object} response
 * @returns {{ items: Array }}
 */
export const normalizeFilterList = (response) => {
  if (!response) {
    return { items: [] };
  }

  const items = Array.isArray(response)
    ? response
    : response.data?.items ||
      response.items ||
      (Array.isArray(response.data) ? response.data : []);

  return {
    items,
  };
};
