import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

/**
 * useEpisodePlaylist
 * Quản lý logic tìm tập phim, chọn Server, chuyển tập kế tiếp và kiểm tra tập cuối
 *
 * @param {Object} params
 * @param {Array} params.episodesList - Danh sách các server và tập phim
 * @param {string} params.ep - Slug hoặc tên tập phim hiện tại từ URL params
 * @param {string} params.slug - Slug phim hiện tại
 */
export const useEpisodePlaylist = ({ episodesList = [], ep, slug }) => {
  const navigate = useNavigate();

  const [selectedServer, setSelectedServer] = useState(0);
  const [currentEpData, setCurrentEpData] = useState(null);

  // Tìm thông tin tập phim khi episodesList, ep hoặc selectedServer thay đổi
  useEffect(() => {
    if (!episodesList.length) return;

    const server = episodesList[selectedServer] || episodesList[0];

    // Tìm trong server hiện tại
    let foundEp = server?.server_data?.find(
      (item) => item.slug === ep || item.name === ep,
    );

    // Tìm ở các server khác nếu không thấy
    if (!foundEp) {
      for (const s of episodesList) {
        foundEp = s.server_data?.find(
          (item) => item.slug === ep || item.name === ep,
        );
        if (foundEp) break;
      }
    }

    setCurrentEpData(foundEp || server?.server_data?.[0]);
  }, [episodesList, ep, selectedServer]);

  const currentServer = episodesList[selectedServer] || episodesList[0];
  const serverData = useMemo(
    () => currentServer?.server_data || [],
    [currentServer],
  );

  // Chuyển sang tập phim được chọn
  const handleWatchMovie = useCallback(
    (targetEp) => {
      if (targetEp) {
        const epSlug = targetEp.slug || targetEp.name;
        navigate(`/xem/${slug}/${epSlug}`);
      } else {
        console.warn("Chưa có thông tin tập phim để xem!");
      }
    },
    [slug, navigate],
  );

  // Chuyển sang tập tiếp theo
  const handleNextEpisode = useCallback(() => {
    if (!currentEpData || !serverData.length) return;

    const currentIndex = serverData.findIndex(
      (item) => item.slug === currentEpData.slug,
    );

    if (currentIndex === -1) return;

    const nextEpisode = serverData[currentIndex + 1];
    if (!nextEpisode) {
      return;
    }

    const epSlug = nextEpisode.slug || nextEpisode.name;
    navigate(`/xem/${slug}/${epSlug}`);
  }, [currentEpData, serverData, slug, navigate]);

  // Kiểm tra tập hiện tại có phải tập cuối của server không
  const isLastEpisode = useCallback(() => {
    const currentIndex = serverData.findIndex(
      (item) => item.slug === currentEpData?.slug,
    );
    return currentIndex === -1 || currentIndex === serverData.length - 1;
  }, [serverData, currentEpData]);

  return {
    selectedServer,
    setSelectedServer,
    currentEpData,
    currentServer,
    serverData,
    handleWatchMovie,
    handleNextEpisode,
    isLastEpisode,
  };
};

export default useEpisodePlaylist;
