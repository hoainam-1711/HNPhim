import "./EpisodeSelector.css";
import { useState, useMemo, useEffect } from "react";
import { Button } from "react-bootstrap";

const EPISODES_PER_CHUNK = 50;

const EpisodeSelector = ({
  serverData = [],
  handleWatchMovie,
  currentEpSlug, // Nhận vào string (slug hoặc name của tập)
  pageType,
}) => {
  const [selectedChunkIndex, setSelectedChunkIndex] = useState(0);

  // 1. Chia danh sách tập thành các nhóm (Chunks)
  const episodeChunks = useMemo(() => {
    if (!serverData || serverData.length === 0) return [];

    const chunks = [];
    for (let i = 0; i < serverData.length; i += EPISODES_PER_CHUNK) {
      const chunk = serverData.slice(i, i + EPISODES_PER_CHUNK);
      const startEp = serverData[i]?.name || i + 1;
      const endEp =
        serverData[Math.min(i + EPISODES_PER_CHUNK - 1, serverData.length - 1)]
          ?.name || i + chunk.length;

      chunks.push({
        label: `${startEp} - ${endEp}`,
        data: chunk,
      });
    }
    return chunks;
  }, [serverData]);

  // 2. Tự động nhảy sang tab/nhóm tập chứa tập đang xem
  useEffect(() => {
    if (!currentEpSlug || episodeChunks.length === 0) return;

    const chunkIndex = episodeChunks.findIndex((chunk) =>
      chunk.data.some(
        (ep) => ep.slug === currentEpSlug || ep.name === currentEpSlug,
      ),
    );

    if (chunkIndex !== -1) {
      setSelectedChunkIndex(chunkIndex);
    }
  }, [currentEpSlug, episodeChunks]);

  const currentChunkEpisodes = episodeChunks[selectedChunkIndex]?.data || [];

  if (!serverData || serverData.length === 0) {
    return <p className="text-secondary mb-0">Chưa có danh sách tập phim.</p>;
  }

  return (
    <div className={`episode-selector ${pageType}`}>
      {/* Thanh chọn nhóm tập */}
      {episodeChunks.length > 1 && (
        <div className="episode-chunk-list">
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

      {/* Danh sách các tập phim */}
      <div className="episode-list custom-scrollbar">
        {currentChunkEpisodes.map((ep, idx) => {
          const isSelected =
            currentEpSlug &&
            (currentEpSlug === ep.slug || currentEpSlug === ep.name);

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
