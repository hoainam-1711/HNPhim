import noImg from "../assets/no-image.webp";

const IMAGE_CDN_BASE = "https://phimimg.com/";

// Lấy link ảnh chuẩn
export const getImageSrc = (img) => {
  if (!img) return noImg;
  return img.startsWith("http") ? img : `${IMAGE_CDN_BASE}${img}`;
};

// Xử lý ảnh lỗi
export const handleImgError = (e) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = noImg;
};
