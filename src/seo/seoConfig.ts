export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
}

export const defaultSEO: SEOConfig = {
  title: 'AQ Decor - Commercial Fit-out & Interior Solutions Dubai',
  description: 'AQ Decor specializes in commercial fit-out, retail interior design, exhibition stands, shop front signage, MEP, and complete turnkey solutions in Dubai. Dream It, We Built It!',
  keywords: 'commercial fitout dubai, retail fitout, shop fitout, exhibition stand dubai, MEP contractor dubai, interior fit-out, office fitout dubai, retail interior design',
  ogImage: 'https://www.aqdecor.com/og-image.jpg',
  ogType: 'website',
  canonical: 'https://www.aqdecor.com/'
};

export const seoPages = {
  home: {
    title: 'AQ Decor - Commercial Fit-out & Interior Solutions Dubai',
    description: 'Leading commercial fit-out contractor in Dubai. Specializing in retail, office, exhibition stands, shop fronts, MEP, and complete interior solutions. Dream It, We Built It!',
    keywords: 'commercial fitout dubai, retail fitout, office fitout, exhibition stand contractor, shop front dubai, MEP contractor, interior contractor dubai',
    canonical: 'https://www.aqdecor.com/'
  },
  about: {
    title: 'About AQ Decor - Commercial Fit-out Specialists Dubai',
    description: 'Learn about AQ Decor (AL QETHAA AL QADEEMA) - Dubai\'s trusted commercial fit-out and interior contracting specialists. Expert in retail, office, and exhibition projects.',
    keywords: 'about aq decor, commercial fitout company dubai, interior contractor dubai, fit-out specialist',
    canonical: 'https://www.aqdecor.com/about'
  },
  services: {
    title: 'Our Services - Commercial Fit-out, MEP, Exhibition Stands | AQ Decor',
    description: 'Complete commercial fit-out solutions: Interior Design, Fit-out, MEP, Flooring, Ceiling, Shop Front Signage, Exhibition Stands, Office Furniture, Reception Counters & more in Dubai.',
    keywords: 'commercial fitout services dubai, MEP contractor, exhibition stand, shop front signage, office furniture dubai, retail fitout, reception counter',
    canonical: 'https://www.aqdecor.com/services'
  },
  projects: {
    title: 'Our Projects - Commercial Fit-out Portfolio | AQ Decor Dubai',
    description: 'Explore AQ Decor\'s portfolio of completed commercial fit-out projects including retail stores, offices, exhibition stands, and shop fronts across Dubai.',
    keywords: 'commercial fitout portfolio dubai, retail fitout projects, office fitout projects, exhibition stand projects',
    canonical: 'https://www.aqdecor.com/projects'
  },
  blog: {
    title: 'Blog - Commercial Fit-out Tips & Industry Insights | AQ Decor',
    description: 'Latest commercial fit-out trends, retail design tips, MEP insights, and industry updates from AQ Decor\'s experts in Dubai.',
    keywords: 'commercial fitout blog, retail design tips dubai, MEP insights, fitout trends',
    canonical: 'https://www.aqdecor.com/blogs'
  },
  contact: {
    title: 'Contact Us - Commercial Fit-out Contractors Dubai | AQ Decor',
    description: 'Contact AQ Decor for commercial fit-out, retail interior design, exhibition stands, and MEP solutions in Dubai. Get a free consultation today!',
    keywords: 'contact aq decor, commercial fitout quote dubai, retail fitout contractor, exhibition stand supplier dubai',
    canonical: 'https://www.aqdecor.com/contact'
  }
};

export const getPageSEO = (page: keyof typeof seoPages): SEOConfig => {
  return {
    ...defaultSEO,
    ...seoPages[page]
  };
};