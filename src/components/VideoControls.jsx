import "../css/VideoControls.css";
import { useState } from "react";
import { Button, Dropdown } from "react-bootstrap";
import LucideIcon from "./LucideIcon";

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
}) => {
  const [menuState, setMenuState] = useState("main");

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00:00";

    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    return `${hours < 10 ? "0" : ""}${hours}:${
      minutes < 10 ? "0" : ""
    }${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div
      className={`video-controls ${
        showControls ? "video-controls-visible" : "video-controls-hidden"
      }`}
    >
      {/* Time */}
      <span className="video-time">
        <span className="video-time-current">{formatTime(currentTime)}</span>
        <span className="video-time-separator">/</span>
        <span>{formatTime(duration)}</span>
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
            className="video-control-btn btn-seek-back"
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
            title={isPlaying ? "Tạm dừng" : "Phát"}
          >
            <LucideIcon icon={isPlaying ? "Pause" : "Play"} />
          </Button>

          {/* Forward 10s */}
          <Button
            variant="link"
            className="video-control-btn btn-seek-forward"
            onClick={() => handleSeek(10)}
            title="Tua 10 giây"
          >
            <LucideIcon icon="RotateRight" />
          </Button>

          {/* Volume Control */}
          <div className="video-volume-container">
            <Button
              variant="link"
              className="video-control-btn"
              onClick={toggleMute}
              title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
            >
              <LucideIcon icon={isMuted ? "VolumeX" : "Volume2"} />
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
          {/* Skip ads */}
          <Button
            variant="warning"
            size="sm"
            className="skip-ads-btn"
            onClick={() => handleSeek(29)}
            title="Thật ra là tua 30s"
          >
            <span>Skip ads</span>
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

                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                    <Dropdown.Item
                      key={rate}
                      active={playbackRate === rate}
                      onClick={() => handleSpeedChange(rate)}
                      className="settings-dropdown-item"
                    >
                      {rate === 1 ? "Chuẩn" : `${rate}x`}
                    </Dropdown.Item>
                  ))}
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

          {/* Fullscreen */}
          <Button
            variant="link"
            className="video-control-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
          >
            <LucideIcon icon={isFullscreen ? "Minimize" : "Maximize"} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoControls;