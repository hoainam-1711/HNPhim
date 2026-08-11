import { Container, Row, Col } from "react-bootstrap";
import LucideIcon from "../ui/LucideIcon";


const Footer = () => {
  return (
    <footer
      className="text-white-50 pb-4"
      style={{
        // Gradient ngược lại: Màu nền đen HomePage (#0f0f0f) ở đỉnh -> Đậm hơn/Tối hẳn ở đáy
        background: "linear-gradient(180deg, #0f0f0f 0%, #050505 100%)",
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
      }}
    >
      <hr />
      <Container>
        <Row className="align-items-center">
          <Col className="text-center">
            <LucideIcon icon="Logo" />
            <div style={{ fontSize: "0.75rem", marginTop:"10px" }}>
              © {new Date().getFullYear()} HNPhim.
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
