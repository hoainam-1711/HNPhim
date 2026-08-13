// Domain ảnh mặc định nếu URL ảnh từ API trả về dạng tên file tương đối
const DEFAULT_IMAGE_CDN = "https://phimimg.com/";

/**
 * Xử lý link ảnh an toàn (Nếu link dạng relative 'xyz.jpg' thì tự nối domain)
 */
const fixImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `${DEFAULT_IMAGE_CDN}${url}`;
};

/**
 * Làm sạch nội dung mô tả phim (xóa thẻ HTML dư thừa <p>, <br>...)
 */
const cleanContent = (htmlContent) => {
  if (!htmlContent) return "Đang cập nhật nội dung...";
  return htmlContent.replace(/<[^>]*>?/gm, "").trim();
};

/**
 * 1. Chuẩn hóa Danh sách phim (getNewMovies, searchMovies, getMoviesByGenre...)
 */
export const formatMovieListByType = (rawData) => {
  if (!rawData)
    return {
      titlePage: "",
      items: [],
      totalPages: 1,
    };

  // Trích xuất mảng items linh hoạt theo cấu trúc JSON
  const titlePage =
    rawData?.data?.titlePage || // KKPhim
    rawData?.titlePage || // Chỉnh sửa theo bên api thứ 2
    [];

  const items =
    rawData?.data?.items || // KKPhim
    rawData?.items || // Chỉnh sửa theo bên api thứ 2
    [];

  const totalPages =
    rawData?.data?.param?.pagination?.totalPages || // KKPhim
    rawData?.param?.pagination?.totalPages || // Chỉnh sửa theo bên api thứ 2
    1;

  // Chuẩn hóa từng object phim trong mảng
  const normalizedItems = items.map((item) => ({
    tmdb: item.tmdb || null,
    imdb: item.imdb || null,
    modified: item.modified || null,
    id: item._id || item.id,
    name: item.name || item.title || "N/A",
    slug: item.slug,
    origin_name: item.origin_name || item.original_title || "N/A",
    alternative_names: Array.isArray(item.alternative_names)
      ? item.alternative_names
      : [],
    type: item.type || "",
    thumb_url: fixImageUrl(item.thumb_url || item.poster_url),
    poster_url: fixImageUrl(item.poster_url || item.thumb_url),
    sub_docquyen: Boolean(item.sub_docquyen),
    chieurap: Boolean(item.chieurap),
    time: item.time || "N/A",
    episode_current: item.episode_current || "N/A",
    quality: item.quality || "N/A",
    lang: item.lang || "N/A",
    lang_key: Array.isArray(item.lang_key) ? item.lang_key : [],
    year: item.year || "N/A",
    category: Array.isArray(item.category) ? item.category : [],
    country: Array.isArray(item.country) ? item.country : [],
    last_episodes: Array.isArray(item.last_episodes) ? item.last_episodes : [],
  }));

  return {
    titlePage: titlePage,
    items: normalizedItems,
    totalPages: Number(totalPages),
  };
};

/**
 * 2. Chuẩn hóa Chi tiết phim & Danh sách Tập phim (getMovieDetail)
 */
export const formatMovieDetail = (rawData) => {
  if (!rawData || !rawData.movie) {
    return { movie: null, episodes: [] };
  }

  const movie = rawData.movie;
  const episodes = rawData.episodes || [];

  // Chuẩn hóa thông tin chi tiết phim
  const normalizedMovie = {
    tmdb: movie.tmdb || null,
    imdb: movie.imdb || null,
    created: movie.created || null,
    modified: movie.modified || null,
    id: movie._id || movie.id,
    name: movie.name || "N/A",
    slug: movie.slug,
    origin_name: movie.origin_name || "N/A",
    alternative_names: Array.isArray(movie.alternative_names)
      ? movie.alternative_names
      : [],
    content: cleanContent(movie.content),
    type: movie.type || "",
    status: movie.status || "",
    thumb_url: fixImageUrl(movie.thumb_url || movie.poster_url),
    poster_url: fixImageUrl(movie.poster_url || movie.thumb_url),
    is_copyright: Boolean(movie.is_copyright),
    sub_docquyen: Boolean(movie.sub_docquyen),
    chieurap: Boolean(movie.chieurap),
    is_published: Boolean(movie.is_published),
    trailer_url: movie.trailer_url || "N/A",
    time: movie.time || "N/A",
    episode_current: movie.episode_current || "N/A",
    episode_total: movie.episode_total || 1,
    quality: movie.quality || "N/A",
    lang: movie.lang || "N/A",
    lang_key: Array.isArray(movie.lang_key) ? movie.lang_key : [],
    notify: movie.notify || "",
    showtimes: movie.showtimes || "",
    year: movie.year || "N/A",
    view: movie.view || 0,
    actor: Array.isArray(movie.actor) ? movie.actor : [],
    director: Array.isArray(movie.director) ? movie.director : [],
    category: Array.isArray(movie.category) ? movie.category : [],
    country: Array.isArray(movie.country) ? movie.country : [],
  };

  // Chuẩn hóa danh sách các Server & Tập phim
  const normalizedEpisodes = episodes.map((server) => ({
    server_name: server.server_name || "N/A",
    is_ai: Boolean(server.is_ai),
    server_data: (server.server_data || []).map((ep) => ({
      name: ep.name || "",
      slug: ep.slug || "",
      filename: ep.filename || "",
      link_embed: ep.link_embed || "",
      link_m3u8: ep.link_m3u8 || "",
    })),
  }));

  return {
    movie: normalizedMovie,
    episodes: normalizedEpisodes,
  };
};
