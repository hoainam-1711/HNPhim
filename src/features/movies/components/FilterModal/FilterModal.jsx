import "./FilterModal.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Modal, Tab, Tabs } from "react-bootstrap";
import Loading from "@/core/components/ui/Loading";
import useFilterData from "../../hooks/useFilterData";

const TYPES = [
  { id: "phim-moi", name: "Phim Mới", slug: "phim-moi" },
  { id: "phim-le", name: "Phim Lẻ", slug: "phim-le" },
  { id: "phim-bo", name: "Phim Bộ", slug: "phim-bo" },
  { id: "phim-chieu-rap", name: "Phim Chiếu Rạp", slug: "phim-chieu-rap" },
  { id: "hoat-hinh", name: "Hoạt Hình", slug: "hoat-hinh" },
  { id: "tv-shows", name: "TV Shows", slug: "tv-shows" },
];

const FilterTabContent = ({
  loading,
  error,
  errorMessage,
  items,
  pathPrefix,
  onItemClick,
}) => {
  return (
    <div className="tab-content-container p-3">
      {loading ? (
        <Loading />
      ) : error ? (
        <div className="text-secondary text-center py-4">
          {error.message || errorMessage}
        </div>
      ) : (
        <div className="filter-grid">
          {items.map((item) => (
            <Button
              key={item.id || item._id}
              as={Link}
              to={`${pathPrefix}/${item?.slug}`}
              onClick={onItemClick}
              className="filter-item"
            >
              {item?.name}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export const FilterModal = ({ show, handleClose }) => {
  const [activeTab, setActiveTab] = useState("type");
  const [hasOpened, setHasOpened] = useState(false);

  // Lazy-fetch khi mở modal lần đầu
  useEffect(() => {
    if (show && !hasOpened) {
      setHasOpened(true);
    }
  }, [show, hasOpened]);

  // Tải đồng thời thể loại & quốc gia qua hook gộp useFilterData
  const { data, loading, error } = useFilterData(hasOpened);
  const genres = data?.genres || [];
  const countries = data?.countries || [];

  if (!show) return null;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      dialogClassName="filter-modal"
      contentClassName="filter-modal-content"
    >
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold text-white modal-title">
          Khám Phá Phim
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-0">
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="filter-tabs px-3 pt-2 border-bottom border-secondary border-opacity-25"
        >
          {/* TAB 1: Danh sách loại phim */}
          <Tab eventKey="type" title="Danh Sách">
            <div className="tab-content-container p-3">
              <div className="filter-grid">
                {TYPES.map((t) => (
                  <Button
                    key={t.id || t._id}
                    as={Link}
                    to={`/loai/${t?.slug}`}
                    onClick={handleClose}
                    className="filter-item"
                  >
                    {t?.name}
                  </Button>
                ))}
              </div>
            </div>
          </Tab>

          {/* TAB 2: Thể loại phim */}
          <Tab eventKey="genre" title="Thể Loại">
            <FilterTabContent
              loading={loading}
              error={error}
              errorMessage="Không thể tải Thể Loại"
              items={genres}
              pathPrefix="/the-loai"
              onItemClick={handleClose}
            />
          </Tab>

          {/* TAB 3: Quốc gia */}
          <Tab eventKey="country" title="Quốc gia">
            <FilterTabContent
              loading={loading}
              error={error}
              errorMessage="Không thể tải Quốc Gia"
              items={countries}
              pathPrefix="/quoc-gia"
              onItemClick={handleClose}
            />
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
};

export default FilterModal;
