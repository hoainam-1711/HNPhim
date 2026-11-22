import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { PLAYBACK_RATES } from "../utils/playerConstants";

/**
 * PlayerSettingsMenu
 * Dropdown cài đặt cho Player: Tốc độ phát, Độ phân giải chất lượng, Bật/tắt AutoSkip
 */
export const PlayerSettingsMenu = ({
  playbackRate = 1,
  handleSpeedChange,
  qualities = [],
  currentQuality = -1,
  handleQualityChange,
  isAutoSkip = false,
  toggleAutoSkip,
}) => {
  const [menuState, setMenuState] = useState("main");

  return (
    <Dropdown
      autoClose="outside"
      onToggle={(isOpen) => !isOpen && setMenuState("main")}
    >
      <Dropdown.Toggle
        variant="link"
        className="settings-dropdown-toggle"
        title="Cài đặt"
      >
        <Settings />
      </Dropdown.Toggle>

      <Dropdown.Menu className="settings-dropdown-menu">
        {/* Menu chính */}
        {menuState === "main" && (
          <>
            <Dropdown.Item
              className="settings-dropdown-item"
              onClick={() => setMenuState("speed")}
            >
              <span>Tốc độ phát</span>
              <span className="settings-value">
                {playbackRate === 1 ? "Chuẩn" : `${playbackRate}x`}
                <ChevronRight />
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
                <ChevronRight />
              </span>
            </Dropdown.Item>

            {/* Toggle Auto Skip */}
            <Dropdown.Item
              as="button"
              className="settings-dropdown-item"
              onClick={toggleAutoSkip}
            >
              <span>Auto Skip</span>
              {isAutoSkip ? (
                <ToggleRight className="settings-value" color="#ff0000c9"/>
              ) : (
                <ToggleLeft className="settings-value" />
              )}
            </Dropdown.Item>
          </>
        )}

        {/* Submenu chọn tốc độ */}
        {menuState === "speed" && (
          <>
            <div
              className="settings-submenu-header"
              onClick={() => setMenuState("main")}
            >
              <ChevronLeft />
              <strong>Tốc độ phát</strong>
            </div>

            <div className="speed-options">
              {PLAYBACK_RATES.map((rate) => (
                <button
                  key={rate}
                  type="button"
                  className={`speed-option ${
                    playbackRate === rate ? "active" : ""
                  }`}
                  onClick={() => handleSpeedChange(rate)}
                >
                  {rate === 1 ? "1" : `${rate}`}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Submenu chọn chất lượng */}
        {menuState === "quality" && (
          <>
            <div
              className="settings-submenu-header"
              onClick={() => setMenuState("main")}
            >
              <ChevronLeft />
              <strong>Chất lượng</strong>
            </div>

            <div className="quality-options">
              {/* Tùy chọn Tự động */}
              <button
                type="button"
                className={`quality-option ${
                  currentQuality === -1 ? "active" : ""
                }`}
                onClick={() => handleQualityChange(-1)}
              >
                Tự động
              </button>

              {/* Danh sách các độ phân giải tìm thấy từ HLS */}
              {qualities.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`quality-option ${
                    currentQuality === item.id ? "active" : ""
                  }`}
                  onClick={() => handleQualityChange(item.id)}
                >
                  {item.height}p
                </button>
              ))}
            </div>
          </>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default PlayerSettingsMenu;
