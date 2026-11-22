import axios from "axios";

/**
 * Kiểm tra xem lỗi có phải do hủy request (AbortController / Axios cancel) hay không
 * @param {Error|any} error
 * @returns {boolean}
 */
export const isCancelError = (error) =>
  axios.isCancel(error) ||
  error?.code === "ERR_CANCELED" ||
  error?.name === "CanceledError" ||
  error?.name === "AbortError";

/**
 * Xử lý và ghi log lỗi tập trung
 * @param {string} message - Thông điệp mô tả ngữ cảnh lỗi
 * @param {Error|any} error - Đối tượng lỗi gốc
 */
export const handleError = (message, error) => {
  if (isCancelError(error)) {
    throw error;
  }

  console.error(`[HNPhim Error]: ${message}`, error);
  throw error;
};

export default handleError;
