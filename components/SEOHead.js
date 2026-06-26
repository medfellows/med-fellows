'use client'

import Head from 'next/head'

export default function SEOHead({ 
  title, 
  description, 
  canonical,
  ogTitle,
  ogDescription,
  ogImage = '/og-image.png',
  keywords = []
}) {
  const fullTitle = title ? `${title} | Med Fellows` : 'Med Fellows - MDCAT Preparation Platform'
  const ogTitleFinal = ogTitle || title || 'Med Fellows - MDCAT Preparation Platform'
  
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={ogTitleFinal} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Med Fellows" />
      <meta property="og:locale" content="en_PK" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonical} />
      <meta property="twitter:title" content={ogTitleFinal} />
      <meta property="twitter:description" content={ogDescription || description} />
      <meta property="twitter:image" content={ogImage} />
    </>
  )
}
