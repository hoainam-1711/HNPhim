import axios from "axios";

// Hỗ trợ signal (AbortController) theo chuẩn Axios
const api = axios.create({
  baseURL: "https://phimapi.com",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response Interceptor: Chỉ trả về response.data
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
