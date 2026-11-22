import DOMPurify from "dompurify";

/**
 * Làm sạch mã HTML thành văn bản thuần (plain text), loại bỏ mã độc và cắt ngắn cho SEO
 * @param {string} html - Chuỗi HTML thô
 * @param {number} maxLength - Độ dài tối đa (chuẩn meta description: 160 ký tự)
 * @returns {string}
 */
export const cleanDescription = (html = "", maxLength = 160) => {
  if (typeof html !== "string") return "";

  // Dùng DOMPurify loại bỏ hoàn toàn các thẻ HTML và scripts
  const sanitizedText = DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });

  return sanitizedText
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
};

export default cleanDescription;
