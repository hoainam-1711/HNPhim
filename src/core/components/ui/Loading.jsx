import { Container, Spinner } from "react-bootstrap";

const Loading = () => {
  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 w-100"
      style={{ background: "#0f0f0f" }}
    >
      <Container className="text-center">
        <Spinner
          animation="border"
          variant="danger"
          role="status"
          style={{ width: "3.5rem", height: "3.5rem", borderWidth: "0.3rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <div className="mt-3 text-white-50 fs-5 fw-light tracking-wider">
          Đang tải...
        </div>
      </Container>
    </div>
  );
};

export default Loading;
