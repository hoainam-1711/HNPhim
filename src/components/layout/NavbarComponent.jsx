import "./NavbarComponent.css";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Form, Button, InputGroup, Container } from "react-bootstrap";
import { MovieContext } from "../../context/MovieContext";
import LucideIcon from "../ui/LucideIcon";
import FilterModal from "./FilterModal";

function NavbarComponent() {
  // 1. Context & Navigation Hooks
  const { favorites } = useContext(MovieContext);
  const navigate = useNavigate();

  // 2. Local States
  const [keyword, setKeyword] = useState("");
  const [showModal, setShowModal] = useState(false);

  // 3. Modal Handlers
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  // 4. Xử lý tìm kiếm phim (điều hướng URL kèm keyword và cuộn lên đầu trang)
  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword) {
      navigate(`/tim-kiem/${encodeURIComponent(trimmedKeyword)}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Navbar variant="dark" expand="sm" sticky="top" className="youtube-navbar">
      <Container fluid className="px-2 px-sm-3 px-lg-4">
        {/* Logo HNPHIM */}
        <Navbar.Brand
          as={Link}
          to="/"
          className="youtube-logo d-flex align-items-center"
        >
          <LucideIcon icon="Logo" fill="#fe0033"/>
          <span>HNPhim</span>
        </Navbar.Brand>

        {/* Nút Hamburger menu toggle trên Mobile */}
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="border-0 shadow-none p-1"
        />

        {/* Khối menu mở rộng */}
        <Navbar.Collapse id="basic-navbar-nav">
          <div className="navbar-row-content d-flex align-items-center justify-content-center gap-2 w-100 mt-2 mt-lg-0">
            {/* 1. Nút mở Modal Thể loại */}
            <Button
              variant="link"
              onClick={handleShow}
              className="youtube-nav-btn text-nowrap"
            >
              Khám Phá
            </Button>

            <FilterModal show={showModal} handleClose={handleClose} />

            {/* 2. Ô tìm kiếm từ khóa */}
            <Form
              onSubmit={handleSearch}
              className="youtube-search-form flex-grow-1 my-0 ms-auto me-1"
            >
              <InputGroup className="youtube-search">
                <Form.Control
                  type="text"
                  placeholder="Tìm kiếm"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="youtube-search-input"
                />
                <Button type="submit" className="youtube-search-btn">
                  <LucideIcon icon="Search" />
                </Button>
              </InputGroup>
            </Form>

            {/* 3. Nút dẫn đến danh sách phim ưa thích */}
            <Button
              as={Link}
              to="/ua-thich"
              variant="link"
              className="youtube-favorite text-nowrap"
            >
              <LucideIcon icon="BookmarkCheck" />
              <span className="favorite-count">{favorites.length}</span>
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;