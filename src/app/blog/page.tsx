import { generatePageMetadata, generateBreadcrumbSchema } from '@/lib/metadata';
import Blog from '@/components/sections/Blog';

export const metadata = generatePageMetadata('blog');

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', url: 'https://www.aqdecor.com' },
  { name: 'Blog', url: 'https://www.aqdecor.com/blog' },
]);

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="pt-24">
        <Blog />
      </div>
    </>
  );
}