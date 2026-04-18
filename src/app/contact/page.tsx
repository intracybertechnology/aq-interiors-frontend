import { generatePageMetadata, generateBreadcrumbSchema } from '@/lib/metadata';
import Contact from '@/components/sections/Contact';

export const metadata = generatePageMetadata('contact');

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', url: 'https://www.aqdecor.com' },
  { name: 'Contact', url: 'https://www.aqdecor.com/contact' },
]);

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="pt-24">
        <Contact />
      </div>
    </>
  );
}