import { Button } from "react-bootstrap";
import LucideIcon from "./LucideIcon";

// Hàm tính toán danh sách số trang có dấu "..."
const getPaginationRange = (currentPage, totalPages) => {
  const delta = 2; // Số trang hiển thị quanh trang hiện tại
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
      if (i - prev === 2) {
        rangeWithDots.push(prev + 1);
      } else if (i - prev > 2) {
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

  // Style chung cho các nút bấm dạng Dark Theme
  const baseBtnStyle = {
    minWidth: "38px",
    height: "38px",
    padding: "0 10px",
    borderRadius: "6px",
    fontWeight: "500",
    border: "1px solid #333",
    transition: "all 0.2s ease-in-out",
  };

  return (
    <div className="d-flex justify-content-center align-items-center gap-2 my-4">
      {/* Nút Trang trước < */}
      <Button
        variant="dark"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        style={{
          ...baseBtnStyle,
          backgroundColor: "#1a1a1a",
          color: page === 1 ? "#555" : "#fff",
        }}
      >
        <LucideIcon icon="ChevronLeft" />
      </Button>

      {/* Danh sách các số trang */}
      {pages.map((item, index) => {
        if (item === "...") {
          return (
            <span
              key={`dots-${index}`}
              className="text-secondary px-1 fw-bold"
              style={{ userSelect: "none" }}
            >
              ...
            </span>
          );
        }

        const isActive = item === page;

        return (
          <Button
            key={item}
            onClick={() => setPage(item)}
            style={{
              ...baseBtnStyle,
              // Trang hiện tại nổi bật (Màu đỏ sẫm/sáng), trang khác nền xám tối
              backgroundColor: isActive ? "#0991e5" : "#2b2b2b",
              borderColor: isActive ? "#0991e5" : "#383838",
              color: "#ffffff",
              fontWeight: isActive ? "bold" : "normal",
              boxShadow: isActive ? "0 0 10px rgba(9, 24, 229, 0.5)" : "none",
            }}
          >
            {item}
          </Button>
        );
      })}

      {/* Nút Trang sau > */}
      <Button
        variant="dark"
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        style={{
          ...baseBtnStyle,
          backgroundColor: "#1a1a1a",
          color: page === totalPages ? "#555" : "#fff",
        }}
      >
        <LucideIcon icon="ChevronRight" />
      </Button>
    </div>
  );
}
