import React, { useState, useEffect } from 'react';
import { ArrowRight, Play } from 'lucide-react';

const HeroSection: React.FC = () => {
  // Carousel state and images
  const heroImages = [
    '/images/hero/hero-bg.jpg',
    '/images/hero/hero1-bg.jpg',
    '/images/hero/hero2-bg.jpg',
    '/images/hero/hero3-bg.jpg',
    '/images/hero/hero5-bg.jpg'
  ];

  const [currentImage, setCurrentImage] = useState(0);

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Smooth scroll function for SPA navigation
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
    <section id="home" className="relative min-h-screen flex flex-col overflow-hidden pt-20">
      {/* Background Image Carousel */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url('${heroImages[currentImage]}')`,
        }}
      />

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Hero Content */}
      <div className="flex-1 flex items-center relative z-10 px-8 lg:px-16">
        <div className="w-full">
          <div className="max-w-4xl">
            <div className="animate-fade-in">
              {/* Main Headline - Al Qethaa Al Qadeema Tagline */}
              <h1 
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-white"
                style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
              >
                <span className="block">Your Vision - Our Creation </span>
               
              </h1>

              {/* Subtitle */}
              <p 
                className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl leading-relaxed"
                style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
              >
                "Providing Professional interior design and fit-out solutions for Commercial, Retail, Residential, Healthcare & Hospitality projects across UAE."
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6">
                <button
                  onClick={() => scrollToSection('contact')}
                  className="group px-8 py-4 text-lg bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center"
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

     
      {/* Carousel Indicators */}
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
    </section>
  );
};

export default HeroSection;