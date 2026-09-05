import "./WatchPage.css";
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button, Col, Container, Row } from "react-bootstrap";
import EpisodeSelector from "../features/player/components/EpisodeSelector";
import Loading from "../components/ui/Loading";
import CustomVideoPlayer from "../features/player/components/CustomVideoPlayer";
import useMovieDetail from "../features/movies/hooks/useMovieDetail";
import SEO from "../components/SEO";

const WatchPage = () => {
  const { slug, ep } = useParams();
  const navigate = useNavigate();

  // 1. Sử dụng custom hook useMovieDetail
  const { data, loading, error } = useMovieDetail(slug);

  // 2. Trích xuất dữ liệu phim và danh sách tập
  const movie = data?.movie || {};
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

  const handleNextEpisode = () => {
    if (!currentEpData || !serverData.length) return;

    const currentIndex = serverData.findIndex(
      (item) => item.slug === currentEpData.slug,
    );

    if (currentIndex === -1) return;

    const nextEpisode = serverData[currentIndex + 1];

    if (!nextEpisode) {
      console.log("Đã là tập cuối");
      return;
    }

    const epSlug = nextEpisode.slug || nextEpisode.name;

    navigate(`/xem/${slug}/${epSlug}`);
  };

  const isLastEpisode = () => {
    const currentIndex = serverData.findIndex(
      (item) => item.slug === currentEpData?.slug,
    );

    return currentIndex === -1 || currentIndex === serverData.length - 1;
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="text-white text-center py-5">
        Lỗi:{" "}
        {"WatchPage: " + error.message ||
          "WatchPage: Không thể tải danh sách phim"}
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${movie.name} - ${currentEpData?.name || ep}`}
        description={`Xem ${movie.name} ${currentEpData?.name || ep} online chất lượng cao. Xem phim với đầy đủ các tập mới nhất.`}
        image={movie.thumb_url}
        url={`/xem/${movie.slug}/${currentEpData?.slug}`}
        robots="noindex, follow"
      />

      <div className="watch-page">
        <Container fluid className="watch-container">
          {/* Tên phim + tập hiện tại */}
          <div className="watch-heading">
            <h5 className="watch-title">
              <Link
                to={`/chi-tiet/${slug}`}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                {movie?.name}
              </Link>

              <span className="watch-episode">{currentEpData?.name || ep}</span>
            </h5>
          </div>

          <Row className="watch-layout g-3">
            {/* ================================
              VIDEO PLAYER
          ================================= */}
            <Col xs={12} xl={8}>
              <div className="watch-player-wrapper">
                {currentEpData?.link_m3u8 ? (
                  <CustomVideoPlayer
                    m3u8Url={currentEpData.link_m3u8}
                    poster={movie?.poster_url || movie?.thumb_url}
                    onNextEpisode={handleNextEpisode}
                    isLastEpisode={isLastEpisode}
                  />
                ) : currentEpData?.link_embed ? (
                  <div className="watch-embed ratio ratio-16x9">
                    <iframe
                      src={currentEpData.link_embed}
                      title={currentEpData.name}
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="watch-player-error">
                    <p>{error || "Không thể phát tập phim này."}</p>
                  </div>
                )}
              </div>
            </Col>

            {/* ================================
              EPISODE SIDEBAR
          ================================= */}
            <Col xs={12} xl={4}>
              <div className="watch-sidebar">
                {/* Header */}
                <div className="watch-sidebar-header">
                  <h6 className="watch-sidebar-title">Danh sách tập</h6>

                  {/* Server */}
                  {episodesList?.length > 1 && (
                    <div className="watch-server-list">
                      {episodesList.map((server, idx) => (
                        <Button
                          key={idx}
                          size="sm"
                          variant="link"
                          className={`watch-server-btn ${
                            selectedServer === idx ? "active" : ""
                          }`}
                          onClick={() => setSelectedServer(idx)}
                        >
                          {server.server_name || `Server ${idx + 1}`}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Episodes */}
                <div className="p-3 overflow-hidden">
                  <EpisodeSelector
                    serverData={serverData}
                    handleWatchMovie={handleWatchMovie}
                    currentEpSlug={ep}
                    pageType="watch"
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default WatchPage;
