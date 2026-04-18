import { MetadataRoute } from 'next';
import { connectDB } from '@/lib/config/database';
import Blog from '@/lib/models/Blog';
import Project from '@/lib/models/Project';

const baseUrl = 'https://www.aqdecor.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/company`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // Dynamic blog pages — uses slug for SEO-friendly URLs
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    await connectDB();
    const blogs = await Blog.find({ isPublished: true })
      .select('slug updatedAt createdAt')
      .sort({ createdAt: -1 })
      .lean();

    blogPages = blogs
      .filter((blog: any) => blog.slug)
      .map((blog: any) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: new Date(blog.updatedAt || blog.createdAt),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
  } catch (error) {
    console.error('Sitemap: Failed to fetch blogs:', error);
  }

  // Dynamic project pages — uses custom id field
  let projectPages: MetadataRoute.Sitemap = [];
  try {
    await connectDB();
    const projects = await Project.find({ isActive: true })
      .select('id updatedAt createdAt')
      .sort({ createdAt: -1 })
      .lean();

    projectPages = projects
      .filter((project: any) => project.id)
      .map((project: any) => ({
        url: `${baseUrl}/projects/${project.id}`,
        lastModified: new Date(project.updatedAt || project.createdAt),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
  } catch (error) {
    console.error('Sitemap: Failed to fetch projects:', error);
  }

  return [...staticPages, ...blogPages, ...projectPages];
}