import React from 'react';
import { Helmet } from 'react-helmet-async';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface StructuredDataProps {
  type?: 'Organization' | 'LocalBusiness' | 'Article' | 'Product' | 'Service' | 'Breadcrumb';
  data?: any;
  breadcrumbs?: BreadcrumbItem[];
}

const StructuredData: React.FC<StructuredDataProps> = ({ type = 'Organization', data, breadcrumbs }) => {
  const getStructuredData = () => {
    switch (type) {
      case 'Organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "AQ Decor",
          "alternateName": "AL QETHAA AL QADEEMA",
          "url": "https://www.aqdecor.com",
          "logo": "https://www.aqdecor.com/images/logo/aq-logo.png",
          "description": "Interior Design, Fit-out & Exhibition Solutions in Dubai",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Dubai",
            "addressCountry": "AE"
          },
          "sameAs": [
            "https://www.facebook.com/aqdecor",
            "https://www.instagram.com/aqdecor",
            "https://www.linkedin.com/company/aqdecor"
          ],
          ...data
        };

      case 'LocalBusiness':
        return {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "AQ Decor",
          "image": "https://www.aqdecor.com/images/logo/aq-logo.png",
          "description": "Interior Design, Fit-out & Exhibition Solutions in Dubai",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Dubai",
            "addressCountry": "AE"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "25.2048",
            "longitude": "55.2708"
          },
          "url": "https://www.aqdecor.com",
          "priceRange": "$$",
          ...data
        };

      case 'Article':
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          "publisher": {
            "@type": "Organization",
            "name": "AQ Decor",
            "logo": {
              "@type": "ImageObject",
              "url": "https://www.aqdecor.com/images/logo/aq-logo.png"
            }
          },
          ...data
        };

      case 'Service':
        return {
          "@context": "https://schema.org",
          "@type": "Service",
          "serviceType": "Interior Design & Fit-out",
          "provider": {
            "@type": "Organization",
            "name": "AQ Decor",
            "url": "https://www.aqdecor.com"
          },
          "areaServed": {
            "@type": "City",
            "name": "Dubai"
          },
          ...data
        };

      case 'Breadcrumb':
        if (!breadcrumbs || breadcrumbs.length === 0) return null;
        
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": breadcrumbs.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
          }))
        };

      default:
        return data;
    }
  };

  const structuredData = getStructuredData();

  if (!structuredData) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default StructuredData;