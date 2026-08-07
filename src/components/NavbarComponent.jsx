import { Link, useNavigate } from "react-router-dom";
import viteLogo from "/vite.svg";
import {
  Navbar,
  Nav,
  Form,
  Button,
  InputGroup,
  Container,
} from "react-bootstrap";
import { MovieContext } from "../context/MovieContext";
import LucideIcon from "./LucideIcon";
import { useContext, useState } from "react";

function NavbarComponent() {
  const { favorites } = useContext(MovieContext);
  const [keyword, setKeyword] = useState("");

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
    <Navbar
      variant="dark"
      expand="lg"
      sticky="top"
      //className="py-3"
      style={{
        // Chuyển từ xám nhạt (top) -> xám đậm -> đen tuyền hòa vào HomePage
        background:
          "linear-gradient(180deg, #2b2b2b 0%, #1a1a1a 60%, #0f0f0f 100%)",
        backdropFilter: "blur(8px)", // Giúp hiệu ứng làm mờ mịn hơn khi cuộn trang
      }}
    >
      <Container>
        {/* Logo */}
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center gap-2 fw-bold text-white fs-3"
        >
          <img src={viteLogo} alt="HNPhim" width="30" height="30" />
          <span>HNPHIM</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>Thể Loại</Nav>

          <Form
            onSubmit={handleSearch}
            className="d-flex ms-auto my-2 my-lg-0 me-3"
          >
            <InputGroup className="overflow-hidden rounded-pill border border-secondary border-opacity-50">
              {/* Ô nhập liệu */}
              <Form.Control
                type="text"
                className="bg-transparent text-white border-0 shadow-none ps-3"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "#fff",
                }}
                onChange={(e) => setKeyword(e.target.value)}
              />

              {/* Nút tìm kiếm chứa Icon kính lúp (SVG) */}
              <Button
                variant="dark"
                className="border-0 bg-transparent text-white-50 px-3 d-flex align-items-center"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                type="submit"
              >
                <LucideIcon icon="Search" />
              </Button>
            </InputGroup>
          </Form>
          <Button
            as={Link}
            to={"/ua-thich"}
            variant="link"
            className="p-0 text-white border-0 shadow-none text-decoration-none"
          >
            <LucideIcon icon="BookmarkCheck" />({favorites.length})
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
