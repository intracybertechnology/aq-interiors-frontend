import { generatePageMetadata, generateBreadcrumbSchema, generateFAQSchema, serviceSchema } from '@/lib/metadata';
import Services from '@/components/sections/Services';

export const metadata = generatePageMetadata('services');

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', url: 'https://www.aqdecor.com' },
  { name: 'Services', url: 'https://www.aqdecor.com/services' },
]);

const faqSchema = generateFAQSchema([
  {
    question: 'What services does AQ Decor offer?',
    answer: 'AQ Decor offers a full range of commercial fit-out services including interior design, complete fit-out, flooring & ceiling, partition & painting, shop front glass & signage, office furniture, exhibition stands, MEP services, acrylic products, kiosks, and reception counters across UAE.',
  },
  {
    question: 'Where does AQ Decor operate?',
    answer: 'AQ Decor (Al Qethaa Al Qadeema L.L.C.) is based in Sharjah with an in-house factory, and serves clients across Sharjah, Dubai, and the wider UAE.',
  },
  {
    question: 'Does AQ Decor have its own factory?',
    answer: 'Yes, AQ Decor has a fully equipped in-house factory in Sharjah. This gives us complete control over quality, timelines, and costs — eliminating middlemen and ensuring faster project delivery.',
  },
  {
    question: 'How long has AQ Decor been in business?',
    answer: 'AQ Decor has been providing quality fit-out and interior solutions since 2014, with over 10 years of experience in commercial, retail, office, healthcare, and hospitality projects.',
  },
  {
    question: 'Can AQ Decor handle both design and construction?',
    answer: 'Yes, AQ Decor provides a complete turnkey solution covering the full Design, Develop, and Deploy process — from initial interior design concepts and MEP planning through to construction, fit-out execution, and final finishing.',
  },
  {
    question: 'How do I get a quote from AQ Decor?',
    answer: 'You can contact AQ Decor directly by calling +971 56 100 1190, emailing sales@aqdecor.com, or filling out the contact form on our website at aqdecor.com/contact. Our consultants will respond within 24 hours.',
  },
]);

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="pt-24">
        <Services />
      </div>
    </>
  );
}