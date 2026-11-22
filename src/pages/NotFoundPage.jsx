import { useRef } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import SEO from "@/core/components/ui/SEO";
import { usePongGame, CANVAS_SIZE } from "./usePongGame";

const styles = {
  body: {
    margin: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    width: "min(50vh, 50%)",
  },
  canvas: {
    display: "block",
    borderRadius: "4px",
    overflow: "hidden",
    width: "88%",
    marginTop: "auto",
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.2)",
  },
  score: {
    marginTop: "10px",
    fontSize: "15px",
  },
  msg: {
    textAlign: "center",
    lineHeight: 1.5,
    marginTop: "20px",
  },
};

export const NotFoundPage = () => {
  const canvasRef = useRef(null);
  const score = usePongGame(canvasRef);

  return (
    <>
      <SEO
        title="Không tìm thấy trang"
        description="Không tìm thấy trang, đường dẫn sai hoặc lỗi."
      />

      <div style={styles.body}>
        <div style={styles.container}>
          <p style={styles.msg}>404 NOT FOUND</p>
          <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            style={styles.canvas}
          />
          <div style={styles.score}>
            day {score.day} | night {score.night}
          </div>
          <p style={styles.msg}>
            Trang bạn đang tìm kiếm không tồn tại. Vui lòng kiểm tra đường dẫn
            hoặc quay về trang chủ
          </p>
          <Button
            variant="link"
            style={{ textDecoration: "none" }}
            as={Link}
            to={"/"}
          >
            Về trang chủ
          </Button>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
