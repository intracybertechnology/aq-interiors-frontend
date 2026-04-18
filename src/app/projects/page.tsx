import { generatePageMetadata, generateBreadcrumbSchema } from '@/lib/metadata';
import Projects from '@/components/sections/Projects';

export const metadata = generatePageMetadata('projects');

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', url: 'https://www.aqdecor.com' },
  { name: 'Projects', url: 'https://www.aqdecor.com/projects' },
]);

export default function ProjectsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="pt-24">
        <Projects />
      </div>
    </>
  );
}