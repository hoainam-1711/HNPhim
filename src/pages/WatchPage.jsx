import "./WatchPage.css";
import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import Loading from "@/core/components/ui/Loading";
import SEO from "@/core/components/ui/SEO";
import { useMovieDetail } from "@/features/movies";
import {
  CustomVideoPlayer,
  EpisodeSelector,
  useEpisodePlaylist,
} from "@/features/player";

const WatchPage = () => {
  const { slug, ep } = useParams();

  // 1. Tải dữ liệu phim
  const { data, loading, error } = useMovieDetail(slug);
  const movie = data?.movie || {};
  const episodesList = useMemo(() => data?.episodes || [], [data]);

  // 2. Logic điều hướng danh sách tập & server từ player feature
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

            {/* SIDEBAR TẬP PHIM (Server Tabs + Episode List hợp nhất) */}
            <Col xs={12} xl={4}>
              <div className="watch-sidebar">
                <EpisodeSelector
                  pageType="watch"
                  episodesList={episodesList}
                  selectedServer={selectedServer}
                  onSelectServer={setSelectedServer}
                  serverData={serverData}
                  handleWatchMovie={handleWatchMovie}
                  currentEpSlug={ep}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default WatchPage;
