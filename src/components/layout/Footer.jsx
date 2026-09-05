import { Container, Row, Col } from "react-bootstrap";
import LucideIcon from "../ui/LucideIcon";

const Footer = () => {
  return (
    <footer className="text-white-50 pb-4">
      <hr />
      <Container>
        <Row className="align-items-center">
          <Col className="text-center">
            <LucideIcon icon="Logo" />
            <div style={{ fontSize: "0.75rem", marginTop: "10px" }}>
              © {new Date().getFullYear()} HNPhim.
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
