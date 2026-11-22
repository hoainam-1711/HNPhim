import "./EpisodeSelector.css";
import { useState, useMemo, useEffect, memo } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { EPISODES_PER_CHUNK } from "../utils/playerConstants";

/**
 * 1. Nút tập phim nhỏ được bọc React.memo
 * Chỉ re-render nút cũ vừa bỏ chọn và nút mới được active
 */
const EpisodeItem = memo(function EpisodeItem({ ep, isSelected, onSelect }) {
  return (
    <Button
      variant="link"
      className={`episode-item ${isSelected ? "active" : ""}`}
      onClick={() => onSelect(ep)}
    >
      {ep.name}
    </Button>
  );
});

/**
 * 2. EpisodeSelector
 * Component hợp nhất quản lý cả:
 * - Danh sách Server tabs
 * - Phân trang nhóm tập (Chunking 100 tập/nhóm)
 * - Lưới tập phim với khả năng highlight tập đang xem
 * Dùng chung cho cả MovieDetailPage (pageType="detail") và WatchPage (pageType="watch").
 */
export const EpisodeSelector = ({
  episodesList = [],
  selectedServer = 0,
  onSelectServer,
  serverData,
  handleWatchMovie,
  onSelectEpisode,
  currentEpSlug,
  pageType = "detail",
}) => {
  const onEpisodeClick = handleWatchMovie || onSelectEpisode;
  const [selectedChunkIndex, setSelectedChunkIndex] = useState(0);

  // Xác định danh sách tập: ưu tiên prop serverData, fallback theo episodesList[selectedServer]
  const effectiveServerData = useMemo(() => {
    if (serverData && serverData.length > 0) return serverData;
    const currentServer = episodesList[selectedServer] || episodesList[0];
    return currentServer?.server_data || [];
  }, [serverData, episodesList, selectedServer]);

  // Chia danh sách tập thành từng nhóm 100 tập
  const episodeChunks = useMemo(() => {
    if (!effectiveServerData?.length) return [];

    const chunks = [];
    for (let i = 0; i < effectiveServerData.length; i += EPISODES_PER_CHUNK) {
      const chunk = effectiveServerData.slice(i, i + EPISODES_PER_CHUNK);
      const startEp = chunk[0]?.name || i + 1;
      const endEp = chunk[chunk.length - 1]?.name || i + chunk.length;

      chunks.push({
        label: `${startEp} - ${endEp}`,
        data: chunk,
      });
    }
    return chunks;
  }, [effectiveServerData]);

  // Đồng bộ tab phân đoạn với tập đang xem
  useEffect(() => {
    if (!currentEpSlug || !episodeChunks.length) return;

    const chunkIndex = episodeChunks.findIndex((chunk) =>
      chunk.data.some(
        (ep) => ep.slug === currentEpSlug || ep.name === currentEpSlug,
      ),
    );

    if (chunkIndex !== -1) {
      setSelectedChunkIndex(chunkIndex);
    }
  }, [currentEpSlug, episodeChunks]);

  // Render phần nội dung tập phim (chunk tabs + grid tập)
  const renderEpisodeContent = () => {
    if (!effectiveServerData?.length) {
      return (
        <p className="text-secondary mb-0">Chưa có danh sách tập phim.</p>
      );
    }

    const currentChunkEpisodes =
      episodeChunks[selectedChunkIndex]?.data || [];

    return (
      <div className={`episode-selector ${pageType}`}>
        {/* Tab chọn khoảng tập */}
        {episodeChunks.length > 1 && (
          <div className="episode-chunk-list custom-scrollbar-h">
            {episodeChunks.map((chunk, idx) => (
              <Button
                key={idx}
                size="sm"
                variant="link"
                className={`episode-chunk-btn ${
                  selectedChunkIndex === idx ? "active" : ""
                }`}
                onClick={() => setSelectedChunkIndex(idx)}
              >
                {chunk.label}
              </Button>
            ))}
          </div>
        )}

        {/* Lưới danh sách các tập phim */}
        <div className="episode-list custom-scrollbar">
          {currentChunkEpisodes.map((ep, idx) => {
            const isSelected =
              Boolean(currentEpSlug) &&
              (currentEpSlug === ep.slug || currentEpSlug === ep.name);

            return (
              <EpisodeItem
                key={ep.slug || idx}
                ep={ep}
                isSelected={isSelected}
                onSelect={onEpisodeClick}
              />
            );
          })}
        </div>
      </div>
    );
  };

  // 1. GIAO DIỆN CHO MOVIE DETAIL PAGE (Bọc Card + Header Server buttons)
  if (pageType === "detail") {
    if (!episodesList || episodesList.length === 0) return null;

    return (
      <Row className="mt-4">
        <Col xs={12}>
          <Card className="episode-card text-white">
            <Card.Header className="episode-header d-flex align-items-center justify-content-between flex-wrap gap-2">
              <h5 className="episode-title">Danh sách tập / Server</h5>

              {episodesList.length > 1 && (
                <div className="server-buttons">
                  {episodesList.map((server, idx) => (
                    <Button
                      key={idx}
                      size="sm"
                      variant={
                        selectedServer === idx ? "danger" : "outline-secondary"
                      }
                      className={`server-btn ${
                        selectedServer === idx ? "active" : ""
                      }`}
                      onClick={() => onSelectServer?.(idx)}
                    >
                      {server.server_name || `Server ${idx + 1}`}
                    </Button>
                  ))}
                </div>
              )}
            </Card.Header>
            <Card.Body>{renderEpisodeContent()}</Card.Body>
          </Card>
        </Col>
      </Row>
    );
  }

  // 2. GIAO DIỆN CHO WATCH PAGE (Header Sidebar + Server Buttons)
  if (pageType === "watch") {
    return (
      <>
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
                  onClick={() => onSelectServer?.(idx)}
                >
                  {server.server_name || `Server ${idx + 1}`}
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 overflow-hidden">{renderEpisodeContent()}</div>
      </>
    );
  }

  // 3. GIAO DIỆN DEFAULT / TÙY BIẾN
  return (
    <div className={`episode-selector ${pageType}`}>
      {episodesList.length > 1 && (
        <div className="server-buttons mb-3">
          {episodesList.map((server, idx) => (
            <Button
              key={idx}
              size="sm"
              variant={
                selectedServer === idx ? "danger" : "outline-secondary"
              }
              className={`server-btn ${
                selectedServer === idx ? "active" : ""
              }`}
              onClick={() => onSelectServer?.(idx)}
            >
              {server.server_name || `Server ${idx + 1}`}
            </Button>
          ))}
        </div>
      )}
      {renderEpisodeContent()}
    </div>
  );
};

export default memo(EpisodeSelector);
