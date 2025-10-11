import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projects } from '../data/projects';
import ImageGallery from '../components/common/ImageGallery';
import { ArrowLeft, Calendar, MapPin, Tag, Image as ImageIcon } from 'lucide-react';
import type { Project } from '../types';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const foundProject = projects.find((p) => p.id === id);
    if (foundProject) {
      setProject(foundProject);
      // Scroll to top when project loads
      window.scrollTo(0, 0);
    }
  }, [id]);

  const openGallery = (index: number) => {
    setSelectedImageIndex(index);
    setIsGalleryOpen(true);
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] rounded-full flex items-center justify-center">
              <ImageIcon className="text-white" size={40} />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
            Project Not Found
          </h2>
          <p className="text-gray-600 mb-6" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
            The project you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/projects')}
            className="px-8 py-3 bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2"
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
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] text-white py-12">
          <div className="container-max px-8 lg:px-16">
            <button
              onClick={() => navigate('/#projects')}
              className="flex items-center text-white/90 hover:text-white transition-colors mb-6 group"
              style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              Back to Projects
            </button>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                  {project.title}
                </h1>
                <div className="flex flex-wrap gap-4 text-white/90">
                  <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                    <Tag className="w-4 h-4 mr-2" />
                    <span style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>{project.category}</span>
                  </div>
                  {project.year && (
                    <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>{project.year}</span>
                    </div>
                  )}
                  {project.location && (
                    <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>{project.location}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-xl">
                <div className="text-sm text-white/80 mb-1" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                  Total Images
                </div>
                <div className="text-3xl font-bold" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                  {project.images.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container-max px-8 lg:px-16 py-12">
          {/* Description */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-[#9B4F96] mb-4" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              Project Overview
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              {project.description}
            </p>
          </div>

          {/* Image Gallery Grid */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              Project Gallery
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => openGallery(index)}
                  className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <img
                    src={image}
                    alt={`${project.title} - Image ${index + 1}`}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTI1SDE2NS41VjEzNUgxNzVWMTI1WiIgZmlsbD0iIzlCNEY5NiIvPgo8cGF0aCBkPSJNMjI1IDEyNUgyMTUuNVYxMzVIMjI1VjEyNVoiIGZpbGw9IiM5QjRGOTYiLz4K';
                    }}
                  />

                  {/* Image Counter Badge */}
                  <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                    {index + 1} / {project.images.length}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Back to Projects Button - Bottom */}
          <div className="mt-16 text-center">
            <button
              onClick={() => navigate('/projects')}
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] hover:from-[#8B4C87] hover:to-[#b85ca4] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
            >
              <ArrowLeft size={20} />
              <span>Back to All Projects</span>
            </button>
          </div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      <ImageGallery
        project={project}
        initialImageIndex={selectedImageIndex}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />
    </>
  );
};

export default ProjectDetail;