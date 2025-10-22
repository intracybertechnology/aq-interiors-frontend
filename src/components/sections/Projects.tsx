'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { projectApi } from '@/services/projectApi';
import Card from '@/components/ui/Card';
import { ArrowRight, MapPin, Eye, ExternalLink, Loader, AlertCircle } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  images: string[];
  location?: string;
  year?: string;
}

const Projects: React.FC = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [visibleProjects, setVisibleProjects] = useState(6);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await projectApi.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await projectApi.getProjects({
          limit: 100,
          category: selectedCategory !== 'All' ? selectedCategory : undefined
        });
        
        setProjects(data.projects || []);
      } catch (err: any) {
        setError(err.message);
        console.error('Failed to fetch projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [selectedCategory]);

  // Intersection Observer for animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(el => {
      if (observerRef.current) {
        observerRef.current.observe(el);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [projects]);

  const openProject = (project: Project) => {
    router.push(`/projects/${project.id}`);
  };

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(project => project.category === selectedCategory);

  const displayedProjects = filteredProjects.slice(0, visibleProjects);

  const loadMore = () => {
    setVisibleProjects(prev => prev + 6);
  };

  return (
    <section id="projects" className="pt-24 pb-16 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div
          id="projects-header"
          data-animate
          className={`text-center mb-16 transition-all duration-1000 transform ${isVisible['projects-header'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <div className="relative inline-block">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#9B4F96] via-[#c96bb3] to-[#9B4F96] bg-clip-text text-transparent animate-gradient bg-300% leading-tight"
              style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              Our Projects
            </h1>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] rounded-full"></div>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-8 leading-relaxed"
            style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
            Explore our portfolio of completed interior design and fit-out projects across UAE.
          </p>
        </div>

        <div
          id="category-filter"
          data-animate
          className={`flex flex-wrap justify-center gap-4 mb-12 transition-all duration-1000 delay-200 transform ${isVisible['category-filter'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          {categories.map((category, index) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setVisibleProjects(6);
              }}
              className={`px-8 py-3 rounded-full transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 ${selectedCategory === category
                  ? 'bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-[#9B4F96] hover:to-[#c96bb3] hover:text-white border border-gray-200 hover:border-[#9B4F96]'
                }`}
              style={{
                fontFamily: '"Lucida Bright", Georgia, serif',
                animationDelay: `${index * 100}ms`
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-16">
            <Loader className="inline-block w-12 h-12 text-[#9B4F96] animate-spin" />
            <p className="mt-4 text-gray-600" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              Loading projects...
            </p>
          </div>
        ) : (
          <>
            <div
              id="projects-grid"
              data-animate
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-1000 delay-400 transform ${isVisible['projects-grid'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
              {displayedProjects.map((project) => (
                <Card
                  key={project.id}
                  className="overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 bg-white"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-64 object-cover transition-all duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTI1SDE2NS41VjEzNUgxNzVWMTI1WiIgZmlsbD0iIzlCNEY5NiIvPgo8cGF0aCBkPSJNMjI1IDEyNUgyMTUuNVYxMzVIMjI1VjEyNVoiIGZpbGw9IiM5QjRGOTYiLz4K'
                      }}
                    />

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                      <div className="text-center text-white p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <button
                          onClick={() => openProject(project)}
                          className="group/btn px-6 py-3 border-2 border-white text-white hover:bg-white hover:text-[#9B4F96] rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto"
                          style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                        >
                          <span>View Details</span>
                          <ExternalLink className="group-hover/btn:translate-x-1 transition-transform duration-300" size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="absolute top-4 left-4">
                      <span className="text-xs font-semibold text-white bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] px-3 py-1 rounded-full shadow-lg"
                        style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                        {project.category}
                      </span>
                    </div>

                    {project.year && (
                      <div className="absolute top-4 right-4">
                        <span className="text-xs font-semibold text-white bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full"
                          style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                          {project.year}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-3 text-[#9B4F96] group-hover:text-[#c96bb3] transition-colors duration-300"
                      style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                      {project.title}
                    </h2>
                    <p className="text-base text-gray-600 mb-4 line-clamp-2 leading-relaxed"
                      style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                      {project.description}
                    </p>
                    {project.location && (
                      <div className="flex items-center text-gray-500 text-sm">
                        <MapPin size={14} className="mr-1 text-[#9B4F96]" />
                        <span style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>{project.location}</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {visibleProjects < filteredProjects.length && (
              <div
                id="load-more"
                data-animate
                className={`text-center mt-12 transition-all duration-1000 delay-600 transform ${isVisible['load-more'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              >
                <button
                  onClick={loadMore}
                  className="group px-8 py-4 bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] hover:from-[#8a4687] hover:to-[#b85ca4] text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto"
                  style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                >
                  <span>Load More Projects ({filteredProjects.length - visibleProjects} remaining)</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={20} />
                </button>
              </div>
            )}

            {filteredProjects.length === 0 && !loading && (
              <div className="text-center mt-12">
                <div className="bg-gradient-to-r from-white to-purple-50 rounded-3xl p-12 shadow-lg border border-gray-100">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] rounded-full flex items-center justify-center">
                    <Eye className="text-white" size={32} />
                  </div>
                  <h3 className="text-3xl font-bold mb-3 text-[#9B4F96]" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                    No projects found
                  </h3>
                  <p className="text-base text-gray-600 mb-6" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                    No projects match the selected category.
                  </p>
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className="px-8 py-3 bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                  >
                    View All Projects
                  </button>
                </div>
              </div>
            )}

            <div
              id="stats-section"
              data-animate
              className={`mt-20 transition-all duration-1000 delay-800 transform ${isVisible['stats-section'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 bg-gradient-to-r from-white to-purple-50 rounded-3xl p-12 shadow-xl border border-gray-100">
                {[
                  { number: '750+', label: 'Completed Projects', icon: '🏆' },
                  { number: '4', label: 'Key Sectors', icon: '🏢' },
                  { number: '100%', label: 'Client Satisfaction', icon: '⭐' },
                  { number: '10+', label: 'Years Experience', icon: '📅' }
                ].map((stat, index) => (
                  <div key={index} className="text-center group">
                    <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      {stat.icon}
                    </div>
                    <div className="text-4xl font-bold text-[#9B4F96] mb-2" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                      {stat.number}
                    </div>
                    <div className="text-base text-gray-600 font-medium" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient {
          animation: gradient 4s ease infinite;
        }
        
        .bg-300\\% {
          background-size: 300% 300%;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default Projects;