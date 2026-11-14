import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import LucideIcon from "../../../components/ui/LucideIcon";

// Danh sách các mốc tốc độ phát hỗ trợ
const PLAYBACK_RATES = [1, 1.25, 1.5, 2];

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
        <LucideIcon icon="Settings" />
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

            {/* Toggle Auto Skip */}
            <Dropdown.Item
              as="button"
              className="settings-dropdown-item"
              onClick={toggleAutoSkip}
            >
              <span>Auto Skip</span>
              <LucideIcon
                className="settings-value"
                icon={isAutoSkip ? "ToggleRight" : "ToggleLeft"}
              />
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
              <LucideIcon icon="ChevronLeft" />
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
                  {rate}
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
  );
};

export default PlayerSettingsMenu;
