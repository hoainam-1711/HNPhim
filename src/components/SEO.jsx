import { Helmet } from "react-helmet-async";

const SITE_NAME = "HNPhim";
const SITE_URL = "https://hnphim.vercel.app";

const SEO = ({
  title,
  description,
  image,
  url,
  type = "website",
  robots = "index, follow",
}) => {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} - Xem Phim Online`;

  const canonicalUrl = url
    ? `${SITE_URL}${url}`
    : SITE_URL;

  return (
    <Helmet>
      <title>{fullTitle}</title>

      <meta
        name="description"
        content={description}
      />

      <link
        rel="canonical"
        href={canonicalUrl}
      />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta
        property="og:description"
        content={description}
      />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />

      {image && (
        <meta property="og:image" content={image} />
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta
        name="twitter:description"
        content={description}
      />

      {image && (
        <meta name="twitter:image" content={image} />
      )}
      <meta name="robots" content={robots} />
    </Helmet>
  );
};

export default SEO;