import "./HeroSection.css";
import { memo } from "react";
import useHeroSlider from "../hooks/useHeroSlider";
import HeroBannerContent from "./HeroBanner/HeroBannerContent";
import HeroThumbnailList from "./HeroBanner/HeroThumbnailList";

/**
 * HeroSection: Component Banner trên đầu trang chủ, đã được phân rã thành các subcomponents tinh gọn
 */
const HeroSection = ({ movies = [] }) => {
  const total = movies.length;

  const {
    selectedIndex,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleTouchCancel,
    handleSelectThumb,
  } = useHeroSlider({ total });

  if (total === 0) return null;

  const currentMovie = movies[selectedIndex] || movies[0];

  return (
    <section
      className="hero-section"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      <div className="hero-main-container">
        <HeroBannerContent movie={currentMovie} />
        <HeroThumbnailList
          movies={movies}
          selectedIndex={selectedIndex}
          onSelectThumb={handleSelectThumb}
        />
      </div>
    </section>
  );
};

export default memo(HeroSection);
