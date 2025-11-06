'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { projectApi } from '@/services/projectApi';
import ImageGallery from '@/components/common/ImageGallery';
import { MapPin, Calendar, ArrowLeft, ChevronRight, Loader, AlertCircle } from 'lucide-react';
import type { Project } from '@/types';

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [projectId, setProjectId] = useState<string | null>(null);

  // Unwrap params promise
  useEffect(() => {
    params.then((resolvedParams) => {
      setProjectId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await projectApi.getProjectById(projectId);
        setProject(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load project');
        console.error('Failed to fetch project:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const openGallery = (index: number) => {
    setSelectedImageIndex(index);
    setGalleryOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <Loader className="inline-block w-12 h-12 text-[#9B4F96] animate-spin mb-4" />
          <p className="text-gray-600" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
            Loading project details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2" 
              style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
            Project Not Found
          </h2>
          <p className="text-center text-gray-600 mb-6" 
             style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
            {error || 'The project you are looking for does not exist.'}
          </p>
          <button
            onClick={() => router.push('/projects')}
            className="w-full px-6 py-3 bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
            style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
          >
            <ArrowLeft size={20} />
            <span>Back to Projects</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Back Button */}
        <div className="container mx-auto px-4 lg:px-8 pt-24 pb-8">
          <button
            onClick={() => router.push('/projects')}
            className="flex items-center space-x-2 text-[#9B4F96] hover:text-[#c96bb3] transition-colors duration-300 group"
            style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
          >
            <ArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" size={20} />
            <span className="font-semibold">Back to Projects</span>
          </button>
        </div>

        {/* Project Header */}
        <div className="container mx-auto px-4 lg:px-8 pb-8">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="px-4 py-2 bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] text-white rounded-full text-sm font-semibold shadow-lg"
                  style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              {project.category}
            </span>
            {project.year && (
              <div className="flex items-center text-gray-600">
                <Calendar size={18} className="mr-2 text-[#9B4F96]" />
                <span style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>{project.year}</span>
              </div>
            )}
            {project.location && (
              <div className="flex items-center text-gray-600">
                <MapPin size={18} className="mr-2 text-[#9B4F96]" />
                <span style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>{project.location}</span>
              </div>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#9B4F96] via-[#c96bb3] to-[#9B4F96] bg-clip-text text-transparent"
              style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
            {project.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-4xl leading-relaxed"
             style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
            {project.description}
          </p>
        </div>

        {/* Main Image */}
        {project.images && project.images.length > 0 && (
          <div className="container mx-auto px-4 lg:px-8 pb-12">
            <div 
              className="relative rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
              onClick={() => openGallery(0)}
            >
              <img
                src={project.images[0]}
                alt={project.title}
                className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTI1SDE2NS41VjEzNUgxNzVWMTI1WiIgZmlsbD0iIzlCNEY5NiIvPgo8cGF0aCBkPSJNMjI1IDEyNUgyMTUuNVYxMzVIMjI1VjEyNVoiIGZpbGw9IiM5QjRGOTYiLz4K'
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                  <p className="text-lg font-semibold" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                    Click to view gallery
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Project Info Card */}
        <div className="container mx-auto px-4 lg:px-8 pb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-8 text-[#9B4F96]"
                style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              Project Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2"
                    style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                  Category
                </h3>
                <p className="text-lg text-gray-900 font-medium"
                   style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                  {project.category}
                </p>
              </div>
              {project.location && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2"
                      style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                    Location
                  </h3>
                  <p className="text-lg text-gray-900 font-medium"
                     style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                    {project.location}
                  </p>
                </div>
              )}
              {project.year && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2"
                      style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                    Completion Year
                  </h3>
                  <p className="text-lg text-gray-900 font-medium"
                     style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                    {project.year}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Image Gallery Grid */}
        {project.images && project.images.length > 1 && (
          <div className="container mx-auto px-4 lg:px-8 pb-16">
            <h2 className="text-3xl font-bold mb-8 text-[#9B4F96]"
                style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              Project Gallery
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.images.slice(1).map((image, index) => (
                <div
                  key={index}
                  className="relative rounded-xl overflow-hidden shadow-lg cursor-pointer group aspect-video"
                  onClick={() => openGallery(index + 1)}
                >
                  <img
                    src={image}
                    alt={`${project.title} - Image ${index + 2}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTI1SDE2NS41VjEzNUgxNzVWMTI1WiIgZmlsbD0iIzlCNEY5NiIvPgo8cGF0aCBkPSJNMjI1IDEyNUgyMTUuNVYxMzVIMjI1VjEyNVoiIGZpbGw9IiM5QjRGOTYiLz4K'
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ChevronRight size={32} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="container mx-auto px-4 lg:px-8 pb-16">
          <div className="bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] rounded-2xl shadow-2xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4"
                style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              Interested in a Similar Project?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto"
               style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              Let's discuss how we can bring your vision to life with our expert fit-out and interior design services.
            </p>
            <button
              onClick={() => router.push('/contact')}
              className="px-8 py-4 bg-white text-[#9B4F96] rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
            >
              Get in Touch
            </button>
          </div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      <ImageGallery
        project={project}
        initialImageIndex={selectedImageIndex}
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
      />
    </>
  );
}