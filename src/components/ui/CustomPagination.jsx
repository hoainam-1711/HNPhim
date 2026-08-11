import "./CustomPagination.css";
import { Button } from "react-bootstrap";
import LucideIcon from "./LucideIcon";

// Tạo danh sách số trang + dấu "..."
const getPaginationRange = (currentPage, totalPages) => {
  const delta = 1;
  const range = [];
  const rangeWithDots = [];

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      range.push(i);
    }
  }

  let prev = 0;

  for (const i of range) {
    if (prev) {
      if (i - prev > 1) {
        rangeWithDots.push("...");
      }
    }

    rangeWithDots.push(i);
    prev = i;
  }

  return rangeWithDots;
};

export default function CustomPagination({ page, totalPages, setPage }) {
  if (!totalPages || totalPages <= 1) return null;

  const pages = getPaginationRange(page, totalPages);

  return (
    <div className="custom-pagination">
      {/* Trang trước */}
      <Button
        className="pagination-btn pagination-arrow"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        <LucideIcon icon="ChevronLeft" />
      </Button>

      {/* Số trang */}
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

      {/* Trang sau */}
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
