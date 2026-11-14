import "./VideoControls.css";
import { memo } from "react";
import VideoTimeline from "./VideoTimeline";
import VideoToolbar from "./VideoToolbar";

/**
 * VideoControls:
 * Khung chứa thanh điều khiển video.
 * Tách biệt VideoTimeline (thay đổi theo currentTime) và VideoToolbar (memoized, không re-render khi video phát).
 */
const VideoControls = memo(function VideoControls({
  // Trạng thái hiển thị controls
  showControls,

  // Thời gian và tiến trình phát
  currentTime,
  duration,
  handleSeek,
  handleSliderChange,

  // Điều khiển phát / tạm dừng & Tốc độ
  isPlaying,
  playbackRate,
  togglePlay,
  handleSpeedChange,

  // Điều khiển âm lượng
  volume = 1,
  isMuted = false,
  toggleMute,
  handleVolumeChange,

  // Chất lượng video
  qualities = [],
  currentQuality,
  handleQualityChange,

  // Tự động skip
  isAutoSkip,
  toggleAutoSkip,

  // Chuyển tập
  onNextEpisode,
  isLastEpisode,

  // Chế độ hiển thị (Fullscreen / PiP)
  isFullscreen,
  toggleFullscreen,
  isPiP,
  togglePiP,
}) {
  return (
    <div
      className={`video-controls ${
        showControls ? "video-controls-visible" : "video-controls-hidden"
      }`}
    >
      {/* 1. THANH TIẾN TRÌNH & THỜI GIAN PHÁT (Chỉ phần này re-render khi currentTime thay đổi) */}
      <VideoTimeline
        currentTime={currentTime}
        duration={duration}
        onSliderChange={handleSliderChange}
      />

      {/* 2. THANH CÔNG CỤ ĐIỀU KHIỂN (Được memoize, không re-render trong suốt thời gian phát) */}
      <VideoToolbar
        isPlaying={isPlaying}
        playbackRate={playbackRate}
        togglePlay={togglePlay}
        handleSeek={handleSeek}
        handleSpeedChange={handleSpeedChange}
        volume={volume}
        isMuted={isMuted}
        toggleMute={toggleMute}
        handleVolumeChange={handleVolumeChange}
        qualities={qualities}
        currentQuality={currentQuality}
        handleQualityChange={handleQualityChange}
        isAutoSkip={isAutoSkip}
        toggleAutoSkip={toggleAutoSkip}
        onNextEpisode={onNextEpisode}
        isLastEpisode={isLastEpisode}
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
        isPiP={isPiP}
        togglePiP={togglePiP}
      />
    </div>
  );
});

export default VideoControls;
