import { Project } from '../types';

export const projects: Project[] = [
  {
    id: 'oakberry',
    title: 'Oakberry Acai Bowls',
    category: 'Food & Beverage',
    description: 'Modern healthy food outlet with vibrant tropical design featuring custom counters and digital menu displays.',
    images: [
      '/images/projects/oakberry/oakberry-1.jpg',
      '/images/projects/oakberry/oakberry-2.jpg',
      '/images/projects/oakberry/oakberry-3.jpg',
    ],
    location: 'Dubai',
    year: '2023'
  },
  {
    id: 'giordano',
    title: 'Giordano Fashion Store',
    category: 'Retail Fashion',
    description: 'Contemporary fashion retail space with modern display systems and customer-friendly layout design.',
    images: [
      '/images/projects/giordano/giordano-1.jpg',
      '/images/projects/giordano/giordano-2.jpg',
    ],
    location: 'Dubai',
    year: '2023'
  },
  {
    id: 'hip-pop',
    title: 'Hip Pop Ice Cream',
    category: 'Food & Beverage',
    description: 'Colorful and playful ice cream parlor with custom 3D installations and eye-catching exterior design.',
    images: [
      '/images/projects/hip-pop/hip-pop-exterior.jpg',
      '/images/projects/hip-pop/hip-pop-interior.jpg',
    ],
    location: 'JBR Dubai',
    year: '2022'
  },
  {
    id: 'telionix',
    title: 'Telionix Electronics Store',
    category: 'Electronics Retail',
    description: 'Clean and modern electronics retail space with efficient product display solutions.',
    images: [
      '/images/projects/telionix/telionix-store.jpg',
      '/images/projects/telionix/telionix-interior.jpg',
    ],
    location: 'Dubai',
    year: '2022'
  },
  {
    id: 'al-falah-typing',
    title: 'Al Falah Typing Center',
    category: 'Service Center',
    description: 'Professional typing center with efficient counter design and customer service area.',
    images: [
      '/images/projects/typing-center/al-falah-typing.jpg',
    ],
    location: 'Al Quoz Mall',
    year: '2021'
  },
  {
    id: 'lovey-dovey',
    title: 'Lovey Dovey Fashion',
    category: 'Fashion Retail',
    description: 'Trendy fashion boutique with modern display systems and attractive storefront design.',
    images: [
      '/images/projects/lovey-dovey/lovey-dovey-store.jpg',
    ],
    location: 'UAE',
    year: '2021'
  },
  {
    id: 'wooden-counters',
    title: 'Custom Wooden Counters',
    category: 'Custom Fixtures',
    description: 'Bespoke wooden counter solutions for various retail and commercial applications.',
    images: [
      '/images/projects/counters/wooden-counter-1.jpg',
      '/images/projects/counters/display-counter-1.jpg',
      '/images/projects/counters/retail-fixtures.jpg',
    ],
    year: '2020-2023'
  },
  {
    id: 'car-exhibitions',
    title: 'Automotive Exhibition Stands',
    category: 'Exhibition',
    description: 'Premium car display solutions with custom lighting and interactive elements.',
    images: [
      '/images/projects/exhibitions/car-display-1.jpg',
      '/images/projects/exhibitions/car-display-2.jpg',
      '/images/projects/exhibitions/outdoor-seating.jpg',
    ],
    location: 'Dubai',
    year: '2020-2023'
  },
];

export const projectCategories = [
  'All',
  'Food & Beverage',
  'Retail Fashion',
  'Electronics Retail',
  'Exhibition',
  'Custom Fixtures',
  'Service Center'
];