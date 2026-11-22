import { memo } from "react";
import { Button } from "react-bootstrap";
import {
  Maximize,
  Minimize,
  Pause,
  PictureInPicture,
  Play,
  RotateCcw,
  RotateCw,
  SkipForward,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import PlayerSettingsMenu from "./PlayerSettingsMenu";
import { SEEK_STEP_SMALL, SKIP_ADS_SECONDS } from "../utils/playerConstants";

// Helper chọn icon âm lượng theo trạng thái mute và mức âm lượng
const renderVolumeIcon = (isMuted, volume) => {
  if (isMuted || volume === 0) return <VolumeX />;
  if (volume <= 0.2) return <Volume />;
  if (volume <= 0.5) return <Volume1 />;
  return <Volume2 />;
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
  const isLast =
    typeof isLastEpisode === "function" ? isLastEpisode() : Boolean(isLastEpisode);

  return (
    <div className="video-toolbar">
      {/* --- CỤM ĐIỀU KHIỂN BÊN TRÁI --- */}
      <div className="video-controls-left">
        {/* Lùi 10s */}
        <Button
          variant="link"
          className="video-control-btn"
          onClick={() => handleSeek(-SEEK_STEP_SMALL)}
          title={`Lùi ${SEEK_STEP_SMALL} giây`}
        >
          <RotateCcw />
        </Button>

        {/* Phát / Tạm dừng */}
        <Button
          variant="link"
          className="video-control-btn"
          onClick={togglePlay}
          title={`(Space) ${isPlaying ? "Tạm dừng" : "Phát"}`}
        >
          {isPlaying ? <Pause /> : <Play />}
        </Button>

        {/* Tiến 10s */}
        <Button
          variant="link"
          className="video-control-btn"
          onClick={() => handleSeek(SEEK_STEP_SMALL)}
          title={`Tua ${SEEK_STEP_SMALL} giây`}
        >
          <RotateCw />
        </Button>

        {/* Điều khiển âm lượng (Ẩn khi màn hình < 460px) */}
        <div className="video-volume-container hide-btn-460">
          <Button
            variant="link"
            className="video-control-btn"
            onClick={toggleMute}
            title={`(M) ${isMuted ? "Bật âm thanh" : "Tắt âm thanh"}`}
          >
            {renderVolumeIcon(isMuted, volume)}
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
          onClick={() => handleSeek(SKIP_ADS_SECONDS)}
          title={`(S) Bỏ qua QC (${SKIP_ADS_SECONDS}s)`}
        >
          <span>Skip ads</span>
          <SkipForward />
        </Button>

        {/* Chuyển tập tiếp theo */}
        <Button
          variant="link"
          onClick={onNextEpisode}
          disabled={isLast}
          className="settings-dropdown-toggle hide-btn-576"
          title="Tập tiếp theo"
        >
          <SkipForward />
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
          <PictureInPicture />
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
          {isFullscreen ? <Minimize /> : <Maximize />}
        </Button>
      </div>
    </div>
  );
});

export default VideoToolbar;
