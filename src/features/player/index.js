// Components
export { default as CustomVideoPlayer } from "./components/CustomVideoPlayer";
export { default as VideoControls } from "./components/VideoControls";
export { default as EpisodeSelector } from "./components/EpisodeSelector";
export { default as PlayerSettingsMenu } from "./components/PlayerSettingsMenu";
export { default as VideoTimeline } from "./components/VideoTimeline";
export { default as VideoToolbar } from "./components/VideoToolbar";

// Hooks
export { default as useHlsPlayer } from "./hooks/useHlsPlayer";
export { default as useHlsVideo } from "./hooks/useHlsPlayer"; // Alias tương thích
export { default as useEpisodePlaylist } from "./hooks/useEpisodePlaylist";
export {
  default as useKeyboardShortcuts,
  useKeyboardControls,
} from "./hooks/useKeyboardShortcuts";
export { default as useAutoSkip } from "./hooks/useAutoSkip";

// Constants & Utilities
export * from "./utils/playerConstants";
