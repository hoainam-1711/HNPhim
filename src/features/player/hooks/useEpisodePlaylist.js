import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

/**
 * useEpisodePlaylist
 * Quản lý logic chọn Server, tìm tập phim hiện tại, chuyển tập kế tiếp, kiểm tra tập cuối
 * và điều hướng phát phim. Dùng chung cho cả WatchPage và MovieDetailPage.
 *
 * @param {Object} params
 * @param {Array} params.episodesList - Danh sách các server và tập phim
 * @param {string} [params.ep] - Slug hoặc tên tập phim hiện tại từ URL params (dành cho WatchPage)
 * @param {string} params.slug - Slug phim hiện tại
 */
export const useEpisodePlaylist = ({ episodesList = [], ep, slug }) => {
  const navigate = useNavigate();

  const [selectedServer, setSelectedServer] = useState(0);

  // Tự động reset về server đầu tiên khi đổi phim (slug thay đổi)
  useEffect(() => {
    setSelectedServer(0);
  }, [slug]);

  // Server hiện tại được chọn (memoized)
  const currentServer = useMemo(
    () => episodesList[selectedServer] || episodesList[0],
    [episodesList, selectedServer],
  );

  // Danh sách tập của server hiện tại (memoized)
  const serverData = useMemo(
    () => currentServer?.server_data || [],
    [currentServer],
  );

  // Tập phim đầu tiên của server hiện tại
  const firstEpisode = useMemo(() => serverData[0] || null, [serverData]);

  // Tìm thông tin tập phim hiện tại một cách tối ưu (không cần useEffect sync)
  const currentEpData = useMemo(() => {
    if (!episodesList?.length) return null;
    if (!ep) return serverData[0] || null;

    // 1. Tìm trong server hiện tại
    let found = serverData.find(
      (item) => item.slug === ep || item.name === ep,
    );
    if (found) return found;

    // 2. Tìm ở các server khác nếu không thấy trong server hiện tại
    for (const server of episodesList) {
      found = server?.server_data?.find(
        (item) => item.slug === ep || item.name === ep,
      );
      if (found) return found;
    }

    return serverData[0] || null;
  }, [episodesList, serverData, ep]);

  // Chuyển sang tập phim được chọn (hoặc tập đầu tiên nếu không truyền)
  const handleWatchMovie = useCallback(
    (targetEp) => {
      const epToWatch = targetEp || serverData[0];
      if (epToWatch && slug) {
        const epSlug = epToWatch.slug || epToWatch.name;
        navigate(`/xem/${slug}/${epSlug}`);
      } else {
        console.warn("Chưa có thông tin tập phim để xem!");
      }
    },
    [serverData, slug, navigate],
  );

  // Chuyển sang tập tiếp theo
  const handleNextEpisode = useCallback(() => {
    if (!currentEpData || !serverData.length) return;

    const currentIndex = serverData.findIndex(
      (item) =>
        item.slug === currentEpData.slug || item.name === currentEpData.name,
    );

    if (currentIndex === -1 || currentIndex >= serverData.length - 1) return;

    const nextEpisode = serverData[currentIndex + 1];
    if (!nextEpisode) return;

    const epSlug = nextEpisode.slug || nextEpisode.name;
    navigate(`/xem/${slug}/${epSlug}`);
  }, [currentEpData, serverData, slug, navigate]);

  // Kiểm tra tập hiện tại có phải tập cuối của server không (memoized boolean)
  const isLast = useMemo(() => {
    if (!currentEpData || !serverData.length) return true;

    const currentIndex = serverData.findIndex(
      (item) =>
        item.slug === currentEpData.slug || item.name === currentEpData.name,
    );

    return currentIndex === -1 || currentIndex === serverData.length - 1;
  }, [currentEpData, serverData]);

  // Stable callback tương thích ngược với các caller gọi isLastEpisode()
  const isLastEpisode = useCallback(() => isLast, [isLast]);

  return {
    selectedServer,
    setSelectedServer,
    currentServer,
    serverData,
    firstEpisode,
    currentEpData,
    handleWatchMovie,
    handleNextEpisode,
    isLastEpisode,
    isLast,
  };
};

export default useEpisodePlaylist;
