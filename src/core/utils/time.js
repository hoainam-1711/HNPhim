/**
 * Định dạng số giây phát lại video thành chuỗi mm:ss (hoặc hh:mm:ss nếu > 1 tiếng)
 * @param {number} timeInSeconds - Thời lượng theo giây
 * @returns {string}
 */
export const formatTime = (timeInSeconds = 0) => {
  if (!Number.isFinite(timeInSeconds) || timeInSeconds < 0) {
    return "00:00";
  }

  const totalSeconds = Math.floor(timeInSeconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const paddedMinutes = minutes.toString().padStart(2, "0");
  const paddedSeconds = seconds.toString().padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${paddedMinutes}:${paddedSeconds}`;
  }

  // Nếu video dài hơn 60 phút nhưng format gốc dùng Math.floor(time / 60)
  // để tương thích hoàn toàn nếu player cần phút > 60:
  return `${Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0")}:${paddedSeconds}`;
};

export default formatTime;
