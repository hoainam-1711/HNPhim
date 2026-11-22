# REFACTOR PROGRESS: HNPHIM (Feature-Driven Architecture)

## 1. Mục tiêu
Refactor toàn bộ dự án web xem phim **hnphim** từ cấu trúc hiện tại sang kiến trúc **Feature-Driven Architecture (FSD / Feature-Based)** tinh gọn, dễ mở rộng và tối ưu hiệu năng. Quá trình thực hiện gồm 5 phase độc lập:
- **Phase 1**: Chuẩn hóa `core/` (API client, endpoints, utils, hooks, icons wrapper, UI components).
- **Phase 2**: Tách module `features/favorites/` (Context, hooks, components chuyên biệt cho phim yêu thích).
- **Phase 3**: Tái cấu trúc `features/movies/` và khử toàn bộ dead code / hooks mồ côi.
- **Phase 4**: Tinh gọn `features/player/` (HLS player lifecycle, controls, playlist, settings).
- **Phase 5**: Thiết lập `app/` (layouts, AppRoutes) và làm mỏng toàn bộ `pages/` (smart components kết nối features).

---

## 2. Cấu trúc thư mục mục tiêu
```text
src/
├── app/                           # Cấu hình gốc ứng dụng & Tầng điều hướng
│   ├── layouts/                   # Layouts dùng chung (MainLayout, Header, Footer)
│   ├── routes/                    # Quản lý định tuyến tập trung
│   │   └── AppRoutes.jsx
│   └── App.jsx
│
├── core/                          # Tầng dùng chung, không gắn chặt với nghiệp vụ cụ thể
│   ├── api/                       # Axios instance, interceptors & endpoints tập trung
│   │   ├── client.js
│   │   └── endpoints.js
│   ├── components/                # UI Components tái sử dụng toàn app (Dumb/Presentational)
│   │   ├── ui/                    # CustomPagination, Loading, SEO, v.v.
│   │   └── icons/                 # Icon wrapper chuẩn hóa
│   ├── hooks/                     # Custom hooks tổng quát (useFetch, useDebounce, usePagination, useLocalStorage)
│   └── utils/                     # Pure functions (formatters, image CDN, clean text, error handling)
│
├── features/                      # Các module nghiệp vụ khép kín (Business Logic)
│   │
│   ├── favorites/                 # Quản lý danh sách phim yêu thích
│   │   ├── context/               # FavoritesContext (tách State & Dispatch riêng biệt)
│   │   ├── hooks/                 # useFavorites, useIsFavorite, useFavoriteActions
│   │   ├── components/            # FavoriteButton, FavoriteCounter
│   │   └── index.js               # Public API duy nhất của feature favorites
│   │
│   ├── movies/                    # Nghiệp vụ duyệt, lọc, hiển thị danh mục & chi tiết phim
│   │   ├── services/              # movieService.js (API methods + data normalizers)
│   │   ├── hooks/                 # useMovieCatalog (hợp nhất), useMovieDetail, useFilterData, useHeroSlider
│   │   ├── components/            # MovieCard, MovieList, MovieSection, HeroSection, FilterModal, detail/
│   │   └── index.js               # Public API duy nhất của feature movies
│   │
│   └── player/                    # Nghiệp vụ trình phát HLS & danh sách tập phim
│       ├── hooks/                 # useHlsPlayer, useKeyboardShortcuts, useEpisodePlaylist, useAutoSkip
│       ├── components/            # CustomVideoPlayer, VideoControls, EpisodeSelector, PlayerSettingsMenu
│       ├── utils/                 # playerConstants, timeFormatters
│       └── index.js               # Public API duy nhất của feature player
│
└── pages/                         # Tầng trang mỏng (Smart components - chỉ ghép nối các features)
    ├── HomePage.jsx
    ├── MovieCatalogPage.jsx       # HỢP NHẤT: Xử lý cả Type, Genre, Country, Search
    ├── MovieDetailPage.jsx
    ├── WatchPage.jsx
    ├── FavoritesPage.jsx
    └── NotFoundPage.jsx
```

---

