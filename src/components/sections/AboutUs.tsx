'use client'

import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle, Users, Award, Clock, Factory, MapPin, Calendar, Star } from 'lucide-react';
import Card from '@/components/ui/Card';

const About: React.FC = () => {
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

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
  }, []);

  const coreStrengths = [
    {
      icon: Factory,
      title: 'In-house Factory',
      description: 'Our own fully equipped factory in Sharjah for accurate and high-quality fit-out work with complete quality control.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Users,
      title: 'Expert Craftsmanship',
      description: 'Skilled team with strong design and execution expertise, delivering creative and practical solutions.',
      gradient: 'from-blue-500 to-purple-500'
    },
    {
      icon: Award,
      title: 'Quality Materials',
      description: 'Wide range of premium materials and shop-fitting items available for customized solutions.',
      gradient: 'from-pink-500 to-red-500'
    },
    {
      icon: Clock,
      title: 'Timely Delivery',
      description: 'On-time delivery within budget with reliable and consistent project outcomes.',
      gradient: 'from-green-500 to-blue-500'
    }
  ];

  const sectors = [
    {
      name: 'Commercial',
      description: 'Offices and corporate spaces',
      icon: '🏢',
      projects: '200+'
    },
    {
      name: 'Retail',
      description: 'Shops, showrooms, and retail outlets',
      icon: '🏪',
      projects: '300+'
    },
    {
      name: 'Residential',
      description: 'Homes, apartments, and villa interiors',
      icon: '🏠',
      projects: '150+'
    },
    {
      name: 'HealthCare & Hospitality',
      description: 'Hotels, restaurants, cafes, and healthcare',
      icon: '🏨',
      projects: '100+'
    }
  ];

  const stats = [
    { number: '10+', label: 'Years Experience', icon: Calendar },
    { number: '750+', label: 'Projects Completed', icon: Star },
    { number: '100%', label: 'In-house Production', icon: Factory },
    { number: '4', label: 'Key Sectors', icon: Award }
  ];

  return (
    <section id="about" className="pt-24 pb-16 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div
          id="header"
          data-animate
          className={`text-center mb-20 transition-all duration-1000 transform ${isVisible.header ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
        >
          <div className="relative inline-block">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#9B4F96] via-[#c96bb3] to-[#9B4F96] bg-clip-text text-transparent animate-gradient bg-300% leading-tight"
              style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              About Us
            </h2>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] rounded-full"></div>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-8 leading-relaxed"
            style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
            Your Vision - Our Creation. Transforming spaces across UAE since 2014 with our in-house factory advantage.
          </p>
        </div>

        {/* Stats Section */}
        <div
          id="stats"
          data-animate
          className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 transition-all duration-1000 delay-200 transform ${isVisible.stats ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#9B4F96] to-[#c96bb3] rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="text-white" size={24} />
                </div>
                <div className="text-3xl font-bold text-[#9B4F96] mb-2" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 font-medium" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div
            id="story"
            data-animate
            className={`space-y-8 px-6 md:px-8 lg:px-0 transition-all duration-1000 delay-300 transform ${isVisible.story ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
              }`}
          >
            <div>
              <div className="flex items-center space-x-2 mb-6 p-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="text-[#9B4F96]" size={20} />
                  <span className="text-[#9B4F96] font-semibold" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Sharjah, UAE</span>
                </div>
                <span className="text-gray-400">•</span>
                <div className="flex items-center space-x-2">
                  <Calendar className="text-[#9B4F96]" size={20} />
                  <span className="text-[#9B4F96] font-semibold" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Since 2014</span>
                </div>
              </div>

              <h3 className="text-3xl font-bold mb-6 text-[#9B4F96] leading-tight"
                style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                Trusted Name in Fit-Out Solutions
              </h3>

              <div className="space-y-6">
                <p className="text-base text-gray-600 leading-relaxed" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                  Founded in 2014 and based in Sharjah, UAE, Al Qethaa Al Qadeema L.L.C. is a trusted name in the
                  fit-out and interior solutions industry across the UAE. With our own fully equipped in-house factory, we specialize
                  in delivering end-to-end fit-out services—from creative designs and detailed drawings to flawless
                  execution and finishing.
                </p>

                <p className="text-base text-gray-600 leading-relaxed" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                  We combine precision, functionality, and style to create spaces that reflect our clients' vision.
                  Backed by a wide range of materials and shop-fitting items, we are able to provide customized
                  solutions that meet diverse needs with efficiency and quality.
                </p>

                <p className="text-base text-gray-600 leading-relaxed" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                  We don't just deliver projects-we craft experiences. By executing every detail to
                  perfection, we transform concepts into inspiring spaces that truly satisfy.
                </p>
              </div>
            </div>

            {/* Mission & Vision Cards */}
            <div className="grid grid-cols-1 gap-6">
              <Card className="p-6 bg-gradient-to-r from-white to-purple-50 border-l-4 border-l-[#9B4F96] hover:shadow-lg transition-all duration-300">
                <h4 className="text-lg font-semibold mb-3 text-[#9B4F96]" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Our Vision</h4>
                <p className="text-base text-gray-600 leading-relaxed" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                  To be the most trusted fit-out partner, recognized for transforming designs into reality with
                  accuracy, innovation, and uncompromised quality.
                </p>
              </Card>

              <Card className="p-6 bg-gradient-to-r from-white to-blue-50 border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-300">
                <h4 className="text-lg font-semibold mb-3 text-[#9B4F96]" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Our Mission</h4>
                <p className="text-base text-gray-600 leading-relaxed" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                  We transform ideas into reality through creative design, skilled craftsmanship, and complete
                  fit-out solutions focused on client satisfaction.
                </p>
              </Card>
            </div>

            {/* Key Achievements */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-[#9B4F96]" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Why Choose Us:</h4>
              <div className="grid gap-3">
                {[
                  'In-house factory for complete quality control',
                  'End-to-end services: Design → Drawings → Execution → Finishing',
                  'Customized solutions for all types of projects',
                  'Wide range of materials and shop-fitting items',
                  'On-time delivery within budget'
                ].map((point, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                    <CheckCircle className="text-[#9B4F96] mt-1 flex-shrink-0" size={18} />
                    <p className="text-base text-gray-600" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Core Strengths */}
          <div
            id="strengths"
            data-animate
            className={`space-y-8 transition-all duration-1000 delay-400 transform ${isVisible.strengths ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`}
          >
            <h4 className="text-3xl font-bold mb-8 text-[#9B4F96]" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              Core Strengths
            </h4>

            <div className="grid gap-6">
              {coreStrengths.map((strength, index) => (
                <Card key={index} className="p-6 group hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className={`p-4 bg-gradient-to-r ${strength.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <strength.icon className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-lg font-semibold mb-3 text-[#9B4F96] group-hover:text-[#c96bb3] transition-colors duration-300"
                        style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                        {strength.title}
                      </h5>
                      <p className="text-base text-gray-600 leading-relaxed" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                        {strength.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Four Main Sectors */}
        <div
          id="sectors"
          data-animate
          className={`mb-20 transition-all duration-1000 delay-500 transform ${isVisible.sectors ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] bg-clip-text text-transparent"
              style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              Our Expertise
            </h3>
            <p className="text-base text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              We serve four main sectors with specialized solutions tailored to each industry's unique requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sectors.map((sector, index) => (
              <Card key={index} className="p-6 text-center group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 bg-gradient-to-br from-white to-gray-50">
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {sector.icon}
                </div>
                <div className="text-2xl font-bold text-[#9B4F96] mb-2" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                  {sector.projects}
                </div>
                <h5 className="text-lg font-semibold mb-3 text-[#9B4F96]" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                  {sector.name}
                </h5>
                <p className="text-base text-gray-600" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                  {sector.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Company Journey Timeline */}
        <div
          id="timeline"
          data-animate
          className={`bg-gradient-to-r from-white to-purple-50 rounded-3xl p-8 mb-16 shadow-lg transition-all duration-1000 delay-600 transform ${isVisible.timeline ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] bg-clip-text text-transparent"
              style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              Our Journey
            </h3>
            <p className="text-base text-gray-600" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              10+ years of delivering excellence across UAE
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#9B4F96] to-[#c96bb3] rounded-full"></div>

            <div className="space-y-12">
              {[
                { year: '2014', title: 'Company Founded', desc: 'Al Qethaa Al Qadeema established in Sharjah', color: 'from-purple-500 to-pink-500' },
                { year: '2016', title: 'Factory Setup', desc: 'In-house factory equipped and operational', color: 'from-blue-500 to-purple-500' },
                { year: '2019', title: 'Expansion', desc: 'Extended services across all four sectors', color: 'from-pink-500 to-red-500' },
                { year: '2024', title: 'Present Day', desc: '10+ years of trusted partnerships and excellence', color: 'from-green-500 to-blue-500' }
              ].map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-white">
                      <div className={`text-2xl font-bold bg-gradient-to-r ${milestone.color} bg-clip-text text-transparent mb-2`}
                        style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                        {milestone.year}
                      </div>
                      <div className="text-lg font-semibold mb-2 text-[#9B4F96]" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                        {milestone.title}
                      </div>
                      <div className="text-base text-gray-600" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                        {milestone.desc}
                      </div>
                    </Card>
                  </div>

                  <div className={`w-6 h-6 bg-gradient-to-r ${milestone.color} rounded-full border-4 border-white shadow-lg z-10`}></div>

                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
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
      `}</style>
    </section>
  );
};

export default About;