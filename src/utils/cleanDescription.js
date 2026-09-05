const cleanDescription = (html = "") => {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
};

export default cleanDescription;