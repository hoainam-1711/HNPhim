import { Button, Card, Col, Row } from "react-bootstrap";
import EpisodeSelector from "../../../player/components/EpisodeSelector";

/**
 * Hiển thị cụm Server tabs và danh sách tập phim cho trang Chi tiết
 */
const MovieServerEpisodes = ({
  episodesList = [],
  selectedServer = 0,
  onSelectServer,
  serverData = [],
  onWatchEpisode,
}) => {
  if (!episodesList || episodesList.length === 0) return null;

  return (
    <Row className="mt-4">
      <Col xs={12}>
        <Card className="episode-card text-white">
          <Card.Header className="episode-header d-flex align-items-center justify-content-between flex-wrap gap-2">
            <h5 className="episode-title">Danh sách tập / Server</h5>

            {episodesList.length > 1 && (
              <div className="server-buttons">
                {episodesList.map((server, idx) => (
                  <Button
                    key={idx}
                    size="sm"
                    variant={
                      selectedServer === idx ? "danger" : "outline-secondary"
                    }
                    className={`server-btn ${
                      selectedServer === idx ? "active" : ""
                    }`}
                    onClick={() => onSelectServer(idx)}
                  >
                    {server.server_name || `Server ${idx + 1}`}
                  </Button>
                ))}
              </div>
            )}
          </Card.Header>
          <Card.Body>
            <EpisodeSelector
              pageType="detail"
              serverData={serverData}
              handleWatchMovie={onWatchEpisode}
            />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default MovieServerEpisodes;
