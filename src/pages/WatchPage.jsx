import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavbarComponent from "../components/NavbarComponent";
import Footer from "../components/Footer";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import EpisodeSelector from "../components/EpisodeSelector";
import Loading from "../components/Loading";
import CustomVideoPlayer from "../components/CustomVideoPlayer";
import useMovieDetail from "../hooks/useMovieDetail";

const WatchPage = () => {
  const { slug, ep } = useParams();
  const navigate = useNavigate();

  // 1. Sử dụng custom hook useMovieDetail
  const { data, loading, error } = useMovieDetail(slug);

  // 2. Trích xuất dữ liệu phim và danh sách tập
  const movie = data?.movie || data?.data?.item;
  const episodesList = useMemo(() => {
    return data?.episodes || data?.data?.item?.episodes || [];
  }, [data]);

  // State chọn Server và tập hiện tại
  const [selectedServer, setSelectedServer] = useState(0);
  const [currentEpData, setCurrentEpData] = useState(null);

  // 3. Xử lý tìm tập phim khi data, ep hoặc selectedServer thay đổi
  useEffect(() => {
    if (!episodesList.length) return;

    // Lấy server đang chọn
    const server = episodesList[selectedServer] || episodesList[0];

    // Tìm thông tin tập phim dựa trên param 'ep'
    let foundEp = server?.server_data?.find(
      (item) => item.slug === ep || item.name === ep,
    );

    // Tìm ở các server khác nếu không thấy ở server hiện tại
    if (!foundEp) {
      for (const s of episodesList) {
        foundEp = s.server_data?.find(
          (item) => item.slug === ep || item.name === ep,
        );
        if (foundEp) break;
      }
    }

    setCurrentEpData(foundEp || server?.server_data?.[0]);
  }, [episodesList, ep, selectedServer]);

  // Server & Tập mặc định
  const currentServer = episodesList[selectedServer] || episodesList[0];
  const serverData = currentServer?.server_data || [];

  // Hàm chuyển tập phim
  const handleWatchMovie = (targetEp) => {
    if (targetEp) {
      const epSlug = targetEp.slug || targetEp.name;
      navigate(`/xem/${slug}/${epSlug}`);
    } else {
      console.warn("Chưa có thông tin tập phim để xem!");
    }
  };

  if (loading) return <Loading />;
  if (error)
    return (
      <div className="text-white text-center pt-5">
        Lỗi: {error.message || "Không thể tải phim"}
      </div>
    );
  return (
    <div
      className="text-white min-vh-100 d-flex flex-column justify-content-between"
      style={{ backgroundColor: "#0f0f0f" }}
    >
      <div>
        {/* Header */}
        <NavbarComponent />

        {/* Body */}
        <Container fluid="lg">
          {/* Tên Phim & Tập */}
          <div className="mb-2">
            <h5 className="fw-bold mb-1 text-danger">
              {movie?.name}{" "}
              <span className="text-white">- {currentEpData?.name || ep}</span>
            </h5>
          </div>

          <Row className="g-4">
            {/* Player Video (Bên trái / Phía trên) */}
            <Col xs={12} lg={8} xl={9}>
              {currentEpData?.link_embed ? ( // Dự phòng trường hợp không có link m3u8 thì mới dùng embed
                <div className="ratio ratio-16x9 rounded overflow-hidden shadow-lg bg-black">
                  <iframe
                    src={currentEpData.link_embed}
                    title={currentEpData.name}
                    allowFullScreen
                  ></iframe>
                  {console.log("đang phát bằng link embed")}
                </div>
              ) : currentEpData?.link_m3u8 ? (
                <>
                  <CustomVideoPlayer
                    src={currentEpData.link_m3u8}
                    poster={movie?.poster_url || movie?.thumb_url}
                  />
                  {console.log("đang phát bằng link m3u8")}
                </>
              ) : (
                <div className="ratio ratio-16x9 rounded d-flex align-items-center justify-content-center bg-dark text-secondary">
                  <p className="mb-0">
                    Đang tải video hoặc không tìm thấy tập phim...
                  </p>
                </div>
              )}
            </Col>

            {/* Sidebar Danh Sách Tập & Server (Bên phải / Phía dưới) */}
            <Col xs={12} lg={4} xl={3}>
              <Card className="bg-dark text-white border-secondary h-100 shadow">
                <Card.Header className="border-secondary d-flex align-items-center justify-content-between flex-wrap gap-2 py-3 bg-black bg-opacity-25">
                  <h6 className="mb-0 text-danger fw-bold">🎬 Danh Sách Tập</h6>

                  {/* Chọn Server (Vietsub / Lồng tiếng) */}
                  {episodesList?.length > 1 && (
                    <div className="d-flex gap-1 flex-wrap">
                      {episodesList.map((server, idx) => (
                        <Button
                          key={idx}
                          size="sm"
                          variant={
                            selectedServer === idx ? "danger" : "outline-light"
                          }
                          className="px-2 py-0 fs-7"
                          onClick={() => setSelectedServer(idx)}
                        >
                          {server.server_name || `Server ${idx + 1}`}
                        </Button>
                      ))}
                    </div>
                  )}
                </Card.Header>

                <Card.Body className="p-3">
                  {/* Sửa lại: Truyền ep dạng string từ useParams xuống */}
                  <EpisodeSelector
                    serverData={serverData}
                    handleWatchMovie={handleWatchMovie}
                    currentEpSlug={ep}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default WatchPage;
