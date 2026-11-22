import { useEffect } from "react";
import {
  SEEK_STEP_SMALL,
  SEEK_STEP_LARGE,
  VOLUME_STEP,
  KEYBOARD_SHORTCUTS,
} from "../utils/playerConstants";

/**
 * useKeyboardShortcuts (alias useKeyboardControls)
 * Lắng nghe và xử lý các phím tắt điều khiển player:
 * - Space: Phát / Tạm dừng
 * - ArrowLeft / ArrowRight: Tua lùi / tiến 10s
 * - ArrowUp / ArrowDown: Tăng / giảm 10% âm lượng
 * - KeyM: Bật / Tắt tiếng (Mute)
 * - KeyF: Bật / Tắt toàn màn hình
 * - KeyS: Tua nhanh 30s
 */
export const useKeyboardShortcuts = ({
  videoRef,
  containerRef,
  setVolume,
  setIsMuted,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Bỏ qua nếu đang nhập liệu
      const activeElement = document.activeElement;
      const isInput =
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.isContentEditable);

      if (isInput) return;

      const video = videoRef.current;
      if (!video) return;

      switch (e.code) {
        case KEYBOARD_SHORTCUTS.SPACE:
          e.preventDefault();
          if (video.paused) {
            video.play();
          } else {
            video.pause();
          }
          break;

        case KEYBOARD_SHORTCUTS.ARROW_LEFT:
          e.preventDefault();
          video.currentTime = Math.max(0, video.currentTime - SEEK_STEP_SMALL);
          break;

        case KEYBOARD_SHORTCUTS.ARROW_RIGHT:
          e.preventDefault();
          video.currentTime = Math.min(
            video.duration || 0,
            video.currentTime + SEEK_STEP_SMALL,
          );
          break;

        case KEYBOARD_SHORTCUTS.ARROW_UP: {
          e.preventDefault();
          const newVolUp = Math.min(1, video.volume + VOLUME_STEP);
          video.volume = newVolUp;
          if (setVolume) setVolume(newVolUp);
          if (newVolUp > 0) {
            video.muted = false;
            if (setIsMuted) setIsMuted(false);
          }
          break;
        }

        case KEYBOARD_SHORTCUTS.ARROW_DOWN: {
          e.preventDefault();
          const newVolDown = Math.max(0, video.volume - VOLUME_STEP);
          video.volume = newVolDown;
          if (setVolume) setVolume(newVolDown);
          if (newVolDown === 0) {
            video.muted = true;
            if (setIsMuted) setIsMuted(true);
          }
          break;
        }

        case KEYBOARD_SHORTCUTS.KEY_M:
          e.preventDefault();
          video.muted = !video.muted;
          if (setIsMuted) setIsMuted(video.muted);
          break;

        case KEYBOARD_SHORTCUTS.KEY_F: {
          e.preventDefault();
          const targetContainer = containerRef?.current || video;
          if (!document.fullscreenElement) {
            if (targetContainer.requestFullscreen) {
              targetContainer.requestFullscreen();
            } else if (targetContainer.webkitRequestFullscreen) {
              targetContainer.webkitRequestFullscreen();
            }
          } else {
            if (document.exitFullscreen) {
              document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
              document.webkitExitFullscreen();
            }
          }
          break;
        }

        case KEYBOARD_SHORTCUTS.KEY_S:
          e.preventDefault();
          video.currentTime = Math.min(
            video.duration || 0,
            video.currentTime + SEEK_STEP_LARGE,
          );
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [videoRef, containerRef, setVolume, setIsMuted]);
};

export const useKeyboardControls = useKeyboardShortcuts;
export default useKeyboardShortcuts;
