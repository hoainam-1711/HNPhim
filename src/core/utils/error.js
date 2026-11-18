/**
 * Xử lý và ghi log lỗi tập trung
 * @param {string} message - Thông điệp mô tả ngữ cảnh lỗi
 * @param {Error|any} error - Đối tượng lỗi gốc
 */
export const handleError = (message, error) => {
  console.error(`[HNPhim Error]: ${message}`, error);
  throw error;
};

export default handleError;
