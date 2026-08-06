src/
├── assets/             # Dữ liệu tĩnh (logo, hình ảnh, icon)
├── components/         # Các thành phần tái sử dụng
│   ├── Navbar.jsx      # Thanh menu, ô tìm kiếm
│   ├── MovieCard.jsx   # Thẻ hiển thị 1 bộ phim (ảnh poster, tên phim)
│   ├── MovieList.jsx   # Danh sách danh mục phim (Phim mới, Phim bộ...)
│   └── Footer.jsx      # Chân trang
├── pages/              # Các trang chính của website
│   ├── HomePage.jsx    # Trang chủ (hiển thị danh sách phim)
│   ├── DetailPage.jsx  # Trang chi tiết bộ phim (thông tin, diễn viên, danh sách tập)
│   ├── WatchPage.jsx   # Trang xem phim (chứa khung video player)
│   └── SearchPage.jsx  # Trang kết quả tìm kiếm
├── services/           # Nơi chứa các hàm gọi API
│   └── movieApi.js     # Hàm fetch data từ vsmov.com
├── App.jsx             # Cấu hình Router chuyển trang
└── main.jsx            # Entry point của React
