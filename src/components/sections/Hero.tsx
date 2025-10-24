'use client'

import React, { useState, useEffect } from 'react';
import { ArrowRight, Play } from 'lucide-react';

const HeroSection: React.FC = () => {
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/hero-images`);
        const data = await response.json();

        if (data.success && data.data && data.data.length > 0) {
          const apiImages = data.data.map((item: any) => item.imageUrl);
          setHeroImages(apiImages);
        } else {
          console.warn('No hero images found in database');
        }
      } catch (error) {
        console.error('Failed to fetch hero images:', error);
      }
    };

    fetchHeroImages();
  }, []);


  useEffect(() => {
    if (heroImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);


  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex flex-col overflow-hidden">

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: heroImages.length > 0 ? `url('${heroImages[currentImage]}')` : 'linear-gradient(135deg, #9B4F96 0%, #c96bb3 100%)',
        }}
      />

      <div className="absolute inset-0 bg-black/40 z-0"></div>


      <div className="flex-1 flex items-center relative z-10 px-8 lg:px-16 pt-24 lg:pt-32">
        <div className="w-full">
          <div className="max-w-4xl">
            <div className="animate-fade-in">

              <h1
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-white"
                style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
              >
                <span className="block">Your Vision - Our Creation</span>
              </h1>


              <p
                className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl leading-relaxed"
                style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
              >
                "Providing Professional interior design and fit-out solutions for Commercial, Retail, Residential, Healthcare & Hospitality projects across UAE."
              </p>

              <div className="flex flex-col sm:flex-row gap-6">
                <button
                  onClick={() => scrollToSection('contact')}
                  className="group px-8 py-4 text-lg bg-[#9B4F96] hover:bg-[#7f8c8d] text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center"
                  style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                >
                  Start Your Project
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => scrollToSection('gallery')}
                  className="group px-8 py-4 text-lg bg-white/10 backdrop-blur-sm border-white/30 border-2 text-white hover:bg-white hover:text-gray-900 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center"
                  style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                >
                  <Play size={20} className="mr-2 group-hover:scale-110 transition-transform" />
                  View Our Work
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


      {heroImages.length > 0 && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${currentImage === index
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/70'
                }`}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;