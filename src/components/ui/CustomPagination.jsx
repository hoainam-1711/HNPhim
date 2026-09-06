import "./CustomPagination.css";
import { Button } from "react-bootstrap";
import LucideIcon from "./LucideIcon";

// ==============================
// PAGINATION HELPER
// ==============================

/**
 * Tạo danh sách các trang cần hiển thị.
 *
 * Ví dụ:
 * - Trang hiện tại: 1, tổng: 10
 *   => [1, 2, "...", 10]
 *
 * - Trang hiện tại: 5, tổng: 10
 *   => [1, "...", 4, 5, 6, "...", 10]
 *
 * Luôn hiển thị:
 * - Trang đầu tiên
 * - Trang cuối cùng
 * - Trang hiện tại
 * - 1 trang trước và 1 trang sau trang hiện tại
 *
 * Các khoảng trang bị bỏ qua sẽ được thay bằng dấu "..."
 */
const getPaginationRange = (currentPage, totalPages) => {
  // Số lượng trang hiển thị ở mỗi bên của trang hiện tại.
  const delta = 1;

  // Lưu các số trang thực tế cần hiển thị.
  const range = [];

  // Lưu kết quả cuối cùng, bao gồm cả dấu "...".
  const rangeWithDots = [];

  // ==============================
  // BƯỚC 1: XÁC ĐỊNH CÁC TRANG
  // ==============================
  for (let page = 1; page <= totalPages; page++) {
    const isFirstPage = page === 1;
    const isLastPage = page === totalPages;

    // Kiểm tra trang có nằm gần trang hiện tại hay không.
    const isNearCurrentPage =
      page >= currentPage - delta &&
      page <= currentPage + delta;

    // Chỉ thêm các trang cần thiết để tránh hiển thị quá nhiều nút.
    if (isFirstPage || isLastPage || isNearCurrentPage) {
      range.push(page);
    }
  }

  // ==============================
  // BƯỚC 2: THÊM DẤU "..."
  // ==============================

  // Theo dõi trang trước đó để phát hiện khoảng cách bị bỏ qua.
  let previousPage = 0;

  for (const page of range) {
    // Nếu khoảng cách giữa 2 trang lớn hơn 1,
    // nghĩa là có các trang bị ẩn ở giữa.
    if (previousPage && page - previousPage > 1) {
      rangeWithDots.push("...");
    }

    rangeWithDots.push(page);
    previousPage = page;
  }

  return rangeWithDots;
};

// ==============================
// CUSTOM PAGINATION COMPONENT
// ==============================

/**
 * Component phân trang tùy chỉnh.
 *
 * @param {number} page - Trang hiện tại.
 * @param {number} totalPages - Tổng số trang.
 * @param {Function} setPage - Hàm cập nhật trang hiện tại.
 */
export default function CustomPagination({
  page,
  totalPages,
  setPage,
}) {
  // Không cần hiển thị phân trang nếu chỉ có 1 trang hoặc không có dữ liệu.
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  // Tạo danh sách các trang và dấu "..." cần hiển thị.
  const pages = getPaginationRange(page, totalPages);

  return (
    <div className="custom-pagination">
      {/* ==========================
          NÚT TRANG TRƯỚC
      ========================== */}
      <Button
        className="pagination-btn pagination-arrow"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        <LucideIcon icon="ChevronLeft" />
      </Button>

      {/* ==========================
          DANH SÁCH SỐ TRANG
      ========================== */}
      {pages.map((item, index) => {
        // Hiển thị dấu "..." cho các khoảng trang bị rút gọn.
        if (item === "...") {
          return (
            <span
              key={`dots-${index}`}
              className="pagination-dots"
            >
              ...
            </span>
          );
        }

        // Kiểm tra xem đây có phải trang hiện tại không
        // để áp dụng class CSS tương ứng.
        const isActive = item === page;

        return (
          <Button
            key={item}
            className={`pagination-btn ${
              isActive ? "pagination-active" : ""
            }`}
            onClick={() => setPage(item)}
          >
            {item}
          </Button>
        );
      })}

      {/* ==========================
          NÚT TRANG SAU
      ========================== */}
      <Button
        className="pagination-btn pagination-arrow"
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
      >
        <LucideIcon icon="ChevronRight" />
      </Button>
    </div>
  );
}
