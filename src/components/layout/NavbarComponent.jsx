import "./NavbarComponent.css";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Form, Button, InputGroup, Container } from "react-bootstrap";
import { MovieContext } from "../../context/MovieContext";
import { useContext, useState } from "react";
import LucideIcon from "../ui/LucideIcon";
import GenreModal from "./GenreModal";

function NavbarComponent() {
  const { favorites } = useContext(MovieContext);
  const [keyword, setKeyword] = useState("");

  //Handle Open Modal
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      // Điều hướng tới đường dẫn /tim-kiem/keyword-vừa-nhập
      navigate(`/tim-kiem/${encodeURIComponent(keyword.trim())}`);

      // Tự động cuộn mượt lên đầu trang khi tìm từ khóa khác (UX tốt hơn)
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Navbar variant="dark" expand="lg" sticky="top" className="youtube-navbar">
      <Container fluid className="px-3 px-lg-4">
        {/* Logo */}
        <Navbar.Brand
          as={Link}
          to="/"
          className="youtube-logo d-flex align-items-center gap-2"
        >
          <LucideIcon icon="Logo" />
          <span>HNPHIM</span>
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="border-0 shadow-none"
        />

        <Navbar.Collapse id="basic-navbar-nav">
          {/* Thể loại */}
          <Button
            variant="link"
            onClick={handleShow}
            className="youtube-nav-btn"
          >
            Thể loại
          </Button>

          <GenreModal show={showModal} handleClose={handleClose} />

          {/* Search */}
          <Form
            onSubmit={handleSearch}
            className="youtube-search-form d-flex ms-auto my-2 my-lg-0 me-lg-4"
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

          {/* Favorites */}
          <Button
            as={Link}
            to="/ua-thich"
            variant="link"
            className="youtube-favorite"
          >
            <LucideIcon icon="BookmarkCheck" />
            <span className="favorite-count">{favorites.length}</span>
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
