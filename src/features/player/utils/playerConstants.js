/**
 * playerConstants.js
 * Tập trung toàn bộ hằng số cấu hình trình phát video HLS, phím tắt và playlist
 */

// Danh sách các mốc tốc độ phát hỗ trợ
export const PLAYBACK_RATES = [1, 1.25, 1.5, 2];

// Các mốc thời gian tua (giây)
export const SEEK_STEP_SMALL = 10; // Phím mũi tên trái/phải, nút rotate 10s
export const SEEK_STEP_LARGE = 30; // Phím tắt S (tua nhanh 30s)
export const SKIP_ADS_SECONDS = 28; // Nút bỏ qua QC/giới thiệu trên toolbar

// Bước tăng giảm âm lượng (10%)
export const VOLUME_STEP = 0.1;

// Cấu hình tính năng Auto Skip
export const AUTO_SKIP_KEY = "family_auto_skip_15m";
export const AUTO_SKIP_TIME = 900; // Mốc 15 phút (900 giây)
export const AUTO_SKIP_STEP = 30; // Tua tiến 30 giây khi chạm mốc

// Thời gian chờ tự động ẩn controls khi không tương tác (ms)
export const CONTROLS_HIDE_TIMEOUT = 3000;

// Số lượng tập phim mỗi nhóm phân đoạn (chunk)
export const EPISODES_PER_CHUNK = 100;

// Bản đồ phím tắt bàn phím
export const KEYBOARD_SHORTCUTS = {
  SPACE: "Space", // Phát / Tạm dừng
  ARROW_LEFT: "ArrowLeft", // Tua lùi 10s
  ARROW_RIGHT: "ArrowRight", // Tua tiến 10s
  ARROW_UP: "ArrowUp", // Tăng 10% âm lượng
  ARROW_DOWN: "ArrowDown", // Giảm 10% âm lượng
  KEY_M: "KeyM", // Tắt / Bật tiếng
  KEY_F: "KeyF", // Bật / Tắt toàn màn hình
  KEY_S: "KeyS", // Tua nhanh 30s
};
