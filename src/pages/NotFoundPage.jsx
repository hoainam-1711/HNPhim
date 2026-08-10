import { Container } from "react-bootstrap";
import noImg from "../assets/no-image.png";

const NotFoundPage = () => {
  return (
    <div>
      <Container className="text-center">
        <img src={noImg} alt="no-image" height="300px" />

        <div className="mt-3 text-white-50 fs-5 fw-light tracking-wider">
          404 NOT FOUND
        </div>
      </Container>
    </div>
  );
};

export default NotFoundPage;
