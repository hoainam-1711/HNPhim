import { useHlsVideo } from "../hooks/useHlsVideo";
import VideoControls from "./VideoControls";

const CustomVideoPlayer = ({
  m3u8Url,
  poster,
  onNextEpisode,
  isLastEpisode,
  togglePiP,
}) => {
  // Lấy toàn bộ logic điều khiển và phát video HLS từ custom hook
  const videoProps = useHlsVideo(m3u8Url);

  // Phân rã các thuộc tính để code ngắn gọn, dễ đọc hơn
  const {
    containerRef,
    videoRef,
    isPlaying,
    setShowControls,
    handleMouseMove,
    handleLoadedMetadata,
    handleTimeUpdate,
    setIsPlaying,
    handleVideoClick,
  } = videoProps;

  // Xử lý ẩn thanh điều khiển khi chuột rời khỏi khung hình lúc video đang chạy
  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false);
    }
  };

  return (
    /* Khung chứa toàn bộ player (giữ tỷ lệ 16:9, bo góc và nền đen) */
    <div
      ref={containerRef}
      className="position-relative w-100 bg-black overflow-hidden rounded shadow-lg ratio ratio-16x9"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Thẻ video chính */}
      <video
        ref={videoRef}
        autoPlay
        className="w-100 h-100 object-fit-contain"
        poster={poster}
        onClick={handleVideoClick}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Giao diện thanh điều khiển (nút bấm, thanh tua, âm lượng,...) */}
      <VideoControls
        {...videoProps}
        onNextEpisode={onNextEpisode}
        isLastEpisode={isLastEpisode}
        onTogglePiP={togglePiP}
      />
    </div>
  );
};

export default CustomVideoPlayer;
