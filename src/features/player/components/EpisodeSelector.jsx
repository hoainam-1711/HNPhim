import "./EpisodeSelector.css";
import { useState, useMemo, useEffect, memo } from "react";
import { Button } from "react-bootstrap";

const EPISODES_PER_CHUNK = 100;

// 1. TÁCH NÚT TẬP RA COMPONENT NHỎ & DÙNG MEMO
// Giúp chỉ re-render đúng 2 nút: nút cũ vừa bỏ chọn và nút mới được active
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

// 2. COMPONENT CHÍNH
const EpisodeSelector = ({
  serverData = [],
  handleWatchMovie,
  currentEpSlug,
  pageType = "detail",
}) => {
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

    const chunkIndex = episodeChunks.findIndex((chunk) =>
      chunk.data.some(
        (ep) => ep.slug === currentEpSlug || ep.name === currentEpSlug,
      ),
    );

    if (chunkIndex !== -1) {
      setSelectedChunkIndex(chunkIndex);
    }
  }, [currentEpSlug, episodeChunks]);

  /* ==================================================
     3. RENDER KHI TRỐNG DỮ LIỆU
  ================================================== */
  if (!serverData?.length) {
    return <p className="text-secondary mb-0">Chưa có danh sách tập phim.</p>;
  }

  const currentChunkEpisodes = episodeChunks[selectedChunkIndex]?.data || [];

  /* ==================================================
     4. GIAO DIỆN CHÍNH
  ================================================== */
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
              className={`episode-chunk-btn ${selectedChunkIndex === idx ? "active" : ""}`}
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
              onSelect={handleWatchMovie}
            />
          );
        })}
      </div>
    </div>
  );
};

// Bọc React.memo cho toàn bộ component cha
export default memo(EpisodeSelector);