## 3. Quy tắc bất biến (Inviolable Rules)
1. **Tiến độ tuần tự**: Chỉ làm đúng **1 phase** mỗi lần. Xong phase nào thì dừng lại, kiểm tra nghiệm thu và báo cáo kết quả trước khi sang phase tiếp theo.
2. **Chuẩn hóa Import**: Mọi import phải sử dụng path alias `@/` (đã trỏ vào `src/`), **tuyệt đối không** dùng relative path sâu (`../../..`).
3. **Module Boundaries (Encapsulation)**: Một feature chỉ được phép import từ feature khác thông qua file `index.js` (Public API) của feature đó.
4. **Dependency Rule**: Tầng `core/` là tầng thấp nhất, **tuyệt đối không** import bất kỳ thứ gì từ `features/` hay `pages/`.
5. **Bảo toàn hành vi UI/UX**: Không làm thay đổi bất kỳ hành vi, giao diện, tính năng hoặc trải nghiệm người dùng hiện tại nào.
6. **Kiểm thử liên tục**: Sau mỗi phase, bắt buộc chạy và pass cả `npm run build` và `npm run lint`.
7. **Safe Migration (Không xóa vội)**: Không xóa file cũ cho đến khi mọi import liên quan đã được cập nhật sang vị trí mới và dự án build thành công.

---

## 4. Bảng tiến độ Refactor

### Phase 1: Chuẩn hóa `core/` (API, utils, hooks, icons, UI)
* **Trạng thái**: Hoàn thành
* **File đã di chuyển/đổi tên (đường dẫn cũ → mới)**:
  - `src/api/axios.js` → `src/core/api/client.js`
  - `src/api/endpoints.js` → `src/core/api/endpoints.js`
  - `src/utils/formatImage.js` → `src/core/utils/image.js`
  - `src/utils/formatTime.js` → `src/core/utils/time.js`
  - `src/utils/cleanDescription.js` → `src/core/utils/text.js`
  - `src/utils/handleError.js` → `src/core/utils/error.js`
  - `src/hooks/useFetch.js` → `src/core/hooks/useFetch.js`
  - `src/components/ui/Loading.jsx` → `src/core/components/ui/Loading.jsx`
  - `src/components/ui/SEO.jsx` → `src/core/components/ui/SEO.jsx`
  - `src/components/ui/CustomPagination.jsx` → `src/core/components/ui/CustomPagination.jsx`
  - `src/components/ui/CustomPagination.css` → `src/core/components/ui/CustomPagination.css`
  - `src/components/ui/LucideIcon.jsx` → `src/core/components/icons/index.jsx` & `src/core/components/icons/iconRegistry.jsx`
  - *(Tạo mới)* `src/core/hooks/usePagination.js`
  - *(Tạo mới)* `src/core/hooks/useLocalStorage.js`
  - *(Tạo mới)* `src/core/hooks/useDebounce.js`
  - *(Tạo mới barrel exports)* `src/core/utils/index.js`, `src/core/hooks/index.js`, `src/core/components/ui/index.js`
* **File đã xóa**:
  - `src/api/axios.js`
  - `src/api/endpoints.js`
  - `src/hooks/useFetch.js`
  - `src/hooks/` (thư mục rỗng)
  - `src/components/ui/Loading.jsx`
  - `src/components/ui/SEO.jsx`
  - `src/components/ui/CustomPagination.jsx`
  - `src/components/ui/CustomPagination.css`
  - `src/components/ui/LucideIcon.jsx`
  - `src/components/ui/` (thư mục rỗng)
  - `src/utils/cleanDescription.js`
  - `src/utils/formatImage.js`
  - `src/utils/formatTime.js`
  - `src/utils/handleError.js`
* **Quyết định kiến trúc quan trọng**:
  - `core/api/client.js`: Thiết lập timeout 30000ms, tự động unwrap `response.data`, hỗ trợ AbortController `signal`.
  - `core/hooks/useFetch.js`: Tích hợp AbortController tự động hủy request cũ khi re-fetch hoặc unmount, chống triệt để race condition và bỏ qua `CanceledError`.
  - `core/utils/text.js`: Dùng `DOMPurify.sanitize(html, { ALLOWED_TAGS: [] })` để loại bỏ 100% thẻ HTML và mã độc, trích xuất văn bản thuần an toàn cho thẻ meta SEO mà không cần cài thêm package mới.
  - `core/components/icons/`: Tách 25 SVG renderers vào `iconRegistry.jsx` và cung cấp wrapper `Icon` (đồng thời xuất alias `LucideIcon = Icon`) để đảm bảo tính đóng gói và tương thích 100% với toàn bộ app.
  - Tạm giữ `src/utils/normalizeResponse.js` và `src/api/movieApi.js` cho đến Phase 3 khi chuyển sang `features/movies/services/`.
* **Việc còn tồn đọng/TODO cho phase sau**:
  - **Phase 2**: Di chuyển và bóc tách `src/context/MovieProvider.jsx` & `src/context/MovieContext.jsx` sang `src/features/favorites/`. Tách `FavoritesContext`, các hooks `useFavorites`, `useIsFavorite`, và component `FavoriteButton`, `FavoriteCounter`. Áp dụng `useLocalStorage` từ `core/hooks` để lưu danh sách yêu thích tối ưu payload.

