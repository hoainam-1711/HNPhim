import axios from "axios";

const api = axios.create({
  baseURL: "https://phimapi.com",
  timeout: 10000,
});

// Trả về response.data luôn
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;