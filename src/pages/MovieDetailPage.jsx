import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import EpisodeSelector from "../components/EpisodeSelector";
import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";
import noImg from "../assets/no-image.png";
import { MovieContext } from "../context/MovieContext";
import LucideIcon from "../components/LucideIcon";
import useMovieDetail from "../hooks/useMovieDetail";

const MovieDetailPage = () => {
  const { slug } = useParams();

  const { data, loading } = useMovieDetail(slug);
  const movie = data?.movie || {};
  const episodesList = data?.episodes || [];

  const navigate = useNavigate();

  // Lấy hàm toggleFavorite và isFavorite từ Context
  const { toggleFavorite, isFavorite } = useContext(MovieContext);
  const favorited = isFavorite(movie.slug);

  // State chọn Server (Vietsub / Lồng Tiếng)
  const [selectedServer, setSelectedServer] = useState(0);

  // Lấy thông tin server hiện tại an toàn
  const currentServer = episodesList[selectedServer] || episodesList[0];
  const serverData = currentServer?.server_data || [];
  const firstEpisode = serverData[0];

  // Hàm chuyển sang trang xem phim
  const handleWatchMovie = (ep) => {
    const targetEp = ep || firstEpisode;

    if (targetEp) {
      const epSlug = targetEp.slug || targetEp.name;

      // URL sinh ra sẽ là: /xem/dao-hai-tac/tap-1
      navigate(`/xem/${movie.slug}/${epSlug}`);
    } else {
      console.warn("Chưa có thông tin tập phim để xem!");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="d-flex flex-column justify-content-between">
      <div>
        <Container className="py-4">
          {/* TOP SECTION: Poster & Thông tin chi tiết */}
          <Row className="g-4 mb-5">
            {/* Poster Phim */}
            <Col xs={12} md={4} lg={3}>
              <div
                className="position-relative overflow-hidden rounded shadow-lg"
                style={{ aspectRatio: "2/3" }}
              >
                <img
                  src={movie?.poster_url || movie?.thumb_url}
                  alt={movie?.name}
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = noImg;
                  }}
                />
                {movie?.quality && (
                  <Badge
                    bg="danger"
                    className="position-absolute top-0 start-0 m-2 px-2 py-1 fs-6 fw-bold"
                  >
                    {movie.quality}
                  </Badge>
                )}
              </div>
            </Col>

            {/* Thông tin Phim */}
            <Col
              xs={12}
              md={8}
              lg={9}
              className="d-flex flex-column justify-content-between"
            >
              <div>
                <h1 className="fw-bold text-danger mb-1">{movie?.name}</h1>
                {movie?.origin_name && (
                  <h5 className="text-secondary mb-3 fst-italic">
                    {movie.origin_name} {movie.year ? `(${movie.year})` : ""}
                  </h5>
                )}

                {/* Tags Metadata */}
                <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                  <Badge
                    bg="dark"
                    className="border border-secondary px-2 py-2"
                  >
                    ⏱️ {movie?.time || "N/A"}
                  </Badge>
                  <Badge
                    bg="dark"
                    className="border border-secondary px-2 py-2"
                  >
                    🔊 {movie?.lang || "Thuyết minh"}
                  </Badge>
                  <Badge
                    bg="dark"
                    className="border border-secondary px-2 py-2"
                  >
                    🎬 {movie?.episode_current || "Full"}
                  </Badge>
                  {movie?.tmdb?.vote_average && (
                    <Badge
                      bg="warning"
                      text="dark"
                      className="fw-bold px-2 py-2"
                    >
                      ⭐ TMDB: {movie.tmdb.vote_average} (
                      {movie.tmdb.vote_count} lượt)
                    </Badge>
                  )}
                </div>

                {/* Thể loại, Quốc gia, Đạo diễn, Diễn viên */}
                <div className="mb-2">
                  <strong className="text-secondary">Thể loại: </strong>
                  {movie?.category?.map((cat) => (
                    <Badge
                      key={cat.id || cat._id}
                      bg="secondary"
                      className="me-1 fw-normal"
                    >
                      {cat.name}
                    </Badge>
                  ))}
                </div>

                <div className="mb-2">
                  <strong className="text-secondary">Quốc gia: </strong>
                  {movie?.country?.map((c) => (
                    <span key={c.id || c._id} className="text-light me-2">
                      {c.name}
                    </span>
                  ))}
                </div>

                <div className="mb-2">
                  <strong className="text-secondary">Đạo diễn: </strong>
                  <span className="text-light">
                    {Array.isArray(movie?.director)
                      ? movie.director.join(", ")
                      : movie?.director || "Đang cập nhật"}
                  </span>
                </div>

                <div className="mb-3">
                  <strong className="text-secondary">Diễn viên: </strong>
                  <span className="text-light">
                    {Array.isArray(movie?.actor)
                      ? movie.actor.slice(0, 8).join(", ")
                      : movie?.actor || "Đang cập nhật"}
                  </span>
                </div>

                <div className="d-flex my-4">
                  {/* Nút Xem Ngay Tập 1 */}
                  <Button
                    variant="danger"
                    className="btn-lg me-1 fw-bold"
                    onClick={() => handleWatchMovie(firstEpisode)}
                    disabled={!firstEpisode}
                  >
                    ▶ Xem Phim
                  </Button>

                  {/* Nút lưu phim yêu thích */}
                  <Button
                    variant="link"
                    className="fw-bold text-decoration-none"
                    onClick={(e) => {
                      e.preventDefault(); // Chặn thẻ <Link> ở ngoài kích hoạt
                      e.stopPropagation(); // 5. QUAN TRỌNG: Ngăn chuyển trang khi bấm nút bookmark
                      toggleFavorite(movie);
                    }}
                  >
                    {" "}
                    Lưu
                    {favorited ? (
                      <LucideIcon icon="BookmarkCheck" />
                    ) : (
                      <LucideIcon icon="Bookmark" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Mô tả Nội dung phim */}
              <div className="bg-dark bg-opacity-50 p-3 rounded border border-secondary border-opacity-25">
                <h5 className="text-danger fw-bold mb-2">Nội Dung Phim</h5>
                <p
                  className="text-light mb-0"
                  style={{
                    fontSize: "0.95rem",
                    lineHeight: "1.6",
                    color: "#ccc",
                  }}
                >
                  {movie?.content?.replace(/<[^>]*>?/gm, "") ||
                    "Chưa có mô tả cho phim này."}
                </p>
              </div>
            </Col>
          </Row>

          {/* BOTTOM SECTION: Danh Sách Server & Tập Phim Chia Nhóm */}
          {episodesList && episodesList.length > 0 && (
            <Row className="mt-4">
              <Col xs={12}>
                <Card className="bg-dark text-white border-secondary">
                  <Card.Header className="border-secondary d-flex align-items-center justify-content-between flex-wrap gap-2 py-3">
                    <h5 className="mb-0 text-danger fw-bold">
                      Danh Sách Tập / Server
                    </h5>

                    {/* Chọn Server (Vietsub / Lồng tiếng...) */}
                    {episodesList?.length > 1 && (
                      <div className="d-flex gap-2">
                        {episodesList.map((server, idx) => (
                          <Button
                            key={idx}
                            size="sm"
                            variant={
                              selectedServer === idx
                                ? "danger"
                                : "outline-light"
                            }
                            onClick={() => setSelectedServer(idx)}
                          >
                            {server.server_name || `Server ${idx + 1}`}
                          </Button>
                        ))}
                      </div>
                    )}
                  </Card.Header>

                  <Card.Body>
                    {/* Gọi Component EpisodeSelector tại đây */}
                    <EpisodeSelector
                      serverData={serverData}
                      handleWatchMovie={handleWatchMovie}
                    />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Từ khóa Phim */}
          {movie?.keywords && movie.keywords.length > 0 && (
            <Row className="mt-4">
              <Col xs={12}>
                <div className="d-flex flex-wrap align-items-center gap-1">
                  <small className="text-secondary me-2">Từ khóa:</small>
                  {movie.keywords.map((kw, i) => (
                    <Badge
                      key={i}
                      bg="dark"
                      text="secondary"
                      className="fw-normal border border-secondary"
                    >
                      #{kw}
                    </Badge>
                  ))}
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </div>
  );
};

export default MovieDetailPage;
