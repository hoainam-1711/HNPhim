import { useState, useEffect, useRef, useCallback } from "react";

const SWIPE_THRESHOLD = 50;
const AUTO_SLIDE_INTERVAL = 5000;
const CLICK_DEBOUNCE_TIME = 150;

/**
 * useHeroSlider: Hook quản lý trạng thái chuyển slide tự động, cảm ứng swipe và click debounce cho Hero Banner
 * @param {Object} params
 * @param {number} params.total - Tổng số slides
 */
export default function useHeroSlider({ total = 0 }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const lastClickTime = useRef(0);

  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setSelectedIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setSelectedIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Đảm bảo selectedIndex luôn hợp lệ khi danh sách phim thay đổi
  useEffect(() => {
    if (total === 0) {
      setSelectedIndex(0);
      return;
    }
    setSelectedIndex((prev) => Math.min(prev, total - 1));
  }, [total]);

  // Auto slide mỗi 5s
  useEffect(() => {
    if (total <= 1) return;
    const intervalId = setInterval(nextSlide, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(intervalId);
  }, [total, nextSlide]);

  const handleTouchStart = (event) => {
    const touchX = event.touches[0]?.clientX ?? 0;
    touchStartX.current = touchX;
    touchEndX.current = touchX;
  };

  const handleTouchMove = (event) => {
    touchEndX.current = event.touches[0]?.clientX ?? touchEndX.current;
  };

  const handleTouchEnd = () => {
    const diffX = touchEndX.current - touchStartX.current;
    if (Math.abs(diffX) <= SWIPE_THRESHOLD) return;

    if (diffX < 0) {
      nextSlide();
    } else {
      prevSlide();
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const handleTouchCancel = () => {
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const handleSelectThumb = (index) => {
    const now = Date.now();
    if (
      index === selectedIndex ||
      now - lastClickTime.current < CLICK_DEBOUNCE_TIME
    ) {
      return;
    }

    lastClickTime.current = now;
    setSelectedIndex(index);
  };

  return {
    selectedIndex,
    nextSlide,
    prevSlide,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleTouchCancel,
    handleSelectThumb,
  };
}