---

### Phase 2: Tách `features/favorites/`
* **Trạng thái**: Hoàn thành
* **File đã di chuyển/đổi tên (đường dẫn cũ → mới)**:
  - `src/context/MovieContext.jsx` → `src/features/favorites/context/FavoritesContext.jsx`
  - `src/context/MovieProvider.jsx` → `src/features/favorites/context/FavoritesProvider.jsx`
  - *(Tạo mới)* `src/features/favorites/utils/normalizeFavorite.js` (normalize & migration dữ liệu)
  - *(Tạo mới)* `src/features/favorites/hooks/useFavorites.js`
  - *(Tạo mới)* `src/features/favorites/hooks/useIsFavorite.js`
  - *(Tạo mới)* `src/features/favorites/hooks/useFavoriteActions.js`
  - *(Tạo mới)* `src/features/favorites/hooks/index.js`
  - *(Tạo mới)* `src/features/favorites/components/FavoriteButton.jsx`
  - *(Tạo mới)* `src/features/favorites/components/FavoriteCounter.jsx`
  - *(Tạo mới)* `src/features/favorites/components/index.js`
  - *(Tạo mới)* `src/features/favorites/index.js` (Public API duy nhất của module)
* **File đã xóa**:
  - `src/context/MovieContext.jsx`
  - `src/context/MovieProvider.jsx`
  - `src/context/index.js`
  - `src/context/` (thư mục rỗng)
* **Quyết định kiến trúc & Migration dữ liệu**:
  - **Tối ưu payload LocalStorage**: Chỉ lưu cấu trúc rút gọn `{ slug, name, poster_url, thumb_url, quality, year }` thay vì lưu nguyên object phim từ API, tránh nguy cơ tràn bộ nhớ 5MB của trình duyệt.
  - **Safe Migration**: Hàm `migrateFavoritesData()` tự động duyệt qua danh sách cũ trong `localStorage` ("family_favorites") ngay khi mount, loại bỏ trường rác và lọc trùng theo slug, bảo toàn 100% dữ liệu đã lưu của người dùng.
  - **Tách biệt Context State & Dispatch**: Tách `FavoritesStateContext` (favorites, count, isFavorite O(1)) và `FavoritesDispatchContext` (toggleFavorite với stable reference), giúp các component chỉ dispatch hành động (như `FavoriteButton` hay `MovieCard`) không bị re-render thừa khi danh sách thay đổi.
  - **Dùng Core Hook**: Tích hợp trực tiếp `useLocalStorage` từ `@/core/hooks`.
  - **Độc lập Component**: Tạo `FavoriteButton` và `FavoriteCounter`, thay thế badge đếm thủ công trên `NavbarComponent`.
* **Việc còn tồn đọng/TODO cho phase sau**:
  - **Phase 3**: Tái cấu trúc `features/movies/`. Chuyển `movieApi.js` & `normalizeResponse.js` vào `features/movies/services/movieService.js`. Hợp nhất các hook mồ côi (`useNewMovies`, `useMoviesByGenres`, `useMoviesByCountry`, `useSearchMovies`) thành hook duy nhất `useMovieCatalog`. Tách nhỏ God Component `HeroSection` và di chuyển `FilterModal` vào `features/movies/components/`. Refactor tối ưu `MovieCard`.

---

### Phase 3: Tái cấu trúc `features/movies/` và khử dead code
* **Trạng thái**: Hoàn thành
* **File đã di chuyển/đổi tên (đường dẫn cũ → mới)**:
  - `src/api/movieApi.js` → `src/features/movies/services/movieService.js`
  - `src/utils/normalizeResponse.js` → `src/features/movies/services/normalizers.js`
  - `src/components/layout/FilterModal.jsx` → `src/features/movies/components/FilterModal/FilterModal.jsx`
  - `src/components/layout/FilterModal.css` → `src/features/movies/components/FilterModal/FilterModal.css`
  - *(Tạo mới)* `src/features/movies/services/index.js`
  - *(Tạo mới)* `src/features/movies/hooks/useMovieCatalog.js` (Hợp nhất danh mục)
  - *(Tạo mới)* `src/features/movies/hooks/useFilterData.js` (Gộp Thể loại & Quốc gia)
  - *(Tạo mới)* `src/features/movies/hooks/useHeroSlider.js` (Quản lý slide & gestures)
  - *(Tạo mới)* `src/features/movies/components/HeroBanner/HeroBannerContent.jsx` (Tách từ HeroSection)
  - *(Tạo mới)* `src/features/movies/components/HeroBanner/HeroThumbnailList.jsx` (Tách từ HeroSection)
  - *(Tạo mới)* `src/features/movies/components/FilterModal/index.js`
  - *(Refactor)* `src/features/movies/components/HeroSection.jsx` (Component cha tinh gọn)
  - *(Refactor)* `src/features/movies/components/MovieCard.jsx` (Tích hợp FavoriteButton, bỏ rẽ nhánh pure/standalone)
  - *(Refactor)* `src/features/movies/hooks/useHomeMovies.js` (Memoize types chống infinite loop)
