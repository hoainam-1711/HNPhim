import { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import useKeyboardShortcuts from "./useKeyboardShortcuts";
import useAutoSkip from "./useAutoSkip";

/**
 * useHlsVideo
 * Quản lý vòng đời luồng phát HLS (hls.js), thẻ video, các chế độ Fullscreen, PiP,
 * âm lượng và điều khiển phát lại.
 */
export const useHlsVideo = (m3u8Url) => {
  // 1. REFS
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const prevVolumeRef = useRef(1);

  // 2. STATES
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  const [qualities, setQualities] = useState([]);
  const [currentQuality, setCurrentQuality] = useState(-1);

  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPiP, setIsPiP] = useState(false);

  // 3. SUB-HOOKS
  // Quản lý tự động tua ở mốc 15 phút
  const { isAutoSkip, toggleAutoSkip } = useAutoSkip(videoRef, m3u8Url);

  // Lắng nghe phím tắt điều khiển bàn phím
  useKeyboardShortcuts({
    videoRef,
    containerRef,
    setVolume,
    setIsMuted,
  });

  // 4. EFFECTS
  // Khởi tạo HLS instance
  useEffect(() => {
    const video = videoRef.current;
    if (!m3u8Url || !video) return;

    let hls;
    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        lowLatencyMode: true,
      });

      hlsRef.current = hls;
      hls.loadSource(m3u8Url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
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

  // Reset playbackRate khi đổi video/m3u8Url
  useEffect(() => {
    setPlaybackRate(1);
    if (videoRef.current) {
      videoRef.current.playbackRate = 1;
    }
  }, [m3u8Url]);

  // Dọn dẹp timeout controls
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Lắng nghe Fullscreen change
  useEffect(() => {
    const handleFullscreen = () =>
      setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleFullscreen);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreen);
  }, []);

  // Lắng nghe PiP change
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

  // 5. HANDLERS
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleVideoClick = useCallback(() => {
    setShowControls(true);
  }, []);

  const handleSeek = useCallback((seconds) => {
    if (videoRef.current) videoRef.current.currentTime += seconds;
  }, []);

  const handleSliderChange = useCallback((e) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const handleSpeedChange = useCallback((speed) => {
    setPlaybackRate(speed);
    if (videoRef.current) videoRef.current.playbackRate = speed;
  }, []);

  const handleQualityChange = useCallback((index) => {
    setCurrentQuality(index);
    if (hlsRef.current) hlsRef.current.currentLevel = index;
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  }, [isPlaying]);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current && Number.isFinite(videoRef.current.duration)) {
      setDuration(videoRef.current.duration);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (Number.isFinite(videoRef.current.duration)) {
        setDuration(videoRef.current.duration);
      }
    }
  }, []);

  const handleVolumeChange = useCallback((e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
    }
    setIsMuted(newVolume === 0);
  }, []);

  const toggleMute = useCallback(() => {
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
  }, [isMuted, volume]);

  const togglePiP = useCallback(async () => {
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
  }, []);

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
    isAutoSkip,
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
    toggleAutoSkip,
  };
};

export default useHlsVideo;
