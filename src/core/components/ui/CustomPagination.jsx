import "./CustomPagination.css";
import { Button } from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Tạo danh sách các trang cần hiển thị
 * @param {number} currentPage
 * @param {number} totalPages
 * @returns {Array<number|string>}
 */
const getPaginationRange = (currentPage, totalPages) => {
  const delta = 1;
  const range = [];
  const rangeWithDots = [];

  for (let page = 1; page <= totalPages; page++) {
    const isFirstPage = page === 1;
    const isLastPage = page === totalPages;
    const isNearCurrentPage =
      page >= currentPage - delta && page <= currentPage + delta;

    if (isFirstPage || isLastPage || isNearCurrentPage) {
      range.push(page);
    }
  }

  let previousPage = 0;
  for (const page of range) {
    if (previousPage && page - previousPage > 1) {
      rangeWithDots.push("...");
    }
    rangeWithDots.push(page);
    previousPage = page;
  }

  return rangeWithDots;
};

/**
 * Component phân trang tùy chỉnh
 * @param {Object} props
 * @param {number} props.page - Trang hiện tại
 * @param {number} props.totalPages - Tổng số trang
 * @param {Function} props.setPage - Callback thay đổi trang
 */
export default function CustomPagination({ page, totalPages, setPage }) {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  const pages = getPaginationRange(page, totalPages);

  return (
    <div className="custom-pagination">
      <Button
        className="pagination-btn pagination-arrow"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        <ChevronLeft />
      </Button>

      {pages.map((item, index) => {
        if (item === "...") {
          return (
            <span key={`dots-${index}`} className="pagination-dots">
              ...
            </span>
          );
        }

        const isActive = item === page;

        return (
          <Button
            key={item}
            className={`pagination-btn ${isActive ? "pagination-active" : ""}`}
            onClick={() => setPage(item)}
          >
            {item}
          </Button>
        );
      })}

      <Button
        className="pagination-btn pagination-arrow"
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
