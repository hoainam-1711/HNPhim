# HNPhim - Movie Website

A movie streaming website built with **React** + **Vite**.

## Live Demo

**Link Website:** [https://hnphim.vercel.app](https://hnphim.vercel.app)


## Technologies

- ReactJS
- React Router
- Axios
- React Bootstrap
- REST API
- React Helmet Async
- Hls.js

## Features

- Browse movies
- Search for movies
- Filter by genre
- View movie details
- Watch movies by episode
- Manage favorite movies
- Pagination
- Responsive design

## Installation

Install dependencies:

```bash
npm install
```

Run the project:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

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

## Disclaimer

- This project was created for educational purposes and internal family entertainment use only.
- All movie data, images, and video stream links are fetched from publicly available APIs on the internet. This application does not host or assume legal ownership of any third-party media content.