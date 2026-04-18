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
  title: 'AQ Decor - Commercial Fit-out & Interior Solutions UAE',
  description: 'AQ Decor (Al Qethaa Al Qadeema) specializes in commercial fit-out, interior design, shop fittings, and MEP services across Sharjah and Dubai, UAE. Dream It, We Build It!',
  keywords: 'commercial fitout UAE, fitout contractor Sharjah, retail fitout Dubai, interior design UAE, shop fittings UAE, MEP contractor UAE, fitout company near me, best fitout contractor UAE',
  ogImage: `${baseUrl}/og-image.jpg`,
  canonical: baseUrl
};

export const seoPages = {
  home: {
    title: 'AQ Decor - #1 Commercial Fit-out Contractor | Sharjah & Dubai UAE',
    description: 'AQ Decor is a leading commercial fit-out contractor in Sharjah & Dubai since 2014. Specializing in retail fit-out, office interiors, exhibition stands, shop fronts and MEP services across UAE. Get a free quote today!',
    keywords: [
      // Core service keywords
      'commercial fitout sharjah',
      'fitout contractor dubai',
      'fitout contractor UAE',
      'commercial fitout company UAE',
      'interior fit out contractor sharjah',
      // Retail & office
      'retail fitout dubai',
      'office fitout sharjah',
      'shop fitout UAE',
      'restaurant fitout dubai',
      // Local intent
      'fitout company near me sharjah',
      'fitout contractor near me dubai',
      'best fitout company UAE',
      // Brand
      'AQ Decor',
      'Al Qethaa Al Qadeema',
      // Services
      'MEP services UAE',
      'exhibition stand contractor UAE',
      'turnkey fitout UAE',
      'interior design company sharjah',
      // Long tail
      'commercial interior design dubai',
      'shop front design UAE',
      'office renovation sharjah',
      'retail store design dubai',
    ].join(', '),
    ogImage: `${baseUrl}/og-images/home.jpg`,
    canonical: baseUrl
  },

  about: {
    title: 'About AQ Decor - Trusted Fit-out Specialists Since 2014 | Sharjah Dubai UAE',
    description: 'AQ Decor (Al Qethaa Al Qadeema L.L.C.) — UAE\'s trusted commercial fit-out and interior contracting specialists since 2014. Own factory in Sharjah. 10+ years experience in retail, office, healthcare and hospitality fit-out projects.',
    keywords: [
      'about AQ Decor',
      'Al Qethaa Al Qadeema',
      'fitout company sharjah',
      'commercial fitout company dubai',
      'interior contractor UAE',
      'fit-out specialist sharjah',
      'fitout company with factory UAE',
      'experienced fitout contractor UAE',
      'fitout company since 2014',
      'reliable fitout contractor sharjah',
      'fitout company history UAE',
      'top fitout companies UAE',
    ].join(', '),
    ogImage: `${baseUrl}/og-images/about.jpg`,
    canonical: `${baseUrl}/company`
  },

  services: {
    title: 'Fit-out & Interior Services - Retail, Office, MEP, Exhibition | AQ Decor Dubai',
    description: 'AQ Decor offers complete commercial fit-out services: retail fit-out, office fit-out, exhibition stands, shop front signage, MEP services, flooring, partitions, kiosks and turnkey interior solutions across Sharjah & Dubai UAE.',
    keywords: [
      // Retail
      'retail fitout dubai',
      'retail shop fitout sharjah',
      'shop fitting contractor UAE',
      // Office
      'office fitout dubai',
      'office interior design sharjah',
      'office renovation UAE',
      // Exhibition
      'exhibition stand contractor UAE',
      'exhibition stand builder dubai',
      'exhibition stand design UAE',
      // MEP
      'MEP contractor sharjah',
      'MEP services dubai',
      'mechanical electrical plumbing UAE',
      // Signage & fronts
      'shop front signage dubai',
      'shop front glass UAE',
      'signage contractor sharjah',
      // Fitout types
      'turnkey fitout UAE',
      'complete fitout contractor dubai',
      'interior fit out services UAE',
      // Specific
      'false ceiling contractor dubai',
      'partition contractor sharjah',
      'flooring contractor UAE',
      'kiosk manufacturer UAE',
      'reception counter UAE',
      'acrylic products UAE',
    ].join(', '),
    ogImage: `${baseUrl}/og-images/services.jpg`,
    canonical: `${baseUrl}/services`
  },

  projects: {
    title: 'Fit-out Projects Portfolio - Retail, Office & Exhibition | AQ Decor Dubai',
    description: 'Explore AQ Decor\'s portfolio of 500+ completed commercial fit-out projects — retail stores, offices, restaurants, exhibition stands, healthcare clinics and hospitality spaces across Sharjah, Dubai and UAE.',
    keywords: [
      'fitout projects dubai',
      'commercial fitout portfolio UAE',
      'retail fitout projects sharjah',
      'office fitout portfolio dubai',
      'exhibition stand projects UAE',
      'completed fitout projects UAE',
      'interior design portfolio dubai',
      'restaurant fitout projects UAE',
      'healthcare fitout projects dubai',
      'hospitality fitout UAE',
      'shop design projects sharjah',
      'fitout work samples UAE',
    ].join(', '),
    ogImage: `${baseUrl}/og-images/projects.jpg`,
    canonical: `${baseUrl}/projects`
  },

  blog: {
    title: 'Fit-out Tips & Interior Design Insights Blog | AQ Decor Dubai UAE',
    description: 'Read the latest commercial fit-out trends, retail interior design tips, MEP insights, office design ideas, and industry updates from AQ Decor\'s experts in Sharjah & Dubai UAE.',
    keywords: [
      'commercial fitout blog UAE',
      'interior design tips dubai',
      'retail design ideas UAE',
      'office fitout tips sharjah',
      'MEP insights UAE',
      'fitout trends dubai',
      'shop design tips UAE',
      'fitout cost guide UAE',
      'interior design blog dubai',
      'fitout contractor advice UAE',
    ].join(', '),
    ogImage: `${baseUrl}/og-images/blog.jpg`,
    canonical: `${baseUrl}/blog`
  },

  contact: {
    title: 'Contact AQ Decor - Free Fit-out Consultation | Sharjah Dubai UAE',
    description: 'Contact AQ Decor for commercial fit-out, retail interior design, exhibition stands and MEP solutions in Sharjah & Dubai. Call +971 56 100 1190 or email sales@aqdecor.com. Free consultation available!',
    keywords: [
      'contact AQ Decor',
      'fitout quote dubai',
      'fitout consultation sharjah',
      'commercial fitout quote UAE',
      'retail fitout contractor contact',
      'exhibition stand supplier dubai',
      'fitout company contact UAE',
      'free fitout consultation UAE',
      'fitout estimate dubai',
      'interior design consultation sharjah',
    ].join(', '),
    ogImage: `${baseUrl}/og-images/contact.jpg`,
    canonical: `${baseUrl}/contact`
  },
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
          alt: 'AQ Decor - Commercial Fit-out Solutions Dubai UAE',
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

// ─── Schema Markup ────────────────────────────────────────────────────────────

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'AQ Decor',
  alternateName: 'AL QETHAA AL QADEEMA',
  url: baseUrl,
  logo: `${baseUrl}/images/logo/aq-logo.png`,
  description: 'Commercial Fit-out, Interior Design & Exhibition Solutions in Sharjah & Dubai UAE since 2014',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Sharjah',
    addressCountry: 'AE',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+971561001190',
    contactType: 'sales',
    email: 'sales@aqdecor.com',
    availableLanguage: ['English', 'Arabic'],
  },
  sameAs: [
    'https://www.facebook.com/aqdecor',
    'https://www.instagram.com/aqdecor',
    'https://www.linkedin.com/company/aqdecor',
  ],
};

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'AQ Decor',
  alternateName: 'Al Qethaa Al Qadeema L.L.C.',
  image: `${baseUrl}/images/logo/aq-logo.png`,
  description: 'Commercial Fit-out, Interior Design & Exhibition Solutions in Sharjah & Dubai UAE since 2014',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Sharjah',
    addressRegion: 'Sharjah',
    addressCountry: 'AE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '25.3573',
    longitude: '55.4033',
  },
  url: baseUrl,
  telephone: '+971561001190',
  email: 'sales@aqdecor.com',
  foundingDate: '2014',
  numberOfEmployees: {
    '@type': 'QuantitativeValue',
    minValue: 50,
  },
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
  areaServed: [
    { '@type': 'City', name: 'Sharjah' },
    { '@type': 'City', name: 'Dubai' },
    { '@type': 'Country', name: 'United Arab Emirates' },
  ],
  sameAs: [
    'https://www.facebook.com/aqdecor',
    'https://www.instagram.com/aqdecor',
    'https://www.linkedin.com/company/aqdecor',
  ],
};

