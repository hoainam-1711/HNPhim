import { Container, Row, Col, Popover, OverlayTrigger } from "react-bootstrap";
import LucideIcon from "@/core/components/icons";

const Footer = () => {
  const disclaimerPopover = (
    <Popover
      id="disclaimer-popover"
      style={{
        backgroundColor: "#181818",
        border: "1px solid #303030",
        maxWidth: "340px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.75)",
      }}
    >
      <Popover.Header
        as="h6"
        className="fw-bold text-white border-secondary border-opacity-25"
        style={{ backgroundColor: "#202020", fontSize: "0.8rem" }}
      >
        Disclaimer
      </Popover.Header>
      <Popover.Body
        className="text-white-50"
        style={{ fontSize: "0.72rem", lineHeight: "1.5" }}
      >
        <ul className="ps-3 mb-0">
          <li className="mb-1">
            This project was created for educational purposes and internal
            family entertainment use only.
          </li>
          <li className="mb-1">
            All movie data, images, and video stream links are fetched from
            publicly available APIs on the internet. This application does not
            host or assume legal ownership of any third-party media content.
          </li>
        </ul>
      </Popover.Body>
    </Popover>
  );

  return (
    <footer className="text-white-50 pb-4">
      <hr />
      <Container fluid>
        <Row className="align-items-center">
          <Col className="text-center">
            <LucideIcon icon="Logo" fill="#ffffff80" />
            <div style={{ fontSize: "0.75rem", marginTop: "10px" }}>
              © {new Date().getFullYear()} HNPhim{" "}
              <span className="text-white-50">|</span>{" "}
              <a
                href="https://github.com/hoainam-1711/HNPhim"
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none d-inline-flex align-items-center gap-1"
              >
                <span> GitHub</span>
              </a>
            </div>
          </Col>
        </Row>
        {/* Góc dưới cùng bên phải: Nút Disclaimer */}
        <Row className="justify-content-end">
          <Col xs="auto" className="text-end">
            <OverlayTrigger
              trigger={["hover", "focus"]}
              placement="top-end"
              overlay={disclaimerPopover}
            >
              <span
                tabIndex={0}
                role="button"
                className="text-white-50 text-decoration-underline"
                style={{
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                Disclaimer
              </span>
            </OverlayTrigger>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
