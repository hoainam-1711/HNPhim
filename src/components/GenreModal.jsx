import "../css/GenreModal.css";
import { Button, Modal } from "react-bootstrap";
import Loading from "./Loading";
import useGenres from "../hooks/useGenres";
import { Link } from "react-router-dom";

const GenreModal = ({ show, handleClose }) => {
  const { data, loading, error } = useGenres();
  const genres = data?.data?.items || data?.items || [];

  if (!show) return null;

  if (loading) return <Loading />;

  if (error)
    return (
      <div className="text-white text-center pt-5">
        Lỗi: {error.message || "Không thể tải phim"}
      </div>
    );
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
