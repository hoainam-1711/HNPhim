import { useEffect, useRef } from "react";
import Hls from "hls.js";

const CustomVideoPlayer = ({ src, poster }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!src || !video) return;

    let hls;

    // 1. Nếu trình duyệt hỗ trợ HLS.js (Chrome, Firefox, Edge, Android...)
    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {
          // Trình duyệt chặn autoplay có tiếng
          console.log("Autoplay bị chặn, chờ tương tác người dùng");
        });
      });
    }
    // 2. Nếu là Safari / iOS (Trình duyệt hỗ trợ HLS tự nhiên)
    else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.addEventListener("loadedmetadata", () => {
        video.play();
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  return (
    <div className="ratio ratio-16x9 rounded overflow-hidden shadow-lg bg-black">
      <video
        ref={videoRef}
        controls
        playsInline
        poster={poster}
        className="w-100 h-100"
      />
    </div>
  );
};

export default CustomVideoPlayer;