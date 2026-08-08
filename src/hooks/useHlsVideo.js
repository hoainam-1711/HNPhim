import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

export const useHlsVideo = (m3u8Url) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [qualities, setQualities] = useState([]);
  const [currentQuality, setCurrentQuality] = useState(-1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
      video.addEventListener("loadedmetadata", () => video.play());
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [m3u8Url]);

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

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
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
    togglePlay,
    handleSeek,
    handleSliderChange,
    handleSpeedChange,
    handleQualityChange,
    toggleFullscreen,
    handleMouseMove,
    handleTimeUpdate,
    setShowControls,
  };
};
