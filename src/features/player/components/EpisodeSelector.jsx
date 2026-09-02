import "./EpisodeSelector.css";
import { useState, useMemo, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";

const EPISODES_PER_CHUNK = 100;

const EpisodeSelector = ({
  serverData = [],
  handleWatchMovie,
  currentEpSlug,
  pageType = "detail",
}) => {
  const [selectedChunkIndex, setSelectedChunkIndex] = useState(0);
  const chunkListRef = useRef(null);

  // 1. Chia danh sách tập thành các nhóm (Chunks)
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

  // 2. Tự động đồng bộ chunk tab theo tập đang xem
  useEffect(() => {
    if (!currentEpSlug || !episodeChunks.length) return;

    const chunkIndex = episodeChunks.findIndex((chunk) =>
      chunk.data.some(
        (ep) => ep.slug === currentEpSlug || ep.name === currentEpSlug
      )
    );

    if (chunkIndex !== -1) {
      setSelectedChunkIndex(chunkIndex);
    }
  }, [currentEpSlug, episodeChunks]);

  // 3. Tự động cuộn nút chunk active vào khung nhìn
  useEffect(() => {
    if (!chunkListRef.current) return;
    const activeBtn = chunkListRef.current.querySelector(".episode-chunk-btn.active");
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [selectedChunkIndex]);

  if (!serverData?.length) {
    return <p className="text-secondary mb-0">Chưa có danh sách tập phim.</p>;
  }

  const currentChunkEpisodes = episodeChunks[selectedChunkIndex]?.data || [];

  return (
    <div className={`episode-selector ${pageType}`}>
      {/* Thanh cuộn ngang chọn nhóm tập */}
      {episodeChunks.length > 1 && (
        <div className="episode-chunk-list custom-scrollbar-h" ref={chunkListRef}>
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

      {/* Danh sách tập phim */}
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