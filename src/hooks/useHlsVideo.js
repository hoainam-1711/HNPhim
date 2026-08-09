import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

export const useHlsVideo = (m3u8Url) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

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
  };
};