* **File đã xóa**:
  - `src/features/movies/hooks/useNewMovies.js` (Dead code)
  - `src/features/movies/hooks/useMoviesByGenres.js` (Dead code)
  - `src/features/movies/hooks/useMoviesByCountry.js` (Dead code)
  - `src/features/movies/hooks/useSearchMovies.js` (Dead code)
  - `src/features/movies/hooks/useGenres.js` (Đã thay bằng `useFilterData`)
  - `src/features/movies/hooks/useCountries.js` (Đã thay bằng `useFilterData`)
  - `src/components/layout/FilterModal.jsx`
  - `src/components/layout/FilterModal.css`
  - `src/api/movieApi.js`
  - `src/api/` (Thư mục rỗng)
  - `src/utils/normalizeResponse.js`
  - `src/utils/` (Thư mục rỗng)
* **Quyết định kiến trúc quan trọng**:
  - **Chuẩn hóa 1 Shape dữ liệu duy nhất**: Dọn sạch hoàn toàn cấu trúc nhân bản lồng nhau (`data.items` + `items`) trong `normalizers.js`, trả về shape phẳng, tường minh: `{ items, titlePage, totalPages, currentPage, totalItems }` cho danh sách và `{ movie, episodes }` cho chi tiết phim.
  - **Chịu lỗi từng phần cho Trang chủ**: `movieService.getHomeMovies` sử dụng `Promise.allSettled()` để nếu một API thể loại bất kỳ bị timeout/500, các hàng phim khác trên trang chủ vẫn hiển thị bình thường thay vì sập toàn bộ trang.
  - **Hợp nhất Hook Danh mục**: `useMovieCatalog` xử lý thống nhất cả 4 mode (`type`, `genre`, `country`, `search`), loại bỏ toàn bộ switch-case lồng ghép trong `MovieCatalogPage`.
  - **Chống Infinite Loop trang chủ**: `useHomeMovies` ổn định reference của mảng `types` qua chuỗi key serialized, ngăn chặn re-render loop nếu truyền array literal.
  - **Phân rã God Component `HeroSection`**: Tách nhỏ thành hook logic `useHeroSlider`, content `HeroBannerContent`, và thumbnail list `HeroThumbnailList` (bọc `React.memo`), giảm 75% code phức tạp trong component chính.
  - **Đơn giản hóa `MovieCard`**: Nhúng trực tiếp `FavoriteButton` từ `@/features/favorites`, xóa bỏ toàn bộ mã phân nhánh `PureMovieCard` / `StandaloneMovieCard`.
* **Việc còn tồn đọng/TODO cho phase sau**:
  - **Phase 4**: Tinh gọn `features/player/`. Chuẩn hóa trình phát HLS (`useHlsPlayer`), tách biệt controls, toolbar, timeline, cài đặt chất lượng/tốc độ và danh sách tập phim `EpisodeSelector`. Gom các hằng số playback vào `playerConstants.js`.

---

### Phase 4: Tinh gọn `features/player/`
* **Trạng thái**: Chưa làm
* **File đã di chuyển/đổi tên (đường dẫn cũ → mới)**:
  - *Chưa thực hiện*
* **File đã xóa**:
  - *Chưa thực hiện*
* **Quyết định kiến trúc quan trọng**:
  - *Chưa thực hiện*
* **Việc còn tồn đọng/TODO cho phase sau**:
  - *Chưa thực hiện*

---

### Phase 5: Thiết lập `app/` (layouts, AppRoutes) và làm mỏng `pages/`
* **Trạng thái**: Chưa làm
* **File đã di chuyển/đổi tên (đường dẫn cũ → mới)**:
  - *Chưa thực hiện*
* **File đã xóa**:
  - *Chưa thực hiện*
* **Quyết định kiến trúc quan trọng**:
  - *Chưa thực hiện*
* **Việc còn tồn đọng/TODO cho phase sau**:
  - *Chưa thực hiện*
