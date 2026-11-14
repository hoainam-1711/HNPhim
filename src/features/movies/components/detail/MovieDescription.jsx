import { useState } from "react";
import { Button } from "react-bootstrap";
import DOMPurify from "dompurify";

/**
 * Hiển thị tóm tắt nội dung phim dạng accordion rút gọn/mở rộng
 */
const MovieDescription = ({ content }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="movie-description">
      <h5 className="movie-description-title">Nội dung phim</h5>

      <div
        className={`movie-description-text ${!isExpanded ? "collapsed" : ""}`}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(content || "Chưa có mô tả cho phim này."),
        }}
      />

      {content && (
        <Button
          variant="link"
          className="btn-toggle-desc"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          {isExpanded ? "Thu gọn" : "Xem thêm"}
        </Button>
      )}
    </div>
  );
};

export default MovieDescription;