export const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Commercial Fit-out',
  provider: {
    '@type': 'Organization',
    name: 'AQ Decor',
    alternateName: 'AL QETHAA AL QADEEMA',
  },
  areaServed: [
    { '@type': 'City', name: 'Sharjah' },
    { '@type': 'City', name: 'Dubai' },
    { '@type': 'Country', name: 'United Arab Emirates' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Commercial Fit-out Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Retail Fit-out' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Office Fit-out' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Exhibition Stands' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Shop Front Signage' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'MEP Services' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Flooring & Ceiling' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Partition & Painting' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Kiosks & Reception Counters' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Acrylic Products' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Turnkey Interior Solutions' } },
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

// ─── Dynamic Blog/Project Metadata Generators ─────────────────────────────────

export function generateBlogMetadata(blog: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  publishedAt?: string;
}): Metadata {
  return {
    title: `${blog.title} | AQ Decor Blog`,
    description: blog.description,
    openGraph: {
      title: blog.title,
      description: blog.description,
      url: `${baseUrl}/blog/${blog.slug}`,
      type: 'article',
      publishedTime: blog.publishedAt,
      images: blog.image ? [{ url: blog.image, width: 1200, height: 630 }] : [],
    },
    alternates: { canonical: `${baseUrl}/blog/${blog.slug}` },
  };
}

export function generateProjectMetadata(project: {
  title: string;
  description: string;
  id: string;
  image?: string;
}): Metadata {
  return {
    title: `${project.title} | AQ Decor Projects`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      url: `${baseUrl}/projects/${project.id}`,
      type: 'website',
      images: project.image ? [{ url: project.image, width: 1200, height: 630 }] : [],
    },
    alternates: { canonical: `${baseUrl}/projects/${project.id}` },
  };
}