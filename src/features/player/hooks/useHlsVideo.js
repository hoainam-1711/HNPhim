import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

export const useHlsVideo = (m3u8Url) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const [isPiP, setIsPiP] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);

  // Thời gian và thanh timeline
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Thay đổi chất lượng hình ảnh
  const [qualities, setQualities] = useState([]);
  const [currentQuality, setCurrentQuality] = useState(-1);

  // Tốc độ video
  const [playbackRate, setPlaybackRate] = useState(1);

  // State cho fullscreen & controls
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // State cho âm lượng (0 đến 1) và tắt tiếng
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const prevVolumeRef = useRef(1);

  // Khởi tạo HLS
  useEffect(() => {
    const video = videoRef.current;
    if (!m3u8Url || !video) return;

    let hls;
    if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hlsRef.current = hls;
      hls.loadSource(m3u8Url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        setQualities(
          data.levels.map((level, index) => ({
            id: index,
            height: level.height,
            bitrate: level.bitrate,
          })),
        );
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = m3u8Url;
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [m3u8Url]);

  // [ĐIỂM C] Dọn dẹp Timeout khi Unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Lắng nghe sự kiện Fullscreen
  useEffect(() => {
    const handleFullscreen = () =>
      setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreen);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreen);
  }, []);

  // Thêm vào trong CustomVideoPlayer component
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 1. Kiểm tra nếu người dùng đang nhập văn bản (search, comment...) thì KHÔNG kích hoạt phím tắt
      const activeElement = document.activeElement;
      const isInput =
        activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA" ||
        activeElement.isContentEditable;

      if (isInput) return;

      // 2. Kiểm tra tham chiếu thẻ video
      const video = videoRef.current;
      if (!video) return;

      switch (e.code) {
        // Phím Space: Play / Pause
        case "Space":
          e.preventDefault(); // Tránh cuộn trang
          if (video.paused) {
            video.play();
          } else {
            video.pause();
          }
          break;

        // Mũi tên trái: Tua lùi 10 giây
        case "ArrowLeft":
          e.preventDefault();
          video.currentTime = Math.max(0, video.currentTime - 10);
          break;

        // Mũi tên phải: Tua tiến 10 giây
        case "ArrowRight":
          e.preventDefault();
          video.currentTime = Math.min(
            video.duration || 0,
            video.currentTime + 10,
          );
          break;

        // Mũi tên lên: Tăng âm lượng 10%
        case "ArrowUp": {
          e.preventDefault();
          const newVolUp = Math.min(1, video.volume + 0.1);
          video.volume = newVolUp;
          if (setVolume) setVolume(newVolUp); // Cập nhật state UI nếu dùng custom bar
          if (newVolUp > 0) {
            video.muted = false;
            if (setIsMuted) setIsMuted(false);
          }
          break;
        }

        // Mũi tên xuống: Giảm âm lượng 10%
        case "ArrowDown": {
          e.preventDefault();
          const newVolDown = Math.max(0, video.volume - 0.1);
          video.volume = newVolDown;
          if (setVolume) setVolume(newVolDown); // Cập nhật state UI
          if (newVolDown === 0) {
            video.muted = true;
            if (setIsMuted) setIsMuted(true);
          }
          break;
        }

        // Phím M: Mute / Unmute
        case "KeyM":
          e.preventDefault();
          video.muted = !video.muted;
          if (setIsMuted) setIsMuted(video.muted);
          break;

        // Phím F: Fullscreen / Exit Fullscreen
        case "KeyF": {
          e.preventDefault();
          // Lấy container bọc ngoài player để phóng to cả khung thanh điều khiển
          const targetContainer = containerRef?.current || video;

          if (!document.fullscreenElement) {
            if (targetContainer.requestFullscreen) {
              targetContainer.requestFullscreen();
            } else if (targetContainer.webkitRequestFullscreen) {
              /* Safari */
              targetContainer.webkitRequestFullscreen();
            }
          } else {
            if (document.exitFullscreen) {
              document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
              /* Safari */
              document.webkitExitFullscreen();
            }
          }
          break;
        }

        // Phím S: Skip 30s
        case "KeyS":
          e.preventDefault();
          video.currentTime = Math.min(
            video.duration || 0,
            video.currentTime + 29,
          );
          break;

        // Mặc định
        default:
          break;
      }
    };

    // Đăng ký sự kiện
    window.addEventListener("keydown", handleKeyDown);

    // Dọn dẹp sự kiện khi component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [videoRef, containerRef]);

  // Actions
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

  const handleVideoClick = () => {
    setShowControls(true);
  };

  const handleSeek = (seconds) => {
    if (videoRef.current) videoRef.current.currentTime += seconds;
  };

  const handleSliderChange = (e) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackRate(speed);
    if (videoRef.current) videoRef.current.playbackRate = speed;
  };

  const handleQualityChange = (index) => {
    setCurrentQuality(index);
    if (hlsRef.current) hlsRef.current.currentLevel = index;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3500);
  };

  // [ĐIỂM B] Bắt thời lượng chuẩn khi video load xong metadata
  const handleLoadedMetadata = () => {
    if (videoRef.current && Number.isFinite(videoRef.current.duration)) {
      setDuration(videoRef.current.duration);
    }
  };

  // [ĐIỂM B] Cập nhật thời gian thực & thời lượng
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (Number.isFinite(videoRef.current.duration)) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
    }
    setIsMuted(newVolume === 0);
  };

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

  // Hàm chuyển đổi chế độ Picture-in-Picture
  const togglePiP = async () => {
    try {
      if (!document.pictureInPictureEnabled) {
        alert("Trình duyệt của bạn không hỗ trợ Picture-in-Picture!");
        return;
      }

      if (document.pictureInPictureElement) {
        // Nếu đang ở chế độ PiP -> Thoát PiP
        await document.exitPictureInPicture();
      } else if (videoRef.current) {
        // Nếu chưa bật -> Bật PiP
        await videoRef.current.requestPictureInPicture();
      }
    } catch (error) {
      console.error("Lỗi khi chuyển đổi chế độ PiP:", error);
    }
  };

  // Đồng bộ trạng thái khi người dùng thoát PiP bằng nút mặc định của trình duyệt
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
  }, [videoRef]);

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
