import { useEffect, useRef, useState } from "react";

const COLOR_PALETTE = {
  dayColor: "#333333",
  nightColor: "#1e1e1e",
};

const DAY_COLOR = COLOR_PALETTE.dayColor;
const DAY_BALL_COLOR = COLOR_PALETTE.nightColor;
const NIGHT_COLOR = COLOR_PALETTE.nightColor;
const NIGHT_BALL_COLOR = COLOR_PALETTE.dayColor;
const SQUARE_SIZE = 25;
const MIN_SPEED = 5;
const MAX_SPEED = 10;
const CANVAS_SIZE = 600;

export default function NotFoundPage() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState({ day: 0, night: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const numSquaresX = CANVAS_SIZE / SQUARE_SIZE;
    const numSquaresY = CANVAS_SIZE / SQUARE_SIZE;

    // Khởi tạo bàn cờ (nửa ngày, nửa đêm)
    const squares = Array.from({ length: numSquaresX }, (_, i) =>
      Array.from({ length: numSquaresY }, () =>
        i < numSquaresX / 2 ? DAY_COLOR : NIGHT_COLOR,
      ),
    );

    // Khởi tạo 2 bóng
    const balls = [
      {
        x: CANVAS_SIZE / 4,
        y: CANVAS_SIZE / 2,
        dx: 8,
        dy: -8,
        reverseColor: DAY_COLOR,
        ballColor: DAY_BALL_COLOR,
      },
      {
        x: (CANVAS_SIZE / 4) * 3,
        y: CANVAS_SIZE / 2,
        dx: -8,
        dy: 8,
        reverseColor: NIGHT_COLOR,
        ballColor: NIGHT_BALL_COLOR,
      },
    ];

    const drawBall = (ball) => {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, SQUARE_SIZE / 2, 0, Math.PI * 2, false);
      ctx.fillStyle = ball.ballColor;
      ctx.fill();
      ctx.closePath();
    };

    const drawSquares = () => {
      let dayScore = 0;
      let nightScore = 0;

      for (let i = 0; i < numSquaresX; i++) {
        for (let j = 0; j < numSquaresY; j++) {
          ctx.fillStyle = squares[i][j];
          ctx.fillRect(
            i * SQUARE_SIZE,
            j * SQUARE_SIZE,
            SQUARE_SIZE,
            SQUARE_SIZE,
          );

          if (squares[i][j] === DAY_COLOR) dayScore++;
          if (squares[i][j] === NIGHT_COLOR) nightScore++;
        }
      }

      setScore({ day: dayScore, night: nightScore });
    };

    const checkSquareCollision = (ball) => {
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
        const checkX = ball.x + Math.cos(angle) * (SQUARE_SIZE / 2);
        const checkY = ball.y + Math.sin(angle) * (SQUARE_SIZE / 2);

        const i = Math.floor(checkX / SQUARE_SIZE);
        const j = Math.floor(checkY / SQUARE_SIZE);

        if (i >= 0 && i < numSquaresX && j >= 0 && j < numSquaresY) {
          if (squares[i][j] !== ball.reverseColor) {
            squares[i][j] = ball.reverseColor;

            if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
              ball.dx = -ball.dx;
            } else {
              ball.dy = -ball.dy;
            }
          }
        }
      }
    };

    const checkBoundaryCollision = (ball) => {
      if (
        ball.x + ball.dx > CANVAS_SIZE - SQUARE_SIZE / 2 ||
        ball.x + ball.dx < SQUARE_SIZE / 2
      ) {
        ball.dx = -ball.dx;
      }
      if (
        ball.y + ball.dy > CANVAS_SIZE - SQUARE_SIZE / 2 ||
        ball.y + ball.dy < SQUARE_SIZE / 2
      ) {
        ball.dy = -ball.dy;
      }
    };

    const addRandomness = (ball) => {
      ball.dx += Math.random() * 0.02 - 0.01;
      ball.dy += Math.random() * 0.02 - 0.01;

      ball.dx = Math.min(Math.max(ball.dx, -MAX_SPEED), MAX_SPEED);
      ball.dy = Math.min(Math.max(ball.dy, -MAX_SPEED), MAX_SPEED);

      if (Math.abs(ball.dx) < MIN_SPEED)
        ball.dx = ball.dx > 0 ? MIN_SPEED : -MIN_SPEED;
      if (Math.abs(ball.dy) < MIN_SPEED)
        ball.dy = ball.dy > 0 ? MIN_SPEED : -MIN_SPEED;
    };

    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      drawSquares();

      balls.forEach((ball) => {
        drawBall(ball);
        checkSquareCollision(ball);
        checkBoundaryCollision(ball);
        ball.x += ball.dx;
        ball.y += ball.dy;
        addRandomness(ball);
      });
    };

    const FRAME_RATE = 100;
    const intervalId = setInterval(draw, 1000 / FRAME_RATE);

    // Dọn dẹp timer khi component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
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
      </div>
    </div>
  );
}

const styles = {
  body: {
    margin: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f0f0f",
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
    width: "100%",
    marginTop: "auto",
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.2)",
  },
  score: {
    fontFamily: "monospace",
    marginTop: "30px",
    fontSize: "16px",
    paddingLeft: "20px",
  },
  msg: {
    textAlign: "center",
    lineHeight: 1.5,
    fontFamily: "monospace",
    marginTop: "30px",  
    marginBottom: "30px",
  }
};
