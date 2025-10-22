'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Metadata } from 'next';
import { Calendar, Clock, User, Tag, ArrowLeft, Share2, AlertCircle, Loader } from 'lucide-react';
import { blogApi } from '@/services/blogApi';
import { Blog } from '@/types/blog.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchBlogDetail();
    }
  }, [id]);

  const fetchBlogDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      const blogData = await blogApi.getBlogById(id);
      setBlog(blogData);
      
      if (blogData.category) {
        fetchRelatedBlogs(blogData.category);
      }
    } catch (err: any) {
      console.error('Fetch blog error:', err);
      setError(err.message || 'Failed to load blog post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async (category: string) => {
    try {
      const response = await blogApi.getBlogs({ 
        category, 
        limit: 8
      });
      
      const filtered = response.blogs.filter((b: Blog) => b._id !== id);
      setRelatedBlogs(filtered.slice(0, 3));
    } catch (err) {
      console.error('Fetch related blogs error:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share && blog) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const getImageUrl = (imagePath: string): string => {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `${API_BASE_URL}${imagePath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="inline-block w-12 h-12 text-[#9B4F96] animate-spin" />
          <p className="mt-4 text-gray-600" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
            Loading blog post...
          </p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
            Blog Not Found
          </h2>
          <p className="text-gray-600 mb-2" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
            {error || 'The blog post you are looking for does not exist.'}
          </p>
          <p className="text-sm text-gray-500 mb-6" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
            Check the console for more details.
          </p>
          <button
            onClick={() => router.push('/blog')}
            className="bg-[#9B4F96] text-white px-6 py-3 rounded-lg hover:bg-[#8B4C87] transition-all"
            style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-white py-16 overflow-hidden">
        <div className="container mx-auto px-4">
          <button
            onClick={() => router.push('/blog')}
            className="flex items-center gap-2 text-[#9B4F96] mb-6 hover:text-[#8B4C87] transition-colors w-fit"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              Back to Blog
            </span>
          </button>

          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block bg-[#9B4F96] text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              {blog.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-[#9B4F96] mb-6"
              style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>{blog.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                  {new Date(blog.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>{blog.readTime}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] rounded-full"></div>
      </div>

      {/* Featured Image */}
      <div className="container mx-auto px-4 -mt-8 mb-8">
        <div className="max-w-4xl mx-auto overflow-hidden rounded-xl shadow-xl">
          <img
            src={getImageUrl(blog.image)}
            alt={`${blog.title} - ${blog.category}`}
            className="w-full h-96 object-cover"
            style={{ objectPosition: 'center' }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Excerpt */}
          <div className="bg-[#9B4F96]/5 border-l-4 border-[#9B4F96] rounded-r-lg p-6 mb-8">
            <p className="text-lg text-gray-700 italic leading-relaxed"
              style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              {blog.excerpt}
            </p>
          </div>

          {/* Share Button */}
          <div className="flex justify-end mb-8">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:shadow-lg transition-all border border-gray-200"
            >
              <Share2 className="w-4 h-4 text-[#9B4F96]" />
              <span className="text-gray-700 font-medium" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                Share
              </span>
            </button>
          </div>

          {/* Blog Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
            <article className="prose prose-lg max-w-none">
              {blog.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-gray-700 leading-relaxed mb-6"
                  style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                  {paragraph}
                </p>
              ))}
            </article>
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="bg-white rounded-xl shadow p-6 mb-12">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"
                style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                <Tag className="w-5 h-5 text-[#9B4F96]" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-[#9B4F96] hover:text-white transition-colors cursor-pointer"
                    style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Blogs */}
          {relatedBlogs.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-[#9B4F96] mb-8"
                style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                Related Articles
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedBlogs.map((relatedBlog) => (
                  <div
                    key={relatedBlog._id}
                    onClick={() => router.push(`/blog/${relatedBlog.slug || relatedBlog._id}`)}
                    className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  >
                    <img
                      src={getImageUrl(relatedBlog.image)}
                      alt={`${relatedBlog.title} - Related Article`}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 hover:text-[#9B4F96] transition-colors"
                        style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                        {relatedBlog.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3"
                        style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                        {relatedBlog.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                          {new Date(relatedBlog.createdAt).toLocaleDateString()}
                        </span>
                        <span style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                          {relatedBlog.readTime}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .prose p {
          margin-bottom: 1.5rem;
        }
        
        .prose p:last-child {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
}