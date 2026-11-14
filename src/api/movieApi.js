import api from "./axios";
import ENDPOINTS from "./endpoints";
import handleError from "../utils/handleError";
import {
  normalizeMovieList,
  normalizeMovieDetail,
  normalizeFilterList,
} from "../utils/normalizeResponse";

/**
 * Các API liên quan đến phim.
 *
 * Quy ước:
 * - Các hàm gọi API trả về dữ liệu đã được chuẩn hóa qua normalizers (Adapter Pattern).
 * - Dữ liệu luôn có sẵn các trường chuẩn (items, totalPages, movie, episodes,...)
 *   đồng thời bảo toàn cấu trúc cũ (data.items,...) để đảm bảo tương thích ngược 100%.
 */
const movieApi = {
  /**
   * Lấy danh sách phim mới cập nhật.
   *
   * @param {string} type - Loại danh sách phim, ví dụ: "phim-moi", "phim-le", "phim-bo"
   * @param {number} limit - Số lượng phim muốn lấy
   * @param {number} page - Trang hiện tại
   * @returns {Promise<Object>} Dữ liệu chuẩn hóa
   */
  async getNewMovies(type, limit = 24, page = 1) {
    try {
      const url =
        type === "phim-moi"
          ? ENDPOINTS.NEW_MOVIES
          : `${ENDPOINTS.NEW_MOVIES}/${type}`;

      const res = await api.get(url, {
        params: { limit, page },
      });

      return normalizeMovieList(res);
    } catch (error) {
      handleError("Lỗi khi lấy danh sách phim mới", error);
    }
  },

  /**
   * Lấy nhiều danh sách phim cho trang chủ (chạy song song).
   *
   * @param {string[]} types - Danh sách loại phim cần lấy
   * @param {number} limit - Số phim tối đa cho mỗi loại
   * @returns {Promise<Array>} Mảng kết quả theo từng type
   */
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
   * Tìm kiếm phim theo từ khóa.
   *
   * @param {string} keyword - Từ khóa tìm kiếm
   * @param {number} limit - Số lượng kết quả mỗi trang
   * @param {number} page - Trang hiện tại
   * @returns {Promise<Object>} Dữ liệu tìm kiếm chuẩn hóa
   */
  async searchMovies(keyword, limit = 24, page = 1) {
    if (!keyword?.trim()) {
      throw new Error("Keyword không được để trống");
    }

    try {
      const res = await api.get(ENDPOINTS.SEARCH, {
        params: {
          keyword: keyword.trim(),
          limit,
          page,
        },
      });

      return normalizeMovieList(res);
    } catch (error) {
      handleError(`Lỗi khi tìm kiếm phim "${keyword}"`, error);
    }
  },

  /**
   * Lấy thông tin chi tiết của một bộ phim.
   *
   * @param {string} slug - Slug định danh của phim
   * @returns {Promise<Object>} Chi tiết phim chuẩn hóa
   */
  async getMovieDetail(slug) {
    if (!slug?.trim()) {
      throw new Error("Slug phim không được để trống");
    }

    try {
      const res = await api.get(`${ENDPOINTS.MOVIE}/${slug}`);
      return normalizeMovieDetail(res);
    } catch (error) {
      handleError(`Lỗi khi lấy chi tiết phim "${slug}"`, error);
    }
  },

  /**
   * Lấy danh sách tất cả thể loại phim.
   *
   * @returns {Promise<Object>} Danh sách thể loại chuẩn hóa
   */
  async getGenres() {
    try {
      const res = await api.get(ENDPOINTS.GENRES);
      return normalizeFilterList(res);
    } catch (error) {
      handleError("Lỗi khi lấy danh sách thể loại", error);
    }
  },

  /**
   * Lấy danh sách phim theo thể loại.
   *
   * @param {string} slug - Slug của thể loại
   * @param {number} limit - Số lượng phim mỗi trang
   * @param {number} page - Trang hiện tại
   * @returns {Promise<Object>} Danh sách phim chuẩn hóa
   */
  async getMoviesByGenre(slug, limit = 24, page = 1) {
    if (!slug?.trim()) {
      throw new Error("Slug thể loại không được để trống");
    }

    try {
      const res = await api.get(`${ENDPOINTS.MOVIESBYGENRES}/${slug}`, {
        params: { limit, page },
      });

      return normalizeMovieList(res);
    } catch (error) {
      handleError(`Lỗi khi lấy phim thể loại "${slug}"`, error);
    }
  },

  /**
   * Lấy danh sách tất cả quốc gia.
   *
   * @returns {Promise<Object>} Danh sách quốc gia chuẩn hóa
   */
  async getCountries() {
    try {
      const res = await api.get(ENDPOINTS.COUNTRIES);
      return normalizeFilterList(res);
    } catch (error) {
      handleError("Lỗi khi lấy danh sách quốc gia", error);
    }
  },

  /**
   * Lấy danh sách phim theo quốc gia.
   *
   * @param {string} slug - Slug của quốc gia
   * @param {number} limit - Số lượng phim mỗi trang
   * @param {number} page - Trang hiện tại
   * @returns {Promise<Object>} Danh sách phim chuẩn hóa
   */
  async getMoviesByCountry(slug, limit = 24, page = 1) {
    if (!slug?.trim()) {
      throw new Error("Slug quốc gia không được để trống");
    }

    try {
      const res = await api.get(`${ENDPOINTS.MOVIESBYCOUNTRY}/${slug}`, {
        params: { limit, page },
      });

      return normalizeMovieList(res);
    } catch (error) {
      handleError(`Lỗi khi lấy phim từ quốc gia: "${slug}"`, error);
    }
  },
};

export default movieApi;
