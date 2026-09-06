import "./GenreModal.css";
import { Link } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import useGenres from "../../features/movies/hooks/useGenres";
import Loading from "../ui/Loading";

const GenreModal = ({ show, handleClose }) => {
  // 1. Lấy dữ liệu thể loại từ Custom Hook
  const { data, loading, error } = useGenres();
  
  // Chuẩn hóa danh sách thể loại hỗ trợ nhiều cấu trúc trả về từ API
  const genres = data?.data?.items || data?.items || [];

  // 2. Kiểm tra điều kiện render sớm (Early Returns)
  if (!show) return null;
  if (loading) return <Loading />;
  if (error) {
    return (
      <div className="text-white text-center pt-5">
        Lỗi: {error.message || "Không thể tải phim"}
      </div>
    );
  }

  // 3. Render Modal danh sách thể loại
  return (
    <Modal
      show={show}
      onHide={handleClose}
      dialogClassName="genre-modal"
      contentClassName="genre-modal-content"
    >
      <Modal.Header closeButton>
        <Modal.Title>Thể loại</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="genre-grid">
          {genres.map((g) => (
            <Button
              key={g.id || g._id}
              as={Link}
              to={`/the-loai/${g?.slug}`}
              onClick={handleClose}
              className="genre-item"
            >
              {g?.name}
            </Button>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default GenreModal;