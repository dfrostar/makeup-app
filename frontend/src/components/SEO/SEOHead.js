import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author,
  published,
  modified,
  schema
}) => {
  const siteTitle = 'MakeupHub';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const defaultDescription = 'Discover your perfect makeup look with MakeupHub\'s virtual try-on technology and expert tutorials.';
  const defaultImage = 'https://makeupdir.com/images/default-og.jpg';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image || defaultImage} />

      {/* Article Specific Meta Tags */}
      {type === 'article' && author && (
        <>
          <meta property="article:author" content={author} />
          {published && <meta property="article:published_time" content={published} />}
          {modified && <meta property="article:modified_time" content={modified} />}
        </>
      )}

      {/* Structured Data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
