import "./VideoControls.css";
import { useState } from "react";
import { Button, Dropdown } from "react-bootstrap";
import LucideIcon from "../../../components/ui/LucideIcon";
import formatTime from "../../../utils/formatTime";

const VideoControls = ({
  showControls,
  currentTime,
  duration,
  isPlaying,
  playbackRate,
  qualities,
  currentQuality,
  isFullscreen,
  volume = 1,
  isMuted = false,
  togglePlay,
  handleSeek,
  handleSliderChange,
  handleSpeedChange,
  handleQualityChange,
  toggleFullscreen,
  handleVolumeChange,
  toggleMute,
  onNextEpisode,
  isLastEpisode,
  isPiP,
  togglePiP,
}) => {
  const [menuState, setMenuState] = useState("main");

  const currentTimeFormat = formatTime(currentTime);
  const durationFormat = formatTime(duration);

  return (
    <div
      className={`video-controls ${
        showControls ? "video-controls-visible" : "video-controls-hidden"
      }`}
    >
      {/* Time */}
      <span className="video-time">
        <span className="video-time-current">{currentTimeFormat}</span>
        <span className="video-time-separator">/</span>
        <span>{durationFormat}</span>
      </span>

      {/* Timeline */}
      <div className="video-timeline">
        <input
          type="range"
          className="video-progress"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSliderChange}
          style={{
            "--progress": `${duration ? (currentTime / duration) * 100 : 0}%`,
          }}
        />
      </div>

      {/* Toolbar */}
      <div className="video-toolbar">
        {/* ================= LEFT ================= */}
        <div className="video-controls-left">
          {/* Back 10s */}
          <Button
            variant="link"
            className="video-control-btn"
            onClick={() => handleSeek(-10)}
            title="Lùi 10 giây"
          >
            <LucideIcon icon="RotateLeft" />
          </Button>

          {/* Play / Pause */}
          <Button
            variant="link"
            className="video-control-btn"
            onClick={togglePlay}
            title={`(Space) ${isPlaying ? "Tạm dừng" : "Phát"}`}
          >
            <LucideIcon icon={isPlaying ? "Pause" : "Play"} />
          </Button>

          <Button
            variant="link"
            className="video-control-btn hide-lt-576"
            onClick={() => handleSeek(10)}
            title="Tua 10 giây"
          >
            <LucideIcon icon="RotateRight" />
          </Button>

          {/* Volume Control (Ẩn khi < 460px) */}
          <div className="video-volume-container hide-btn-460">
            <Button
              variant="link"
              className="video-control-btn"
              onClick={toggleMute}
              title={`(M) ${isMuted ? "Bật âm thanh" : "Tắt âm thanh"}`}
            >
              <LucideIcon
                icon={
                  isMuted
                    ? "VolumeX"
                    : volume <= 0.2
                      ? "Volume"
                      : volume <= 0.5
                        ? "Volume1"
                        : "Volume2"
                }
              />
            </Button>
            <input
              type="range"
              className="video-volume-slider"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              style={{
                "--volume-progress": `${(isMuted ? 0 : volume) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="video-controls-right">
          {/* Skip ads (Ẩn khi < 320px) */}
          <Button
            variant="warning"
            size="sm"
            className="skip-ads-btn hide-btn-320"
            onClick={() => handleSeek(29)}
            title="(S) Thật ra là tua 30s"
          >
            <span>Skip ads</span>
            <LucideIcon icon="SkipForward" />
          </Button>

          {/* Next Episode (Ẩn khi < 576px) */}
          <Button
            variant="link"
            onClick={onNextEpisode}
            disabled={isLastEpisode?.()}
            className="settings-dropdown-toggle hide-btn-576"
            title="Tập tiếp theo"
          >
            <LucideIcon icon="SkipForward" />
          </Button>

          {/* Settings */}
          <Dropdown
            autoClose="outside"
            onToggle={(isOpen) => !isOpen && setMenuState("main")}
          >
            <Dropdown.Toggle
              variant="link"
              className="settings-dropdown-toggle"
              title="Settings"
            >
              <LucideIcon icon="Settings" />
            </Dropdown.Toggle>

            <Dropdown.Menu className="settings-dropdown-menu">
              {menuState === "main" && (
                <>
                  <Dropdown.Item
                    className="settings-dropdown-item"
                    onClick={() => setMenuState("speed")}
                  >
                    <span>Tốc độ phát</span>
                    <span className="settings-value">
                      {playbackRate === 1 ? "Chuẩn" : `${playbackRate}x`}
                      <LucideIcon icon="ChevronRight" />
                    </span>
                  </Dropdown.Item>

                  <Dropdown.Item
                    className="settings-dropdown-item"
                    onClick={() => setMenuState("quality")}
                  >
                    <span>Chất lượng</span>
                    <span className="settings-value">
                      {currentQuality === -1
                        ? "Tự động"
                        : `${qualities[currentQuality]?.height}p`}
                      <LucideIcon icon="ChevronRight" />
                    </span>
                  </Dropdown.Item>
                </>
              )}

              {menuState === "speed" && (
                <>
                  <div
                    className="settings-submenu-header"
                    onClick={() => setMenuState("main")}
                  >
                    <LucideIcon icon="ChevronLeft" />
                    <strong>Tốc độ phát</strong>
                  </div>

                  <div className="speed-options">
                    {[1, 1.25, 1.5, 2].map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        className={`speed-option ${
                          playbackRate === rate ? "active" : ""
                        }`}
                        onClick={() => handleSpeedChange(rate)}
                      >
                        {rate}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {menuState === "quality" && (
                <>
                  <div
                    className="settings-submenu-header"
                    onClick={() => setMenuState("main")}
                  >
                    <LucideIcon icon="ChevronLeft" />
                    <strong>Chất lượng</strong>
                  </div>

                  <Dropdown.Item
                    active={currentQuality === -1}
                    onClick={() => handleQualityChange(-1)}
                    className="settings-dropdown-item"
                  >
                    Tự động
                  </Dropdown.Item>

                  {qualities.map((q) => (
                    <Dropdown.Item
                      key={q.id}
                      active={currentQuality === q.id}
                      onClick={() => handleQualityChange(q.id)}
                      className="settings-dropdown-item"
                    >
                      {q.height}p
                    </Dropdown.Item>
                  ))}
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>

          {/* Picture-in-Picture (Ẩn khi < 460px) */}
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

          {/* Fullscreen */}
          <Button
            variant="link"
            className="video-control-btn"
            onClick={toggleFullscreen}
            title={`(F) ${isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}`}
          >
            <LucideIcon icon={isFullscreen ? "Minimize" : "Maximize"} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoControls;