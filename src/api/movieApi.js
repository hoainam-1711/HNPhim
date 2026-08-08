import api from "./axios";
import ENDPOINTS from "./endpoints";
import handleError from "../utils/handleError";

const movieApi = {
  /**
   * Lấy danh sách phim mới cập nhật
   * @param {number} page
   * @returns {Promise<Object>}
   */
  async getNewMovies(page = 1) {
    try {
      return await api.get(ENDPOINTS.NEW_MOVIES, {
        params: { page },
      });
    } catch (error) {
      handleError("Lỗi khi lấy danh sách phim mới", error);
    }
  },

  /**
   * Tìm kiếm phim
   * @param {string} keyword
   * @param {number} limit
   * @param {number} page
   * @returns {Promise<Object>}
   */
  async searchMovies(keyword, limit = 10, page = 1) {
    if (!keyword.trim()) {
      throw new Error("Keyword không được để trống");
    }

    try {
      return await api.get(ENDPOINTS.SEARCH, {
        params: {
          keyword,
          limit,
          page,
        },
      });
    } catch (error) {
      handleError(`Lỗi khi tìm kiếm phim "${keyword}"`, error);
    }
  },

  /**
   * Lấy chi tiết phim
   * @param {string} slug
   * @returns {Promise<Object>}
   */
  async getMovieDetail(slug) {
    try {
      return await api.get(`${ENDPOINTS.MOVIE}/${slug}`);
    } catch (error) {
      handleError(`Lỗi khi lấy chi tiết phim "${slug}"`, error);
    }
  },

  /**
   * Lấy danh sách thể loại
   * @returns {Promise<Object>}
   */
  async getGenres() {
    try {
      return await api.get(ENDPOINTS.GENRES);
    } catch (error) {
      handleError("Lỗi khi lấy danh sách thể loại", error);
    }
  },

  /**
   * Lấy phim theo thể loại
   * @param {string} slug
   * @param {number} limit
   * @param {number} page
   * @returns {Promise<Object>}
   */
  async getMoviesByGenre(slug, limit = 10, page = 1) {
    try {
      return await api.get(`${ENDPOINTS.MOVIESBYGENRES}/${slug}`, {
        params: {
          limit,
          page,
          ...(status && { status }),
        },
      });
    } catch (error) {
      handleError(`Lỗi khi lấy phim thể loại "${slug}"`, error);
    }
  },
};

export default movieApi;