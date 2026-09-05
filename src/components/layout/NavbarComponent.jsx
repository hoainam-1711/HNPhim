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

  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/tim-kiem/${encodeURIComponent(keyword.trim())}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Navbar variant="dark" expand="sm" sticky="top" className="youtube-navbar">
      <Container fluid className="px-2 px-sm-3 px-lg-4">
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
          className="border-0 shadow-none p-1"
        />

        <Navbar.Collapse id="basic-navbar-nav">
          {/* Bọc cả 3 phần tử vào 1 container flex ngang */}
          <div className="navbar-row-content d-flex align-items-center justify-content-center gap-2 w-100 mt-2 mt-lg-0">
            {/* Thể loại */}
            <Button
              variant="link"
              onClick={handleShow}
              className="youtube-nav-btn text-nowrap"
            >
              Thể loại
            </Button>

            <GenreModal show={showModal} handleClose={handleClose} />

            {/* Ô tìm kiếm */}
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

            {/* Danh sách yêu thích */}
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