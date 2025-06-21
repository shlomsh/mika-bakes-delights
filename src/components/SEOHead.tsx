
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "ספר המתכונים של מיקה",
  description = "האפליקציה הביתית של מיקה לכל מתכוני קינוחים, מאפים ובישולים!",
  image = "/lovable-uploads/ba509ec5-29e1-4ea7-9d37-63b4c65f5cef.png",
  url,
  type = "website"
}) => {
  // Ensure we have a full URL for the image
  const getFullImageUrl = (imageUrl: string) => {
    if (!imageUrl) return `${window.location.origin}/lovable-uploads/ba509ec5-29e1-4ea7-9d37-63b4c65f5cef.png`;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${window.location.origin}${imageUrl}`;
  };

  const fullImageUrl = getFullImageUrl(image);
  const fullUrl = url ? `${window.location.origin}${url}` : window.location.href;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="he_IL" />
      <meta property="og:site_name" content="ספר המתכונים של מיקה" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      
      {/* Additional meta tags for better SEO */}
      <meta name="author" content="מיקה" />
      <link rel="canonical" href={fullUrl} />
    </Helmet>
  );
};

export default SEOHead;
