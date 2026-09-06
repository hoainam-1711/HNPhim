import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

export const useHlsVideo = (m3u8Url) => {
  // ==========================================
  // 1. REFS (Tham chiếu phần tử và giá trị đệm)
  // ==========================================
  const containerRef = useRef(null);        // Khung bọc video & controls (dùng cho fullscreen)
  const videoRef = useRef(null);            // Thẻ <video>
  const hlsRef = useRef(null);              // HLS instance
  const controlsTimeoutRef = useRef(null);  // Timer tự động ẩn thanh điều khiển
  const prevVolumeRef = useRef(1);          // Lưu âm lượng trước khi bấm Mute để khôi phục

  // ==========================================
  // 2. STATES (Quản lý trạng thái phát & giao diện)
  // ==========================================
  // Trạng thái phát & dòng thời gian
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Chất lượng video
  const [qualities, setQualities] = useState([]);
  const [currentQuality, setCurrentQuality] = useState(-1);

  // Âm lượng
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Hiển thị giao diện & Chế độ xem
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPiP, setIsPiP] = useState(false);

  // ==========================================
  // 3. EFFECTS (Vòng đời và sự kiện hệ thống)
  // ==========================================

  // Khởi tạo stream HLS hoặc fallback sang video gốc (Safari)
  useEffect(() => {
    const video = videoRef.current;
    if (!m3u8Url || !video) return;

    let hls;
    if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hlsRef.current = hls;
      hls.loadSource(m3u8Url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        setQualities(
          data.levels.map((level, index) => ({
            id: index,
            height: level.height,
            bitrate: level.bitrate,
          }))
        );
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = m3u8Url;
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [m3u8Url]);

  // Xóa timer ẩn controls khi component unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Lắng nghe thay đổi chế độ toàn màn hình
  useEffect(() => {
    const handleFullscreen = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreen);
    return () => document.removeEventListener("fullscreenchange", handleFullscreen);
  }, []);

  // Đồng bộ trạng thái khi bật/tắt Picture-in-Picture
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnterPiP = () => setIsPiP(true);
    const handleLeavePiP = () => setIsPiP(false);

    video.addEventListener("enterpictureinpicture", handleEnterPiP);
    video.addEventListener("leavepictureinpicture", handleLeavePiP);

    return () => {
      video.removeEventListener("enterpictureinpicture", handleEnterPiP);
      video.removeEventListener("leavepictureinpicture", handleLeavePiP);
    };
  }, []);

  // Bắt các phím tắt bàn phím
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Bỏ qua phím tắt nếu người dùng đang gõ phím vào ô nhập liệu
      const activeElement = document.activeElement;
      const isInput =
        activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA" ||
        activeElement.isContentEditable;

      if (isInput) return;

      const video = videoRef.current;
      if (!video) return;

      switch (e.code) {
        // Space: Phát / Tạm dừng
        case "Space":
          e.preventDefault();
          if (video.paused) {
            video.play();
          } else {
            video.pause();
          }
          break;

        // Mũi tên trái: Tua lùi 10s
        case "ArrowLeft":
          e.preventDefault();
          video.currentTime = Math.max(0, video.currentTime - 10);
          break;

        // Mũi tên phải: Tua tiến 10s
        case "ArrowRight":
          e.preventDefault();
          video.currentTime = Math.min(video.duration || 0, video.currentTime + 10);
          break;

        // Mũi tên lên: Tăng 10% âm lượng
        case "ArrowUp": {
          e.preventDefault();
          const newVolUp = Math.min(1, video.volume + 0.1);
          video.volume = newVolUp;
          if (setVolume) setVolume(newVolUp);
          if (newVolUp > 0) {
            video.muted = false;
            if (setIsMuted) setIsMuted(false);
          }
          break;
        }

        // Mũi tên xuống: Giảm 10% âm lượng
        case "ArrowDown": {
          e.preventDefault();
          const newVolDown = Math.max(0, video.volume - 0.1);
          video.volume = newVolDown;
          if (setVolume) setVolume(newVolDown);
          if (newVolDown === 0) {
            video.muted = true;
            if (setIsMuted) setIsMuted(true);
          }
          break;
        }

        // M: Bật / Tắt âm thanh
        case "KeyM":
          e.preventDefault();
          video.muted = !video.muted;
          if (setIsMuted) setIsMuted(video.muted);
          break;

        // F: Bật / Tắt toàn màn hình
        case "KeyF": {
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

        // S: Tua nhanh 30s
        case "KeyS":
          e.preventDefault();
          video.currentTime = Math.min(video.duration || 0, video.currentTime + 28);
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // ==========================================
  // 4. ACTIONS & HANDLERS (Hàm điều khiển)
  // ==========================================

  // Bật/tắt phát video
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Click vào video để hiện controls
  const handleVideoClick = () => {
    setShowControls(true);
  };

  // Tua một khoảng thời gian (giây)
  const handleSeek = (seconds) => {
    if (videoRef.current) videoRef.current.currentTime += seconds;
  };

  // Kéo thanh trượt timeline
  const handleSliderChange = (e) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Thay đổi tốc độ phát
  const handleSpeedChange = (speed) => {
    setPlaybackRate(speed);
    if (videoRef.current) videoRef.current.playbackRate = speed;
  };

  // Chuyển đổi độ phân giải video
  const handleQualityChange = (index) => {
    setCurrentQuality(index);
    if (hlsRef.current) hlsRef.current.currentLevel = index;
  };

  // Bật/tắt chế độ toàn màn hình
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Tự động ẩn controls sau 3s nếu không di chuyển chuột khi đang phát
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  // Lấy thời lượng chuẩn khi video load xong thông tin kỹ thuật
  const handleLoadedMetadata = () => {
    if (videoRef.current && Number.isFinite(videoRef.current.duration)) {
      setDuration(videoRef.current.duration);
    }
  };

  // Cập nhật mốc thời gian phát hiện tại
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (Number.isFinite(videoRef.current.duration)) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  // Kéo thanh âm lượng
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
    }
    setIsMuted(newVolume === 0);
  };

  // Bật/tắt tiếng và lưu/khôi phục mức volume trước đó
  const toggleMute = () => {
    if (!videoRef.current) return;

    if (isMuted) {
      const restoredVolume = prevVolumeRef.current || 1;
      videoRef.current.muted = false;
      videoRef.current.volume = restoredVolume;
      setVolume(restoredVolume);
      setIsMuted(false);
    } else {
      prevVolumeRef.current = volume;
      videoRef.current.muted = true;
      videoRef.current.volume = 0;
      setVolume(0);
      setIsMuted(true);
    }
  };

  // Bật/tắt chế độ Picture-in-Picture (thu nhỏ góc màn hình)
  const togglePiP = async () => {
    try {
      if (!document.pictureInPictureEnabled) {
        alert("Trình duyệt của bạn không hỗ trợ Picture-in-Picture!");
        return;
      }

      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (videoRef.current) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (error) {
      console.error("Lỗi khi chuyển đổi chế độ PiP:", error);
    }
  };

  return {
    containerRef,
    videoRef,
    isPlaying,
    currentTime,
    duration,
    qualities,
    currentQuality,
    playbackRate,
    showControls,
    isFullscreen,
    volume,
    isMuted,
    isPiP,
    handleVideoClick,
    togglePlay,
    handleSeek,
    handleSliderChange,
    handleSpeedChange,
    handleQualityChange,
    toggleFullscreen,
    handleMouseMove,
    handleLoadedMetadata,
    handleTimeUpdate,
    setShowControls,
    handleVolumeChange,
    toggleMute,
    setIsPlaying,
    togglePiP,
  };
};