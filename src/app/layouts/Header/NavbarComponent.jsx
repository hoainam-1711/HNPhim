import "./NavbarComponent.css";
import { Link } from "react-router-dom";
import { Navbar, Button, Container } from "react-bootstrap";
import { FavoriteCounter } from "@/features/favorites";
import Icon from "@/core/components/icons";
import SearchBox from "./SearchBox";

/**
 * NavbarComponent
 * Tầng Layout Header: Nhận FilterModal qua composition (children), không phụ thuộc trực tiếp vào feature movies
 */
export const NavbarComponent = ({ onOpenFilter, children }) => {
  return (
    <Navbar variant="dark" expand="sm" sticky="top" className="navbar-general">
      <Container fluid>
        {/* Logo HNPHIM */}
        <Navbar.Brand
          as={Link}
          to="/"
          className="logo d-flex align-items-center"
        >
          <Icon icon="Logo" fill="#fe0033" />
          <span>HNPhim</span>
        </Navbar.Brand>

        {/* Nút Hamburger menu toggle trên Mobile */}
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="border-0 shadow-none p-1"
        />

        {/* Khối menu mở rộng */}
        <Navbar.Collapse id="basic-navbar-nav">
          <div className="navbar-row-content d-flex align-items-center justify-content-center gap-2 w-100">
            {/* 1. Nút mở Modal Thể loại */}
            <Button
              variant="link"
              onClick={onOpenFilter}
              className="nav-btn text-nowrap"
            >
              Khám Phá
            </Button>

            {/* FilterModal được truyền qua composition */}
            {children}

            {/* 2. Ô tìm kiếm từ khóa tách biệt state */}
            <SearchBox />

            {/* 3. Nút dẫn đến danh sách phim ưa thích */}
            <FavoriteCounter />
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
