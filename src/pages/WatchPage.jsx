import "./WatchPage.css";
import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, Col, Container, Row } from "react-bootstrap";
import EpisodeSelector from "../features/player/components/EpisodeSelector";
import Loading from "@/core/components/ui/Loading";
import CustomVideoPlayer from "../features/player/components/CustomVideoPlayer";
import useMovieDetail from "../features/movies/hooks/useMovieDetail";
import useEpisodePlaylist from "../features/player/hooks/useEpisodePlaylist";
import SEO from "@/core/components/ui/SEO";

const WatchPage = () => {
  const { slug, ep } = useParams();

  // 1. Tải dữ liệu phim
  const { data, loading, error } = useMovieDetail(slug);
  const movie = data?.movie || {};
  const episodesList = useMemo(() => data?.episodes || [], [data]);

  // 2. Logic điều hướng danh sách tập & server
  const {
    selectedServer,
    setSelectedServer,
    currentEpData,
    serverData,
    handleWatchMovie,
    handleNextEpisode,
    isLastEpisode,
  } = useEpisodePlaylist({ episodesList, ep, slug });

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="text-white text-center py-5">
        Lỗi: {error.message || "Không thể tải danh sách phim"}
      </div>
    );
  }

  const epDisplayName = currentEpData?.name || ep;

  return (
    <>
      <SEO
        title={`${movie.name || "Xem phim"} - ${epDisplayName}`}
        description={`Xem ${movie.name || ""} ${epDisplayName} online chất lượng cao. Đầy đủ các tập mới nhất.`}
        image={movie.thumb_url}
        url={`/xem/${movie.slug}/${currentEpData?.slug || ep}`}
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
              <span className="watch-episode">{epDisplayName}</span>
            </h5>
          </div>

          <Row className="watch-layout g-3">
            {/* VIDEO PLAYER */}
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
                    <p>Không tìm thấy nguồn phát cho tập phim này.</p>
                  </div>
                )}
              </div>
            </Col>

            {/* SIDEBAR TẬP PHIM */}
            <Col xs={12} xl={4}>
              <div className="watch-sidebar">
                <div className="watch-sidebar-header">
                  <h6 className="watch-sidebar-title">Danh sách tập</h6>

                  {episodesList.length > 1 && (
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
