import noImg from "@/assets/no-image.webp";

const IMAGE_CDN_BASE = "https://phimimg.com/";

/**
 * Trả về URL hình ảnh đầy đủ hoặc ảnh placeholder fallback
 * @param {string} img - Đường dẫn tương đối hoặc URL tuyệt đối
 * @returns {string}
 */
export const getImageSrc = (img) => {
  if (!img) return noImg;
  return img.startsWith("http") ? img : `${IMAGE_CDN_BASE}${img}`;
};

/**
 * Fallback khi thẻ <img> load ảnh thất bại
 * @param {React.SyntheticEvent<HTMLImageElement, Event>} e
 */
export const handleImgError = (e) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = noImg;
};

export default {
  getImageSrc,
  handleImgError,
};
