import { useState, useMemo, useEffect } from "react";
import { Button } from "react-bootstrap";

const EPISODES_PER_CHUNK = 100;

const EpisodeSelector = ({
  serverData = [],
  handleWatchMovie,
  currentEpSlug, // Nhận vào string (slug hoặc name của tập)
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
        (ep) => ep.slug === currentEpSlug || ep.name === currentEpSlug
      )
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
    <div className="mt-2">
      {/* Thanh chọn nhóm tập */}
      {episodeChunks.length > 1 && (
        <div className="d-flex flex-wrap gap-2 mb-3 pb-3 border-bottom border-secondary border-opacity-25">
          {episodeChunks.map((chunk, idx) => (
            <Button
              key={idx}
              size="sm"
              variant={
                selectedChunkIndex === idx ? "danger" : "outline-secondary"
              }
              className={
                selectedChunkIndex === idx
                  ? "fw-bold shadow-sm"
                  : "text-white-50 border-secondary"
              }
              onClick={() => setSelectedChunkIndex(idx)}
            >
              {chunk.label}
            </Button>
          ))}
        </div>
      )}

      {/* Danh sách các tập phim */}
      <div
        className="d-flex flex-wrap gap-2 align-items-center custom-scrollbar"
        style={{ maxHeight: "350px", overflowY: "auto" }}
      >
        {currentChunkEpisodes.map((ep, idx) => {
          // Check chuẩn xác dựa trên string slug hoặc name
          const isSelected =
            currentEpSlug &&
            (currentEpSlug === ep.slug || currentEpSlug === ep.name);

          return (
            <Button
              key={ep.slug || idx}
              variant={isSelected ? "danger" : "outline-dark"}
              className={`px-3 py-1-5 fw-semibold ${
                isSelected
                  ? "fw-bold shadow"
                  : "text-light border-secondary hover-danger"
              }`}
              style={{
                backgroundColor: isSelected ? undefined : "#1f1f1f",
                minWidth: "60px",
              }}
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