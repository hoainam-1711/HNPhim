import { useHlsVideo } from "../hooks/useHlsVideo";
import VideoControls from "./VideoControls";

const CustomVideoPlayer = ({ m3u8Url, poster }) => {
  const videoProps = useHlsVideo(m3u8Url);

  return (
    <div
      ref={videoProps.containerRef}
      className="position-relative w-100 bg-black overflow-hidden rounded shadow-lg ratio ratio-16x9"
      onMouseMove={videoProps.handleMouseMove}
      onMouseLeave={() =>
        videoProps.isPlaying && videoProps.setShowControls(false)
      }
    >
      <video
        ref={videoProps.videoRef}
        className="w-100 h-100 object-fit-contain"
        onLoadedMetadata={videoProps.handleLoadedMetadata}
        onTimeUpdate={videoProps.handleTimeUpdate}
        onPlay={() => videoProps.setIsPlaying(true)}
        onPause={() => videoProps.setIsPlaying(false)}
        onClick={videoProps.togglePlay}
        poster={poster}
      />

      <VideoControls {...videoProps} />
    </div>
  );
};

export default CustomVideoPlayer;