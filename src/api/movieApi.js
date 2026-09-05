import api from "./axios";
import ENDPOINTS from "./endpoints";
import handleError from "../utils/handleError";

/**
 * Các API liên quan đến phim.
 *
 * Quy ước:
 * - Các hàm trong object này chỉ chịu trách nhiệm gọi API.
 * - Lỗi được chuyển cho handleError xử lý tập trung.
 * - Params mặc định giúp component gọi API đơn giản hơn.
 */
const movieApi = {
  /**
   * Lấy danh sách phim mới cập nhật.
   *
   * Với type = "phim-moi", endpoint sử dụng trực tiếp NEW_MOVIES.
   * Với các type khác, type sẽ được nối vào cuối endpoint.
   *
   * @param {string} type - Loại danh sách phim, ví dụ: "phim-moi", "phim-le", "phim-bo"
   * @param {number} limit - Số lượng phim muốn lấy
   * @param {number} page - Trang hiện tại
   * @returns {Promise<Object>} Dữ liệu trả về từ API
   */
  async getNewMovies(type, limit = 24, page = 1) {
    try {
      // "phim-moi" là endpoint gốc, các loại khác cần thêm /{type}.
      const url =
        type === "phim-moi"
          ? ENDPOINTS.NEW_MOVIES
          : `${ENDPOINTS.NEW_MOVIES}/${type}`;

      return await api.get(url, {
        params: { limit, page },
      });
    } catch (error) {
      handleError("Lỗi khi lấy danh sách phim mới", error);
    }
  },

  /**
   * Lấy nhiều danh sách phim cho trang chủ.
   *
   * Các API được gọi song song thay vì gọi tuần tự.
   * Ví dụ: nếu trang chủ có 4 category thì cả 4 request
   * được gửi gần như cùng lúc, giúp giảm thời gian chờ.
   *
   * @param {string[]} types - Danh sách loại phim cần lấy
   * @param {number} limit - Số phim tối đa cho mỗi loại
   * @returns {Promise<Array>} Mảng kết quả theo từng type
   */
  async getHomeMovies(types = [], limit = 6) {
    try {
      // Promise.all() giúp thực hiện các request song song.
      const promises = types.map(async (type) => {
        const data = await this.getNewMovies(type, limit);

        // Giữ lại type để component biết dữ liệu này thuộc category nào.
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
   * @returns {Promise<Object>} Dữ liệu kết quả tìm kiếm
   */
  async searchMovies(keyword, limit = 24, page = 1) {
    // Không gửi request nếu người dùng chỉ nhập khoảng trắng.
    if (!keyword?.trim()) {
      throw new Error("Keyword không được để trống");
    }

    try {
      return await api.get(ENDPOINTS.SEARCH, {
        params: {
          keyword: keyword.trim(),
          limit,
          page,
        },
      });
    } catch (error) {
      handleError(`Lỗi khi tìm kiếm phim "${keyword}"`, error);
    }
  },

  /**
   * Lấy thông tin chi tiết của một bộ phim.
   *
   * @param {string} slug - Slug định danh của phim
   * @returns {Promise<Object>} Thông tin chi tiết phim
   */
  async getMovieDetail(slug) {
    if (!slug?.trim()) {
      throw new Error("Slug phim không được để trống");
    }

    try {
      return await api.get(`${ENDPOINTS.MOVIE}/${slug}`);
    } catch (error) {
      handleError(`Lỗi khi lấy chi tiết phim "${slug}"`, error);
    }
  },

  /**
   * Lấy danh sách tất cả thể loại phim.
   *
   * @returns {Promise<Object>} Danh sách thể loại
   */
  async getGenres() {
    try {
      return await api.get(ENDPOINTS.GENRES);
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
   * @param {string} [status] - Trạng thái phim, nếu API hỗ trợ
   * @returns {Promise<Object>} Danh sách phim theo thể loại
   */
  async getMoviesByGenre(slug, limit = 24, page = 1, status) {
    if (!slug?.trim()) {
      throw new Error("Slug thể loại không được để trống");
    }

    try {
      return await api.get(`${ENDPOINTS.MOVIESBYGENRES}/${slug}`, {
        params: {
          limit,
          page,

          // Chỉ gửi status khi có giá trị.
          // Tránh gửi status=undefined lên server.
          ...(status && { status }),
        },
      });
    } catch (error) {
      handleError(`Lỗi khi lấy phim thể loại "${slug}"`, error);
    }
  },
};

export default movieApi;
