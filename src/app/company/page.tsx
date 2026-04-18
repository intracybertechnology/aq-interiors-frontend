import { generatePageMetadata, generateBreadcrumbSchema } from '@/lib/metadata';
import About from '@/components/sections/AboutUs';

export const metadata = generatePageMetadata('about');

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', url: 'https://www.aqdecor.com' },
  { name: 'Company', url: 'https://www.aqdecor.com/company' },
]);

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="pt-24">
        <About />
      </div>
    </>
  );
}