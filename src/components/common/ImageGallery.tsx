import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Project } from '../../types';

interface ImageGalleryProps {
  project: Project | null;
  initialImageIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  project,
  initialImageIndex,
  isOpen,
  onClose,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(initialImageIndex);

  useEffect(() => {
    setCurrentImageIndex(initialImageIndex);
  }, [initialImageIndex]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen || !project) return;
      
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyPress);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isOpen, project, currentImageIndex]);

  if (!isOpen || !project || !project.images) return null;

  const goToNext = () => {
    setCurrentImageIndex((prev) => 
      prev === project.images.length - 1 ? 0 : prev + 1
    );
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? project.images.length - 1 : prev - 1
    );
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-60 bg-gradient-to-b from-black/70 to-transparent p-4">
        <div className="flex justify-between items-center text-white max-w-7xl mx-auto">
          <div>
            <h2 className="text-xl font-semibold">{project.title}</h2>
            <p className="text-sm opacity-75">
              {currentImageIndex + 1} of {project.images.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      {project.images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-60 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-60 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Main Image */}
      <div className="max-w-[90vw] max-h-[80vh] flex items-center justify-center">
        <img
          src={project.images[currentImageIndex]}
          alt={`${project.title} - Image ${currentImageIndex + 1}`}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Thumbnails */}
      {project.images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-lg">
          {project.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-12 h-12 rounded overflow-hidden border-2 transition-all ${
                index === currentImageIndex ? 'border-white' : 'border-transparent opacity-60'
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;