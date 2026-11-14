import { memo, useMemo } from "react";
import formatTime from "../../../utils/formatTime";

/**
 * VideoTimeline:
 * Quản lý hiển thị thời gian hiện tại / tổng thời lượng và thanh trượt tiến trình phát.
 * Được bọc React.memo để cô lập việc re-render theo tần số timeupdate,
 * không làm re-render toàn bộ toolbar hay các nút điều khiển.
 */
export const VideoTimeline = memo(function VideoTimeline({
  currentTime = 0,
  duration = 0,
  onSliderChange,
}) {
  const currentTimeFormat = useMemo(
    () => formatTime(currentTime),
    [currentTime],
  );

  const durationFormat = useMemo(() => formatTime(duration), [duration]);
  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Thời gian phát */}
      <span className="video-time">
        <span className="video-time-current">{currentTimeFormat}</span>
        <span className="video-time-separator">/</span>
        <span>{durationFormat}</span>
      </span>

      {/* Thanh tiến trình (Timeline slider) */}
      <div className="video-timeline">
        <input
          type="range"
          className="video-progress"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={onSliderChange}
          style={{ "--progress": `${progressPercent}%` }}
        />
      </div>
    </>
  );
});

export default VideoTimeline;
