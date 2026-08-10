import api from "./axios";
import ENDPOINTS from "./endpoints";
import handleError from "../utils/handleError";

const movieApi = {
  /**
   * Lấy danh sách phim mới cập nhật
   * @returns {Promise<Object>}
   * @param {string} type
   * @param {number} page
   * @param {number} limit
   */
  async getNewMovies(type, limit = 24, page = 1) {
    try {
      // Nếu là phim-moi thì dùng ENDPOINTS.NEW_MOVIES, ngược lại cộng thêm path /type
      const url =
        type === "phim-moi"
          ? ENDPOINTS.NEW_MOVIES
          : `${ENDPOINTS.NEW_MOVIES}/${type}`;

      return await api.get(url, { params: { limit, page } });
    } catch (error) {
      handleError("Lỗi khi lấy danh sách phim mới", error);
    }
  },

  async getHomeMovies(types = [], limit = 6) {
    try {
      const promises = types.map(async (type) => {
        const data = await this.getNewMovies(type, limit);
        return { type, data };
      });

      return await Promise.all(promises);
    } catch (error) {
      handleError("Lỗi khi lấy danh sách phim trang chủ", error);
    }
  },

  /**
   * Tìm kiếm phim
   * @param {string} keyword
   * @param {number} limit
   * @param {number} page
   * @returns {Promise<Object>}
   */
  async searchMovies(keyword, limit = 24, page = 1) {
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
  async getMoviesByGenre(slug, limit = 24, page = 1) {
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
