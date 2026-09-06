import "./EpisodeSelector.css";
import { useState, useMemo, useEffect } from "react";
import { Button } from "react-bootstrap";

// Số lượng tập phim hiển thị trong một nhóm (tab)
const EPISODES_PER_CHUNK = 100;

const EpisodeSelector = ({
  serverData = [],
  handleWatchMovie,
  currentEpSlug,
  pageType = "detail",
}) => {
  // Quản lý tab nhóm tập đang được chọn
  const [selectedChunkIndex, setSelectedChunkIndex] = useState(0);

  /* ==================================================
     1. COMPUTED DATA (CHIA NHÓM TẬP PHIM)
  ================================================== */
  const episodeChunks = useMemo(() => {
    if (!serverData?.length) return [];

    const chunks = [];
    for (let i = 0; i < serverData.length; i += EPISODES_PER_CHUNK) {
      const chunk = serverData.slice(i, i + EPISODES_PER_CHUNK);
      const startEp = chunk[0]?.name || i + 1;
      const endEp = chunk[chunk.length - 1]?.name || i + chunk.length;

      chunks.push({
        label: `${startEp} - ${endEp}`,
        data: chunk,
      });
    }
    return chunks;
  }, [serverData]);

  /* ==================================================
     2. SIDE EFFECTS (ĐỒNG BỘ TAB VỚI TẬP ĐANG XEM)
  ================================================== */
  useEffect(() => {
    if (!currentEpSlug || !episodeChunks.length) return;

    // Tìm index của nhóm có chứa tập phim hiện tại
    const chunkIndex = episodeChunks.findIndex((chunk) =>
      chunk.data.some(
        (ep) => ep.slug === currentEpSlug || ep.name === currentEpSlug
      )
    );

    if (chunkIndex !== -1) {
      setSelectedChunkIndex(chunkIndex);
    }
  }, [currentEpSlug, episodeChunks]);

  /* ==================================================
     3. RENDER XỬ LÝ KHI TRỐNG DỮ LIỆU
  ================================================== */
  if (!serverData?.length) {
    return <p className="text-secondary mb-0">Chưa có danh sách tập phim.</p>;
  }

  // Danh sách các tập thuộc nhóm đang được chọn
  const currentChunkEpisodes = episodeChunks[selectedChunkIndex]?.data || [];

  /* ==================================================
     4. GIAO DIỆN CHÍNH
  ================================================== */
  return (
    <div className={`episode-selector ${pageType}`}>
      {/* Tab chọn khoảng tập (chỉ hiện khi có từ 2 nhóm trở lên) */}
      {episodeChunks.length > 1 && (
        <div className="episode-chunk-list custom-scrollbar-h">
          {episodeChunks.map((chunk, idx) => (
            <Button
              key={idx}
              size="sm"
              variant="link"
              className={`episode-chunk-btn ${selectedChunkIndex === idx ? "active" : ""}`}
              onClick={() => setSelectedChunkIndex(idx)}
            >
              {chunk.label}
            </Button>
          ))}
        </div>
      )}

      {/* Lưới danh sách các tập phim cụ thể */}
      <div className="episode-list custom-scrollbar">
        {currentChunkEpisodes.map((ep, idx) => {
          const isSelected =
            currentEpSlug && (currentEpSlug === ep.slug || currentEpSlug === ep.name);

          return (
            <Button
              key={ep.slug || idx}
              variant="link"
              className={`episode-item ${isSelected ? "active" : ""}`}
              onClick={() => handleWatchMovie(ep)}
            >
              {ep.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default EpisodeSelector;