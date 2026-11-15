# HNPhim - Movie Streaming Website

A modern, high-performance movie streaming web application built with **React 18** and **Vite 8**, structured with a modular feature-based architecture for scalability and maintainability.

## Live Demo

**Link Website:** [https://hnphim.vercel.app](https://hnphim.vercel.app)

## Tech Stack

- **Core:** React 18, Vite 8, React Router v7
- **UI & Styling:** Bootstrap 5, React Bootstrap, Custom CSS
- **Video Streaming:** HLS.js (Custom Video Player with keyboard shortcuts & episode playlist)
- **Data Fetching & Security:** Axios, REST API, DOMPurify (XSS sanitization)
- **SEO & Metadata:** React Helmet Async

## Key Features

- **Browse & Discover:** Explore trending, latest, and categorized movies via a unified catalog view.
- **Advanced Search & Filtering:** Real-time debounced search and lazy-loaded filtering by genre, country, and type.
- **Custom HLS Video Player:** Watch movies by episode with custom video controls, isolated timeline rendering, and keyboard navigation.
- **Favorites Management:** Save and manage favorite movies with persistent `localStorage` synchronization and split state/dispatch contexts to prevent unnecessary re-renders.
- **Pagination & Responsive Design:** Smooth pagination controls and mobile-first responsive layouts across all devices.

## Project Structure

```text
src/
├── api/          # General API configuration, axiosInstance, and central API calls
├── assets/       # Static assets (images, logo, static icons)
├── components/   # Application-wide shared UI components (Shared UI & Common Layouts)
├── context/      # Global State Management (Bookmarks, Watch History, LocalStorage sync)
├── features/     # Feature-based modules grouping logic & UI (movies, video player)
├── hooks/        # Generic / Reusable custom React hooks
├── layouts/      # Main layout wrappers for application routes
├── pages/        # Main page views (HomePage, WatchPage, MovieDetailPage, etc.)
└── utils/        # Utility helper functions (error handling, formatting, etc.)
```

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the project:

```bash
npm run dev
```

4. Open:

```text
http://localhost:5173
```

## Disclaimer

- This project was created for educational purposes and internal family entertainment use only.
- All movie data, images, and video stream links are fetched from publicly available APIs on the internet. This application does not host or assume legal ownership of any third-party media content.
