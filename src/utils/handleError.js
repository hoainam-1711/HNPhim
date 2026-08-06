const handleError = (message, error) => {
  console.error(message, error);

  // Có thể xử lý thêm tại đây
  // Ví dụ:
  // toast.error(message);
  // gửi log lên server

  throw error;
};

export default handleError;