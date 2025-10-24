'use client'

import React from 'react';
import { services } from '@/data/services';
import Card from '@/components/ui/Card';
import { CheckCircle } from 'lucide-react';

const Services: React.FC = () => {

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
    <section id="services" className="pt-24 pb-16 bg-white">
      <div className="container mx-auto px-4 lg:px-8">

        <div className="text-center mb-16">
          <div className="relative inline-block mb-6">
            <h1 className="text-4xl md:text-5xl font-bold"
              style={{ fontFamily: '"Lucida Bright", Georgia, serif', color: '#9B4F96' }}>
              What We Do
            </h1>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] rounded-full"></div>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mt-8"
            style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
            Comprehensive interior design and fit-out solutions for commercial, retail, residential, healthcare & hospitality projects across UAE. From design to execution - all with our in-house factory advantage.
          </p>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">

          <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
            <div className="w-20 h-20 bg-[#9B4F96]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-10 h-10 bg-[#9B4F96] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>D</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-[#9B4F96] mb-4 text-center"
              style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              DESIGN
            </h2>
            <p className="text-base text-gray-600 mb-6 text-center"
              style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              Creative concepts and detailed planning
            </p>
            <ul className="text-gray-600 space-y-3">
              {['Interior Designing', 'MEP Planning', 'Shop Front Signage', 'Light Boxes', 'Exhibition Stand'].map((item, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <CheckCircle className="text-[#9B4F96] flex-shrink-0 mt-1" size={18} />
                  <span className="text-base" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>


          <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
            <div className="w-20 h-20 bg-[#9B4F96]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-10 h-10 bg-[#9B4F96] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>D</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-[#9B4F96] mb-4 text-center"
              style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              DEVELOP
            </h2>
            <p className="text-base text-gray-600 mb-6 text-center"
              style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              Construction and fit-out execution
            </p>
            <ul className="text-gray-600 space-y-3">
              {['Complete Fit-out', 'Flooring & Ceiling', 'Partition & Painting', 'Shop Front Glass', 'Office Furniture', 'Painted Furniture'].map((item, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <CheckCircle className="text-[#9B4F96] flex-shrink-0 mt-1" size={18} />
                  <span className="text-base" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
            <div className="w-20 h-20 bg-[#9B4F96]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-10 h-10 bg-[#9B4F96] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>D</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-[#9B4F96] mb-4 text-center"
              style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              DEPLOY
            </h2>
            <p className="text-base text-gray-600 mb-6 text-center"
              style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              Finishing touches and specialized items
            </p>
            <ul className="text-gray-600 space-y-3">
              {['Mannequins Repainting', 'Acrylic Products', 'Slat Boards & Accessories', 'Stainless Steel Stand', 'Glass Counter', 'Reception Counter', 'Kiosk'].map((item, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <CheckCircle className="text-[#9B4F96] flex-shrink-0 mt-1" size={18} />
                  <span className="text-base" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center mb-16">
          <button
            onClick={() => scrollToSection('contact')}
            className="px-8 py-3 bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
          >
            View All Services
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {services.map((service) => (
            <Card key={service.id} className="p-8 h-full" hover>
              <div className="flex items-start space-x-6 h-full">
                <div className="w-16 h-16 bg-[#9B4F96]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <div className="w-8 h-8 bg-[#9B4F96] rounded-lg"></div>
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-4"
                    style={{ fontFamily: '"Lucida Bright", Georgia, serif', color: '#9B4F96' }}>
                    {service.title}
                  </h3>
                  <p className="text-base text-gray-600 mb-6 leading-relaxed"
                    style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                    {service.description}
                  </p>

                  <div className="space-y-4">
                    <h4 className="font-semibold"
                      style={{ fontFamily: '"Lucida Bright", Georgia, serif', color: '#9B4F96' }}>
                      What's Included:
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-2">
                          <CheckCircle className="text-[#9B4F96] flex-shrink-0 mt-0.5" size={16} />
                          <span className="text-gray-600 text-sm"
                            style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>


        <div className="bg-gray-50 rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4"
              style={{ fontFamily: '"Lucida Bright", Georgia, serif', color: '#9B4F96' }}>
              Our In-house Factory Advantage
            </h2>
            <p className="text-base text-gray-600 max-w-3xl mx-auto leading-relaxed"
              style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              Unlike other companies, we have our own fully equipped factory in Sharjah, giving us complete control over quality, timelines, and costs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-600" size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2"
                style={{ fontFamily: '"Lucida Bright", Georgia, serif', color: '#9B4F96' }}>
                Quality Control
              </h3>
              <p className="text-base text-gray-600"
                style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                Every piece manufactured under our direct supervision with strict quality standards.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2"
                style={{ fontFamily: '"Lucida Bright", Georgia, serif', color: '#9B4F96' }}>
                Faster Delivery
              </h3>
              <p className="text-base text-gray-600"
                style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                No dependency on external suppliers means faster project completion.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2"
                style={{ fontFamily: '"Lucida Bright", Georgia, serif', color: '#9B4F96' }}>
                Cost Effective
              </h3>
              <p className="text-base text-gray-600"
                style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                Direct manufacturing eliminates middleman costs, offering better value.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;