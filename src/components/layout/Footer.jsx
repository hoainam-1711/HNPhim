import { Container, Row, Col } from "react-bootstrap";
import noImg from '../../assets/no-image.png';


const Footer = () => {
  return (
    <footer
      className="text-white-50 py-4"
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
            <img src={noImg} alt="Logo" height={50} style={{borderRadius:"50%", marginBottom:"10px"}}/>
            <div style={{ fontSize: "0.75rem" }}>
              © {new Date().getFullYear()} HNPhim.
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
