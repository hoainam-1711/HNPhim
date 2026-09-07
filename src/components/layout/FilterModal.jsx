import "./FilterModal.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Modal, Tab, Tabs } from "react-bootstrap";
import Loading from "../ui/Loading";
import useGenres from "../../features/movies/hooks/useGenres";
import useCountries from "../../features/movies/hooks/useCountries";

// =========================================================
// 1. DỮ LIỆU TĨNH CỐ ĐỊNH (CONSTANTS)
// =========================================================
const TYPES = [
  { id: "phim-moi", name: "Phim Mới", slug: "phim-moi" },
  { id: "phim-le", name: "Phim Lẻ", slug: "phim-le" },
  { id: "phim-bo", name: "Phim Bộ", slug: "phim-bo" },
  { id: "phim-chieu-rap", name: "Phim Chiếu Rạp", slug: "phim-chieu-rap" },
  { id: "hoat-hinh", name: "Hoạt Hình", slug: "hoat-hinh" },
  { id: "tv-shows", name: "TV Shows", slug: "tv-shows" },
];

// =========================================================
// 2. SUB-COMPONENT PHỤC VỤ HIỂN THỊ TỪNG TAB (TÁI SỬ DỤNG UI)
// Giúp tránh lặp code kiểm tra loading/error giữa Thể loại và Quốc gia
// =========================================================
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

// =========================================================
// 3. MAIN COMPONENT: FILTERMODAL
// =========================================================
const FilterModal = ({ show, handleClose }) => {
  // Quản lý tab đang chọn (type | genre | country)
  const [activeTab, setActiveTab] = useState("type");

  // Fetch dữ liệu Thể loại (Genre) và chuẩn hóa danh sách
  const {
    data: genresData,
    loading: genresLoading,
    error: genresError,
  } = useGenres();
  const genres = genresData?.data?.items || genresData?.items || [];

  // Fetch dữ liệu Quốc gia (Country) và chuẩn hóa danh sách
  const {
    data: countriesData,
    loading: countriesLoading,
    error: countriesError,
  } = useCountries();
  const countries = countriesData?.data?.items || countriesData?.items || [];

  // Thoát sớm nếu Modal không được kích hoạt hiển thị
  if (!show) return null;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      dialogClassName="filter-modal"
      contentClassName="filter-modal-content"
    >
      {/* Tiêu đề Modal */}
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold text-white modal-title">
          Khám Phá Phim
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-0">
        {/* Thanh chuyển đổi Tab dạng cuộn ngang */}
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
              loading={genresLoading}
              error={genresError}
              errorMessage="Không thể tải Thể Loại"
              items={genres}
              pathPrefix="/the-loai"
              onItemClick={handleClose}
            />
          </Tab>

          {/* TAB 3: Quốc gia */}
          <Tab eventKey="country" title="Quốc gia">
            <FilterTabContent
              loading={countriesLoading}
              error={countriesError}
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