import { Metadata } from 'next';
import BlogDetail from '@/components/sections/BlogDetail';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqdecor.com';

async function getBlog(id: string) {
  try {
    const response = await fetch(`${baseUrl}/api/blogs/${id}`, {
      next: { revalidate: 3600 }
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.success ? data.data : null;
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const blog = await getBlog(id);

  if (!blog) {
    return {
      title: 'Blog Not Found | AQ Decor',
      description: 'The blog post you are looking for does not exist.',
    };
  }

  return {
    title: `${blog.title} | AQ Decor Blog`,
    description: blog.excerpt || blog.title,
    keywords: blog.tags?.join(', '),
    openGraph: {
      title: blog.title,
      description: blog.excerpt || blog.title,
      url: `${baseUrl}/blog/${params.id}`,
      siteName: 'AQ Decor',
      images: blog.image ? [{ url: blog.image, width: 1200, height: 630, alt: blog.title }] : [],
      type: 'article',
      publishedTime: blog.createdAt,
      authors: [blog.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.excerpt || blog.title,
      images: blog.image ? [blog.image] : [],
    },
    alternates: {
      canonical: `${baseUrl}/blog/${params.id}`,
    },
  };
}
export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BlogDetail id={id} />;
}