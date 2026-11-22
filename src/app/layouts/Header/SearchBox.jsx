import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, InputGroup } from "react-bootstrap";
import { Search } from "lucide-react";

/**
 * SearchBox
 * Ô tìm kiếm độc lập: Tách biệt state `keyword` để tránh re-render toàn bộ Header/Navbar
 */
export const SearchBox = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword) {
      navigate(`/tim-kiem/${encodeURIComponent(trimmedKeyword)}`);
    }
  };

  return (
    <Form
      onSubmit={handleSearch}
      className="search-form flex-grow-1 my-0 ms-auto me-1"
    >
      <InputGroup className="search">
        <Form.Control
          type="text"
          placeholder="Tìm kiếm"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="search-input"
        />
        <Button type="submit" className="search-btn">
          <Search />
        </Button>
      </InputGroup>
    </Form>
  );
};

export default SearchBox;
