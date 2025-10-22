'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, User, Tag, ChevronRight, Search, AlertCircle, Loader } from 'lucide-react';
import { blogApi } from '../../services/blogApi';

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  createdAt: string;
  category: string;
  tags: string[];
  image: string;
  readTime: string;
  featured: boolean;
  slug: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const BASE_URL = API_BASE_URL;

const Blog: React.FC = () => {
  const router = useRouter();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [visiblePosts, setVisiblePosts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/blogs/categories`);
        const data = await response.json();
        if (data.success) {
          // Filter out 'All' from API response to prevent duplicates
          const uniqueCategories = ['All', ...data.data.categories.filter((cat: string) => cat !== 'All')];
          setCategories(uniqueCategories);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await blogApi.getBlogs({
          page: currentPage,
          limit: 10,
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          search: searchTerm || undefined
        });

        setBlogPosts(data.blogs);
        setPagination(data.pagination);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [selectedCategory, searchTerm, currentPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const postId = entry.target.getAttribute('data-post-id');
            if (postId) {
              setVisiblePosts(prev => [...new Set([...prev, postId])]);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const posts = document.querySelectorAll('[data-post-id]');
    posts.forEach(post => observer.observe(post));

    return () => observer.disconnect();
  }, [blogPosts]);

  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToBlog = (post: BlogPost) => {
    router.push(`/blog/${post.slug || post._id}`);
  };

  return (
    <>
     <div className="bg-gray-50 pb-0 border-b-8 border-white-500">
        <div className="relative bg-white py-20 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up bg-gradient-to-r from-[#9B4F96] via-[#c96bb3] to-[#9B4F96] bg-clip-text text-transparent"
                  style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                  Design Insights & Ideas
                </h1>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] rounded-full"></div>
              </div>
              <p className="text-lg max-w-2xl mx-auto animate-fade-in-up animation-delay-200 text-gray-600 leading-relaxed mt-8"
                style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                Stay updated with the latest trends, tips, and insights from our design experts
              </p>
            </div>
          </div>
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute bottom-20 right-10 w-16 h-16 bg-white/10 rounded-full animate-float animation-delay-1000"></div>
          <div className="absolute top-40 right-1/4 w-12 h-12 bg-white/10 rounded-full animate-float animation-delay-500"></div>
        </div>

        <div className="container mx-auto px-4 -mt-10 relative z-20">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#9B4F96] focus:border-transparent transition-all"
                  style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category, index) => (
                  <button
                    key={`${category}-${index}`}  
                    onClick={() => handleCategoryChange(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${selectedCategory === category
                        ? 'bg-[#9B4F96] text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="container mx-auto px-4 mb-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="container mx-auto px-4 py-16 text-center">
            <Loader className="inline-block w-12 h-12 text-[#9B4F96] animate-spin" />
            <p className="mt-4 text-gray-600">Loading blogs...</p>
          </div>
        ) : blogPosts.length === 0 ? (
          <div className="container mx-auto px-4 py-16 text-center">
            <p className="text-xl text-gray-600">No blogs found matching your criteria.</p>
          </div>
        ) : (
          <>
            {featuredPosts.length > 0 && (
              <div className="container mx-auto px-4 mb-16">
                <h2 className="text-3xl font-bold text-[#9B4F96] mb-8"
                  style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                  Featured Articles
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {featuredPosts.map((post) => (
                    <article
                      key={post._id}
                      data-post-id={post._id}
                      className={`group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer ${visiblePosts.includes(post._id)
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8'
                        }`}
                      onClick={() => navigateToBlog(post)}
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={`${BASE_URL}${post.image}`}
                          alt={post.title}
                          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-4 left-4">
                          <span className="bg-[#9B4F96] text-white px-3 py-1 rounded-full text-sm font-medium">
                            Featured
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <time dateTime={post.createdAt}>{new Date(post.createdAt).toLocaleDateString()}</time>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#9B4F96] transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-base text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <User className="w-4 h-4" />
                            <span>{post.author}</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateToBlog(post);
                            }}
                            className="flex items-center gap-1 text-[#9B4F96] hover:gap-2 transition-all duration-300 font-medium"
                          >
                            Read More <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {regularPosts.length > 0 && (
              <div className="container mx-auto px-4 mb-16">
                <h2 className="text-3xl font-bold text-[#9B4F96] mb-8"
                  style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                  Latest Articles
                </h2>
                <div className="space-y-16">
                  {regularPosts.map((post, index) => (
                    <article
                      key={post._id}
                      data-post-id={post._id}
                      className={`flex flex-col lg:flex-row items-center gap-8 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                        } ${visiblePosts.includes(post._id)
                          ? 'opacity-100 translate-x-0'
                          : `opacity-0 ${index % 2 === 0 ? '-translate-x-8' : 'translate-x-8'}`
                        } transition-all duration-700`}
                    >
                      <div className="lg:w-1/2 cursor-pointer" onClick={() => navigateToBlog(post)}>
                        <div className="relative group overflow-hidden rounded-2xl shadow-lg">
                          <img
                            src={`${BASE_URL}${post.image}`}
                            alt={post.title}
                            className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                      </div>
                      <div className="lg:w-1/2 space-y-4">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="bg-[#9B4F96] text-white px-3 py-1 rounded-full font-medium">
                            {post.category}
                          </span>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <time dateTime={post.createdAt}>{new Date(post.createdAt).toLocaleDateString()}</time>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                        <h3
                          className="text-xl font-bold text-[#9B4F96] hover:text-[#7B4278] transition-colors duration-300 cursor-pointer"
                          onClick={() => navigateToBlog(post)}
                        >
                          {post.title}
                        </h3>
                        <p className="text-base text-gray-600 leading-relaxed">
                          {post.excerpt}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                            >
                              <Tag className="w-3 h-3" />
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-4">
                          <div className="flex items-center gap-2 text-gray-500">
                            <User className="w-4 h-4" />
                            <span className="font-medium">{post.author}</span>
                          </div>
                          <button
                            onClick={() => navigateToBlog(post)}
                            className="flex items-center gap-1 text-[#9B4F96] hover:gap-2 transition-all duration-300 font-medium"
                          >
                            Read More <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {pagination && pagination.pages > 1 && (
              <div className="container mx-auto px-4 mb-16">
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${pagination.hasPrev
                      ? 'bg-[#9B4F96] text-white hover:bg-[#8B4C87]'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    Previous
                  </button>
                  <div className="flex gap-2">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${currentPage === page
                          ? 'bg-[#9B4F96] text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                          }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${pagination.hasNext
                      ? 'bg-[#9B4F96] text-white hover:bg-[#8B4C87]'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        <style jsx>{`
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }
          
          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out;
          }
          
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          
          .animation-delay-200 {
            animation-delay: 200ms;
          }
          
          .animation-delay-500 {
            animation-delay: 500ms;
          }
          
          .animation-delay-1000 {
            animation-delay: 1000ms;
          }
          
          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </div>
    </>
  );
};

export default Blog;