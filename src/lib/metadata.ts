import { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}

const baseUrl = 'https://www.aqdecor.com';

export const defaultSEO: SEOConfig = {
  title: 'AQ Decor - Commercial Fit-out & Interior Solutions Dubai',
  description: 'AQ Decor specializes in commercial fit-out, retail interior design, exhibition stands, shop front signage, MEP, and complete turnkey solutions in Dubai. Dream It, We Built It!',
  keywords: 'commercial fitout dubai, retail fitout, shop fitout, exhibition stand dubai, MEP contractor dubai, interior fit-out, office fitout dubai, retail interior design',
  ogImage: `${baseUrl}/og-image.jpg`,
  canonical: baseUrl
};

export const seoPages = {
  home: {
    title: 'AQ Decor - Commercial Fit-out & Interior Solutions Dubai',
    description: 'Leading commercial fit-out contractor in Dubai. Specializing in retail, office, exhibition stands, shop fronts, MEP, and complete interior solutions. Dream It, We Built It!',
    keywords: 'commercial fitout dubai, retail fitout, office fitout, exhibition stand contractor, shop front dubai, MEP contractor, interior contractor dubai',
    ogImage: `${baseUrl}/og-images/home.jpg`,
    canonical: baseUrl
  },
  about: {
    title: 'About AQ Decor - Commercial Fit-out Specialists Dubai',
    description: 'Learn about AQ Decor (AL QETHAA AL QADEEMA) - Dubai\'s trusted commercial fit-out and interior contracting specialists. Expert in retail, office, and exhibition projects.',
    keywords: 'about aq decor, commercial fitout company dubai, interior contractor dubai, fit-out specialist',
    ogImage: `${baseUrl}/og-images/about.jpg`,
    canonical: `${baseUrl}/company`
  },
  projects: {
    title: 'Our Projects - Commercial Fit-out Portfolio | AQ Decor Dubai',
    description: 'Explore AQ Decor\'s portfolio of completed commercial fit-out projects including retail stores, offices, exhibition stands, and shop fronts across Dubai.',
    keywords: 'commercial fitout portfolio dubai, retail fitout projects, office fitout projects, exhibition stand projects',
    ogImage: `${baseUrl}/og-images/projects.jpg`,
    canonical: `${baseUrl}/projects`
  },
  blog: {
    title: 'Blog - Commercial Fit-out Tips & Industry Insights | AQ Decor',
    description: 'Latest commercial fit-out trends, retail design tips, MEP insights, and industry updates from AQ Decor\'s experts in Dubai.',
    keywords: 'commercial fitout blog, retail design tips dubai, MEP insights, fitout trends',
    ogImage: `${baseUrl}/og-images/blog.jpg`,
    canonical: `${baseUrl}/blog`
  },
  contact: {
    title: 'Contact Us - Commercial Fit-out Contractors Dubai | AQ Decor',
    description: 'Contact AQ Decor for commercial fit-out, retail interior design, exhibition stands, and MEP solutions in Dubai. Get a free consultation today!',
    keywords: 'contact aq decor, commercial fitout quote dubai, retail fitout contractor, exhibition stand supplier dubai',
    ogImage: `${baseUrl}/og-images/contact.jpg`,
    canonical: `${baseUrl}/contact`
  }
};


export function generatePageMetadata(page: keyof typeof seoPages): Metadata {
  const pageData = seoPages[page];
  
  return {
    title: pageData.title,
    description: pageData.description,
  
    keywords: pageData.keywords,
    openGraph: {
      title: pageData.title,
      description: pageData.description,
      url: pageData.canonical,
      siteName: 'AQ Decor',
      images: [
        {
          url: pageData.ogImage || `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: 'AQ Decor - Commercial Fit-out Solutions Dubai',
        },
      ],
      locale: 'en_AE',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageData.title,
      description: pageData.description,
      images: [pageData.ogImage || `${baseUrl}/og-image.jpg`],
      creator: '@aqdecor', 
    },
    alternates: {
      canonical: pageData.canonical,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'AQ Decor',
  alternateName: 'AL QETHAA AL QADEEMA',
  url: baseUrl,
  logo: `${baseUrl}/images/logo/aq-logo.png`,
  description: 'Commercial Fit-out, Interior Design & Exhibition Solutions in Dubai',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Dubai',
    addressCountry: 'AE',
  },
  sameAs: [
    'https://www.facebook.com/aqdecor',
    'https://www.instagram.com/aqdecor',
    'https://www.linkedin.com/company/aqdecor',
  ],
};

// Enhanced Local Business Schema
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'AQ Decor',
  alternateName: 'AL QETHAA AL QADEEMA',
  image: `${baseUrl}/images/logo/aq-logo.png`,
  description: 'Commercial Fit-out, Interior Design & Exhibition Solutions in Dubai',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Your Street Address', 
    addressLocality: 'Dubai',
    addressCountry: 'AE',
    postalCode: 'Your Postal Code', 
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '25.2048',
    longitude: '55.2708',
  },
  url: baseUrl,
  telephone: '+971-XX-XXX-XXXX', 
  email: 'info@aqdecor.com',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '09:00',
      closes: '14:00',
    },
  ],
  priceRange: '$$',
  sameAs: [
    'https://www.facebook.com/aqdecor',
    'https://www.instagram.com/aqdecor',
    'https://www.linkedin.com/company/aqdecor',
  ],
};

// Service Schema for SEO
export const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Commercial Fit-out',
  provider: {
    '@type': 'Organization',
    name: 'AQ Decor',
    alternateName: 'AL QETHAA AL QADEEMA',
  },
  areaServed: {
    '@type': 'City',
    name: 'Dubai',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Commercial Fit-out Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Retail Fit-out',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Office Fit-out',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Exhibition Stands',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Shop Front Signage',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'MEP Services',
        },
      },
    ],
  },
};
export const generateBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const generateFAQSchema = (faqs: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});