import { memo } from "react";
import { Button } from "react-bootstrap";
import LucideIcon from "../../../components/ui/LucideIcon";
import PlayerSettingsMenu from "./PlayerSettingsMenu";

// Helper chọn icon âm lượng theo trạng thái mute và mức âm lượng
const getVolumeIcon = (isMuted, volume) => {
  if (isMuted || volume === 0) return "VolumeX";
  if (volume <= 0.2) return "Volume";
  if (volume <= 0.5) return "Volume1";
  return "Volume2";
};

/**
 * VideoToolbar:
 * Chứa toàn bộ các nút điều khiển, thanh âm lượng, cài đặt chất lượng/tốc độ, PiP và Fullscreen.
 * Bọc React.memo để hoàn toàn KHÔNG bị re-render khi video đang chạy (timeupdate).
 */
export const VideoToolbar = memo(function VideoToolbar({
  isPlaying,
  playbackRate,
  togglePlay,
  handleSeek,
  handleSpeedChange,
  volume = 1,
  isMuted = false,
  toggleMute,
  handleVolumeChange,
  qualities = [],
  currentQuality = -1,
  handleQualityChange,
  isAutoSkip = false,
  toggleAutoSkip,
  onNextEpisode,
  isLastEpisode,
  isFullscreen,
  toggleFullscreen,
  isPiP,
  togglePiP,
}) {
  const currentVolumePercent = (isMuted ? 0 : volume) * 100;

  return (
    <div className="video-toolbar">
      {/* --- CỤM ĐIỀU KHIỂN BÊN TRÁI --- */}
      <div className="video-controls-left">
        {/* Lùi 10s */}
        <Button
          variant="link"
          className="video-control-btn"
          onClick={() => handleSeek(-10)}
          title="Lùi 10 giây"
        >
          <LucideIcon icon="RotateLeft" />
        </Button>

        {/* Phát / Tạm dừng */}
        <Button
          variant="link"
          className="video-control-btn"
          onClick={togglePlay}
          title={`(Space) ${isPlaying ? "Tạm dừng" : "Phát"}`}
        >
          <LucideIcon icon={isPlaying ? "Pause" : "Play"} />
        </Button>

        {/* Tiến 10s */}
        <Button
          variant="link"
          className="video-control-btn"
          onClick={() => handleSeek(10)}
          title="Tua 10 giây"
        >
          <LucideIcon icon="RotateRight" />
        </Button>

        {/* Điều khiển âm lượng (Ẩn khi màn hình < 460px) */}
        <div className="video-volume-container hide-btn-460">
          <Button
            variant="link"
            className="video-control-btn"
            onClick={toggleMute}
            title={`(M) ${isMuted ? "Bật âm thanh" : "Tắt âm thanh"}`}
          >
            <LucideIcon icon={getVolumeIcon(isMuted, volume)} />
          </Button>
          <input
            type="range"
            className="video-volume-slider"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            style={{ "--volume-progress": `${currentVolumePercent}%` }}
          />
        </div>
      </div>

      {/* --- CỤM ĐIỀU KHIỂN BÊN PHẢI --- */}
      <div className="video-controls-right">
        {/* Bỏ qua giới thiệu / QC */}
        <Button
          variant="warning"
          size="sm"
          className="skip-ads-btn hide-btn-320"
          onClick={() => handleSeek(28)}
          title="(S) Thật ra là tua 30s"
        >
          <span>Skip ads</span>
          <LucideIcon icon="SkipForward" />
        </Button>

        {/* Chuyển tập tiếp theo */}
        <Button
          variant="link"
          onClick={onNextEpisode}
          disabled={isLastEpisode?.()}
          className="settings-dropdown-toggle hide-btn-576"
          title="Tập tiếp theo"
        >
          <LucideIcon icon="SkipForward" />
        </Button>

        {/* Cài đặt (Tốc độ, Chất lượng, AutoSkip) */}
        <PlayerSettingsMenu
          playbackRate={playbackRate}
          handleSpeedChange={handleSpeedChange}
          qualities={qualities}
          currentQuality={currentQuality}
          handleQualityChange={handleQualityChange}
          isAutoSkip={isAutoSkip}
          toggleAutoSkip={toggleAutoSkip}
        />

        {/* Picture-in-Picture */}
        <Button
          variant="link"
          className="video-control-btn hide-btn-460"
          onClick={togglePiP}
          title={
            isPiP ? "Thoát Picture-in-Picture" : "Picture-in-Picture (PiP)"
          }
        >
          <LucideIcon icon="PictureInPicture" />
        </Button>

        {/* Toàn màn hình */}
        <Button
          variant="link"
          className="video-control-btn"
          onClick={toggleFullscreen}
          title={`(F) ${
            isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"
          }`}
        >
          <LucideIcon icon={isFullscreen ? "Minimize" : "Maximize"} />
        </Button>
      </div>
    </div>
  );
});

export default VideoToolbar;
