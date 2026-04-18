'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, Play } from 'lucide-react';

const HeroSection: React.FC = () => {
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);

  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const response = await fetch('/api/hero-image');
        const data = await response.json();

        if (data.success && data.data && data.data.length > 0) {
          const apiImages = data.data.map((item: any) => item.imageUrl);
          setHeroImages(apiImages);
          setImagesLoaded(new Array(apiImages.length).fill(false));
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
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleImageLoad = (index: number) => {
    setImagesLoaded((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  };

  return (
    <section id="home" className="relative min-h-screen flex flex-col overflow-hidden">

      {/* ── Background Images (Next.js Image for fast LCP) ── */}
      {heroImages.length > 0 ? (
        heroImages.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt={`AQ Decor commercial fit-out interior design UAE - slide ${index + 1}`}
            fill
            // priority on first image = browser preloads it = fast LCP
            priority={index === 0}
            // lazy load the rest
            loading={index === 0 ? 'eager' : 'lazy'}
            quality={index === 0 ? 85 : 75}
            sizes="100vw"
            className="object-cover object-center transition-opacity duration-1000"
            style={{ opacity: currentImage === index ? 1 : 0 }}
            onLoad={() => handleImageLoad(index)}
          />
        ))
      ) : (
        // Fallback gradient while images load
        <div className="absolute inset-0 bg-gradient-to-br from-[#9B4F96] to-[#c96bb3]" />
      )}

      {/* ── Dark overlay ── */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* ── Content ── */}
      <div className="flex-1 flex items-center relative z-20 px-8 lg:px-16 pt-24 lg:pt-32">
        <div className="w-full">
          <div className="max-w-4xl animate-fade-in">

            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-white"
              style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
            >
              Your Vision - Our Creation
            </h1>

            <p
              className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl leading-relaxed"
              style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
            >
              Providing Professional interior design and fit-out solutions for Commercial, Retail,
              Residential, Healthcare &amp; Hospitality projects across UAE.
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

      {/* ── Slide indicators ── */}
      {heroImages.length > 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentImage === index
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;