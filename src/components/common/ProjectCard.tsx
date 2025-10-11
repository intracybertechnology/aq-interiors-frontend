import React, { useState } from 'react';
import { Image, ExternalLink, Eye } from 'lucide-react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  category: string;
  technologies?: string[];
  projectUrl?: string;
  githubUrl?: string;
  gallery?: string[];
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  image,
  category,
  technologies = [],
  projectUrl,
  githubUrl,
  gallery = []
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleViewDetails = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
        {/* Project Image */}
        <div className="relative h-48 overflow-hidden">
          {!imageError ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <Image size={48} className="text-gray-400" />
            </div>
          )}
          
          {/* Category Badge - Updated with theme color */}
          <div className="absolute top-4 left-4">
            <span className="bg-gradient-to-r from-[#9B4F96] to-[#B86BB3] text-white px-3 py-1 rounded-full text-xs font-semibold">
              {category}
            </span>
          </div>

          {/* Overlay with Actions */}
          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
            <button
              onClick={handleViewDetails}
              className="bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/30 transition-all duration-200"
              title="View Details"
            >
              <Eye size={20} />
            </button>
            
            {projectUrl && (
              <button
                onClick={() => handleExternalLink(projectUrl)}
                className="bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/30 transition-all duration-200"
                title="Visit Project"
              >
                <ExternalLink size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Project Content */}
        <div className="p-6">
          {/* Title with theme color using Tailwind */}
          <h3 className="text-xl font-bold text-[#9B4F96] mb-2 line-clamp-2">
            {title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {description}
          </p>

          {/* Technologies */}
          {technologies.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {technologies.slice(0, 3).map((tech, index) => (
                  <span
                    key={index}
                    className="bg-[#9B4F96]/10 text-[#9B4F96] px-2 py-1 rounded-md text-xs font-medium border border-[#9B4F96]/20"
                  >
                    {tech}
                  </span>
                ))}
                {technologies.length > 3 && (
                  <span className="bg-[#9B4F96]/10 text-[#9B4F96] px-2 py-1 rounded-md text-xs font-medium border border-[#9B4F96]/20">
                    +{technologies.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button
              onClick={handleViewDetails}
              variant="outline"
              className="flex-1"
            >
              View Details
            </Button>
            
            {projectUrl && (
              <Button
                onClick={() => handleExternalLink(projectUrl)}
                variant="primary"
                className="flex-1"
              >
                Visit Project
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Project Details */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={title}>
        <div className="space-y-4">
          {/* Project Image in Modal */}
          <div className="w-full h-64 overflow-hidden rounded-lg">
            {!imageError ? (
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Image size={48} className="text-gray-400" />
              </div>
            )}
          </div>

          {/* Project Details */}
          <div>
            {/* Modal headings with theme color using Tailwind */}
            <h4 className="text-lg font-semibold text-[#9B4F96] mb-2">Description</h4>
            <p className="text-gray-600">{description}</p>
          </div>

          {/* Technologies in Modal */}
          {technologies.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-[#9B4F96] mb-2">Technologies Used</h4>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-[#9B4F96] to-[#B86BB3] text-white px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Gallery if available */}
          {gallery.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-[#9B4F96] mb-2">Gallery</h4>
              <div className="grid grid-cols-2 gap-2">
                {gallery.slice(0, 4).map((galleryImage, index) => (
                  <img
                    key={index}
                    src={galleryImage}
                    alt={`${title} - Image ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Action Links in Modal */}
          <div className="flex space-x-4 pt-4">
            {projectUrl && (
              <Button
                onClick={() => handleExternalLink(projectUrl)}
                variant="primary"
                className="flex items-center space-x-2"
              >
                <ExternalLink size={16} />
                <span>Visit Project</span>
              </Button>
            )}
            
            {githubUrl && (
              <Button
                onClick={() => handleExternalLink(githubUrl)}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <ExternalLink size={16} />
                <span>View Code</span>
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProjectCard;