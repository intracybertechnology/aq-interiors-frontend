import { Metadata } from 'next';
import ProjectDetail from '@/components/sections/ProjectDetail';
import { generateBreadcrumbSchema } from '@/lib/metadata';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqdecor.com';

async function getProject(id: string) {
  try {
    const response = await fetch(`${baseUrl}/api/projects/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.success ? data.data : null;
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const project = await getProject(params.id);

  if (!project) {
    return {
      title: 'Project Not Found | AQ Decor',
      description: 'The project you are looking for does not exist.',
      robots: { index: false, follow: false },
    };
  }

  const location = project.location || 'UAE';
  const category = project.category || 'Commercial Fit-out';

  const description = project.description
    ? project.description.slice(0, 160)
    : `${project.title} — ${category} project by AQ Decor in ${location}. Expert fit-out and interior solutions across Sharjah & Dubai UAE.`;

  // Rich keywords based on project data
  const keywords = [
    `${category.toLowerCase()} ${location.toLowerCase()}`,
    `fitout project ${location}`,
    'commercial fitout UAE',
    'AQ Decor projects',
    `interior design ${location}`,
    'fitout contractor sharjah',
    'fitout contractor dubai',
    ...(project.tags || []),
  ].join(', ');

  return {
    title: `${project.title} | AQ Decor Projects`,
    description,
    keywords,
    openGraph: {
      title: `${project.title} | AQ Decor`,
      description,
      url: `${baseUrl}/projects/${params.id}`,
      siteName: 'AQ Decor',
      images:
        project.images?.length > 0
          ? [{ url: project.images[0], width: 1200, height: 630, alt: project.title }]
          : [{ url: `${baseUrl}/og-image.jpg`, width: 1200, height: 630, alt: 'AQ Decor Projects' }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description,
      images: project.images?.length > 0 ? [project.images[0]] : [`${baseUrl}/og-image.jpg`],
      creator: '@aqdecor',
    },
    alternates: {
      canonical: `${baseUrl}/projects/${params.id}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: baseUrl },
    { name: 'Projects', url: `${baseUrl}/projects` },
    { name: 'Project Detail', url: `${baseUrl}/projects/${params.id}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProjectDetail id={params.id} />
    </>
  );
}