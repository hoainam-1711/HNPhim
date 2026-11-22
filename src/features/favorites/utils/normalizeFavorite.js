/**
 * Chuẩn hóa object phim trước khi lưu vào localStorage.
 * Chỉ giữ lại các trường dữ liệu tối thiểu cần thiết để hiển thị Card/List,
 * giúp tối ưu dung lượng localStorage (giới hạn ~5MB) và đảm bảo tính nhất quán.
 *
 * @param {Object} movie - Object phim gốc từ API hoặc từ storage cũ
 * @returns {Object|null}
 */
export const normalizeFavoriteItem = (movie) => {
  if (!movie || !movie.slug) return null;

  return {
    slug: String(movie.slug).trim(),
    name: movie.name || movie.title || "",
    poster_url: movie.poster_url || "",
    thumb_url: movie.thumb_url || "",
    quality: movie.quality || "",
    year: movie.year || "",
  };
};

/**
 * Migration dữ liệu an toàn cho danh sách favorites đọc từ localStorage.
 * Lọc bỏ các phần tử lỗi/rác và chuẩn hóa payload các mục cũ thành cấu trúc mới.
 *
 * @param {Array<any>} rawFavorites - Mảng dữ liệu thô từ localStorage
 * @returns {Array<Object>} Mảng dữ liệu đã được làm sạch và chuẩn hóa
 */
export const migrateFavoritesData = (rawFavorites) => {
  if (!Array.isArray(rawFavorites)) return [];

  const seenSlugs = new Set();
  const sanitized = [];

  for (const item of rawFavorites) {
    const normalized = normalizeFavoriteItem(item);
    if (normalized && !seenSlugs.has(normalized.slug)) {
      seenSlugs.add(normalized.slug);
      sanitized.push(normalized);
    }
  }

  return sanitized;
};

export default normalizeFavoriteItem;
