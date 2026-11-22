import api from "@/core/api/client";
import ENDPOINTS from "@/core/api/endpoints";
import handleError, { isCancelError } from "@/core/utils/error";
import {
  normalizeMovieList,
  normalizeMovieDetail,
  normalizeFilterList,
} from "./normalizers";

/**
 * movieService: Quản lý toàn bộ API calls cho Feature Movies
 */
export const movieService = {
  /**
   * Lấy danh sách phim mới / danh mục
   * @param {string} type - 'phim-moi' | 'phim-le' | 'phim-bo' | 'phim-chieu-rap' | 'hoat-hinh' | 'tv-shows'
   * @param {number} limit
   * @param {number} page
   * @param {Object} [config] - Axios request config (chứa signal)
   */
  async getNewMovies(type, limit = 24, page = 1, config = {}) {
    try {
      const url =
        type === "phim-moi"
          ? ENDPOINTS.NEW_MOVIES
          : `${ENDPOINTS.NEW_MOVIES}/${type}`;

      const res = await api.get(url, {
        params: { limit, page },
        ...config,
      });

      return normalizeMovieList(res);
    } catch (error) {
      handleError("Lỗi khi lấy danh sách phim mới", error);
    }
  },

  /**
   * Lấy danh sách phim hiển thị trang chủ (Chạy song song và chịu lỗi từng phần qua Promise.allSettled)
   * Một danh mục lỗi không làm sập toàn bộ trang chủ!
   * @param {string[]} types
   * @param {number} limit
   * @param {Object} [config]
   */
  async getHomeMovies(types = [], limit = 6, config = {}) {
    try {
      const promises = types.map(async (type) => {
        try {
          const data = await this.getNewMovies(type, limit, 1, config);
          return { type, data };
        } catch (err) {
          if (isCancelError(err)) {
            throw err;
          }
          // Fallback an toàn nếu một danh mục riêng lẻ bị lỗi
          return {
            type,
            data: { items: [], totalPages: 1, currentPage: 1, totalItems: 0 },
          };
        }
      });

      const results = await Promise.allSettled(promises);

      const canceledResult = results.find(
        (result) =>
          result.status === "rejected" && isCancelError(result.reason),
      );
      if (canceledResult) {
        throw canceledResult.reason;
      }

      return results.map((result, index) => {
        if (result.status === "fulfilled") {
          return result.value;
        }
        return {
          type: types[index],
          data: { items: [], totalPages: 1, currentPage: 1, totalItems: 0 },
        };
      });
    } catch (error) {
      handleError("Lỗi khi lấy danh sách phim trang chủ", error);
    }
  },

  /**
   * Tìm kiếm phim theo từ khóa
   * @param {string} keyword
   * @param {number} limit
   * @param {number} page
   * @param {Object} [config]
   */
  async searchMovies(keyword, limit = 24, page = 1, config = {}) {
    const trimmed = keyword?.trim();
    if (!trimmed) {
      return normalizeMovieList(null);
    }

    try {
      const res = await api.get(ENDPOINTS.SEARCH, {
        params: {
          keyword: trimmed,
          limit,
          page,
        },
        ...config,
      });

      return normalizeMovieList(res);
    } catch (error) {
      handleError(`Lỗi khi tìm kiếm phim "${trimmed}"`, error);
    }
  },

  /**
   * Lấy chi tiết thông tin phim
   * @param {string} slug
   * @param {Object} [config]
   */
  async getMovieDetail(slug, config = {}) {
    const trimmed = slug?.trim();
    if (!trimmed) {
      return normalizeMovieDetail(null);
    }

    try {
      const res = await api.get(`${ENDPOINTS.MOVIE}/${trimmed}`, config);
      return normalizeMovieDetail(res);
    } catch (error) {
      handleError(`Lỗi khi lấy chi tiết phim "${trimmed}"`, error);
    }
  },

  /**
   * Lấy danh sách thể loại
   * @param {Object} [config]
   */
  async getGenres(config = {}) {
    try {
      const res = await api.get(ENDPOINTS.GENRES, config);
      return normalizeFilterList(res);
    } catch (error) {
      handleError("Lỗi khi lấy danh sách thể loại", error);
    }
  },

  /**
   * Lấy danh sách phim theo thể loại
   * @param {string} slug
   * @param {number} limit
   * @param {number} page
   * @param {Object} [config]
   */
  async getMoviesByGenre(slug, limit = 24, page = 1, config = {}) {
    const trimmed = slug?.trim();
    if (!trimmed) return normalizeMovieList(null);

    try {
      const res = await api.get(`${ENDPOINTS.MOVIESBYGENRES}/${trimmed}`, {
        params: { limit, page },
        ...config,
      });

      return normalizeMovieList(res);
    } catch (error) {
      handleError(`Lỗi khi lấy phim thể loại "${trimmed}"`, error);
    }
  },

  /**
   * Lấy danh sách quốc gia
   * @param {Object} [config]
   */
  async getCountries(config = {}) {
    try {
      const res = await api.get(ENDPOINTS.COUNTRIES, config);
      return normalizeFilterList(res);
    } catch (error) {
      handleError("Lỗi khi lấy danh sách quốc gia", error);
    }
  },

  /**
   * Lấy danh sách phim theo quốc gia
   * @param {string} slug
   * @param {number} limit
   * @param {number} page
   * @param {Object} [config]
   */
  async getMoviesByCountry(slug, limit = 24, page = 1, config = {}) {
    const trimmed = slug?.trim();
    if (!trimmed) return normalizeMovieList(null);

    try {
      const res = await api.get(`${ENDPOINTS.MOVIESBYCOUNTRY}/${trimmed}`, {
        params: { limit, page },
        ...config,
      });

      return normalizeMovieList(res);
    } catch (error) {
      handleError(`Lỗi khi lấy phim từ quốc gia "${trimmed}"`, error);
    }
  },
};

export default movieService;
