import { useEffect, useRef, useState, useCallback } from "react";
import {
  AUTO_SKIP_KEY,
  AUTO_SKIP_TIME,
  AUTO_SKIP_STEP,
} from "../utils/playerConstants";

/**
 * useAutoSkip
 * Quản lý tính năng tự động tua qua mốc 15 phút (900s) cho mỗi tập phim
 */
export const useAutoSkip = (videoRef, m3u8Url) => {
  const [isAutoSkip, setIsAutoSkip] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTO_SKIP_KEY);
      return saved ? JSON.parse(saved) : false;
    } catch (error) {
      console.error("Lỗi đọc auto-skip từ localStorage:", error);
      return false;
    }
  });

  const hasSkippedRef = useRef(false);

  // Lưu trạng thái vào localStorage khi thay đổi
  const toggleAutoSkip = useCallback(() => {
    setIsAutoSkip((prev) => {
      const nextState = !prev;
      try {
        localStorage.setItem(AUTO_SKIP_KEY, JSON.stringify(nextState));
      } catch (error) {
        console.error("Lỗi lưu auto-skip vào localStorage:", error);
      }
      return nextState;
    });
  }, []);

  // Reset cờ đã tua khi đổi tập / URL mới
  useEffect(() => {
    hasSkippedRef.current = false;
  }, [m3u8Url]);

  // Lắng nghe sự kiện timeupdate để kiểm tra mốc 15 phút
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (
        isAutoSkip &&
        !hasSkippedRef.current &&
        video.currentTime >= AUTO_SKIP_TIME &&
        video.currentTime < AUTO_SKIP_TIME + 1
      ) {
        video.currentTime += AUTO_SKIP_STEP; // Tua tiến 30 giây
        hasSkippedRef.current = true;
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [videoRef, isAutoSkip]);

  return {
    isAutoSkip,
    toggleAutoSkip,
  };
};

export default useAutoSkip;
