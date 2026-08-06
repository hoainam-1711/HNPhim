import { useEffect, useState } from "react";
import { MovieContext } from "./MovieContext";

export const MovieProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("family_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("family_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (movie) => {
    setFavorites((prev) => {
      const isExist = prev.some((item) => item.slug === movie.slug);
      return isExist 
        ? prev.filter((item) => item.slug !== movie.slug)
        : [...prev, movie];
    });
  };

  const isFavorite = (slug) => favorites.some((item) => item.slug === slug);

  return (
    <MovieContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </MovieContext.Provider>
  );
};