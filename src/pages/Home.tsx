import React, { useState, useEffect } from 'react';
import Hero from '../components/sections/Hero';
import Projects from '../components/sections/Projects';
import Contact from '../components/sections/Contact';
import { clients } from '../data/clients';
import MetaTags from '../seo/MetaTags';
import StructuredData from '../seo/StructuredData';
import { getPageSEO } from '../seo/seoConfig';

const Home: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const homeSEO = getPageSEO('home');

  const processes = [
    {
      title: 'DESIGN',
      subtitle: 'Creative Vision',
      description: 'Conceptualize and plan your perfect space',
      icon: (
        <svg className="w-10 h-10 md:w-12 md:h-12 transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
        </svg>
      )
    },
    {
      title: 'DEVELOP',
      subtitle: 'Strategic Planning',
      description: 'Transform ideas into actionable plans',
      icon: (
        <svg className="w-10 h-10 md:w-12 md:h-12 transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    },
    {
      title: 'DEPLOY',
      subtitle: 'Flawless Execution',
      description: 'Bring your vision to life with precision',
      icon: (
        <svg className="w-10 h-10 md:w-12 md:h-12 transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    }
  ];

  // Auto-cycle through the processes
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % processes.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [processes.length]);

  const handleCircleClick = (index: number) => {
    setActiveIndex(index);
  };

  // Breadcrumb data for structured data
  const breadcrumbs = [
    { name: 'Home', url: 'https://www.aqdecor.com/' }
  ];

  return (
    <>
      {/* SEO Meta Tags */}
      <MetaTags
        title={homeSEO.title}
        description={homeSEO.description}
        keywords={homeSEO.keywords}
        ogImage={homeSEO.ogImage}
        ogType={homeSEO.ogType}
        canonical={homeSEO.canonical}
      />

      {/* Structured Data - Organization */}
      <StructuredData type="Organization" />

      {/* Structured Data - Local Business */}
      <StructuredData type="LocalBusiness" />

      {/* Structured Data - Breadcrumb */}
      <StructuredData type="Breadcrumb" breadcrumbs={breadcrumbs} />

      {/* Structured Data - Services */}
      <StructuredData 
        type="Service" 
        data={{
          name: "Interior Design and Fit-out Services",
          description: "Comprehensive interior design, fit-out, and exhibition solutions in Dubai",
          offers: {
            "@type": "Offer",
            "availability": "https://schema.org/InStock",
            "areaServed": {
              "@type": "City",
              "name": "Dubai"
            }
          }
        }}
      />

      <Hero />

      {/* What We Do Section - Enhanced with Auto-Cycling */}
      <section id="what-we-do" className="section bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#9B4F96] via-[#B86BB3] to-[#9B4F96] bg-clip-text text-transparent animate-gradient bg-300% leading-tight"
              style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              What We Do
              <span className="block w-48 h-1 bg-gradient-to-r from-[#9B4F96] via-[#B86BB3] to-[#9B4F96] mx-auto mt-4"></span>
            </h2>
            <p className="section-subtitle" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              Comprehensive interior design and fit-out solutions organized across three key phases of your project.
            </p>
          </div>

          {/* Three Phase Process - Enhanced DLIFE Style */}
          <div className="flex items-center justify-center flex-wrap gap-8 md:gap-16 mb-16">
            {processes.map((process, index) => (
              <React.Fragment key={process.title}>
                {/* Circle */}
                <div
                  className="group text-center cursor-pointer"
                  onClick={() => handleCircleClick(index)}
                >
                  <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-8">
                    {/* Outer glow ring for active state */}
                    <div
                      className={`absolute inset-0 rounded-full transition-all duration-700 ${activeIndex === index ? 'animate-pulse' : ''
                        }`}
                      style={{
                        backgroundColor: activeIndex === index ? '#9B4F96' : 'transparent',
                        opacity: activeIndex === index ? 0.2 : 0,
                        transform: activeIndex === index ? 'scale(1.3)' : 'scale(1)'
                      }}
                    ></div>

                    {/* Main circle */}
                    <div
                      className="relative w-full h-full rounded-full flex items-center justify-center border-2 shadow-lg transition-all duration-500 ease-in-out hover:shadow-xl"
                      style={{
                        backgroundColor: activeIndex === index ? '#9B4F96' : 'white',
                        borderColor: activeIndex === index ? '#9B4F96' : '#d1d5db',
                        transform: activeIndex === index ? 'translateY(-8px) scale(1.05)' : 'translateY(0) scale(1)'
                      }}
                    >
                      {React.cloneElement(process.icon, {
                        style: {
                          color: activeIndex === index ? 'white' : '#9B4F96'
                        }
                      })}
                    </div>

                    {/* Progress ring */}
                    <div className="absolute inset-0 rounded-full">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="48"
                          fill="none"
                          strokeWidth="2"
                          className={`transition-all duration-700 ${activeIndex === index ? 'opacity-100' : 'opacity-0'
                            }`}
                          style={{
                            stroke: '#9B4F96',
                            strokeDasharray: '301.59',
                            strokeDashoffset: activeIndex === index ? 0 : 301.59,
                            strokeLinecap: 'round'
                          }}
                        />
                      </svg>
                    </div>
                  </div>

                  <h3
                    className="text-xl md:text-2xl font-semibold transition-colors duration-300"
                    style={{
                      color: activeIndex === index ? '#9B4F96' : '#374151',
                      fontFamily: '"Lucida Bright", Georgia, serif'
                    }}
                  >
                    {process.title}
                  </h3>

                  {/* Description - shows when active */}
                  <p
                    className={`text-sm mt-2 transition-all duration-500 ${activeIndex === index ? 'opacity-100 text-gray-600' : 'opacity-0 text-transparent'
                      }`}
                    style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                  >
                    {process.description}
                  </p>
                </div>

                {/* Arrow connector */}
                {index < processes.length - 1 && (
                  <div className="hidden lg:block">
                    <svg className="w-10 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      <Projects />

      {/* Our Clients - Modern Design */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#9B4F96]/5 to-transparent rounded-full -translate-y-24 translate-x-24"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#9B4F96]/3 to-transparent rounded-full translate-y-32 -translate-x-32"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#9B4F96]/10 text-[#9B4F96] px-4 py-2 rounded-full text-sm font-medium mb-4" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              {/* <div className="w-2 h-2 bg-[#9B4F96] rounded-full animate-pulse"></div> */}
              {/* Trusted Partners */}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#9B4F96] via-[#B86BB3] to-[#9B4F96] bg-clip-text text-transparent animate-gradient bg-300% leading-tight inline-block"
              style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              Our Valued Clients
              <span className="block w-64 h-1 bg-gradient-to-r from-[#9B4F96] via-[#B86BB3] to-[#9B4F96] mx-auto mt-4"></span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              Partnering with industry leaders and innovative businesses across the UAE to create exceptional spaces that inspire success.
            </p>
          </div>

          {/* Modern Client Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {clients.map((client, index) => (
              <div
                key={client.id}
                className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-[#9B4F96]/20 hover:-translate-y-2"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Client Info */}
                <div className="space-y-4">
                  {/* Client Avatar/Initial */}
                  <div className="w-12 h-12 bg-gradient-to-br from-[#9B4F96] to-[#B86BB3] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                    {client.name.charAt(0)}
                  </div>

                  {/* Client Details */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#9B4F96] transition-colors duration-300" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                      {client.name}
                    </h3>
                    <p className="text-gray-500 text-sm flex items-center gap-1" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {client.location}
                    </p>

                    {/* Category Badge */}
                    <span className="inline-flex items-center gap-1 text-xs bg-gradient-to-r from-[#9B4F96]/10 to-[#B86BB3]/10 text-[#9B4F96] px-3 py-1.5 rounded-full border border-[#9B4F96]/20 font-medium group-hover:from-[#9B4F96]/20 group-hover:to-[#B86BB3]/20 transition-all duration-300" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                      <div className="w-1.5 h-1.5 bg-[#9B4F96] rounded-full"></div>
                      {client.category}
                    </span>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#9B4F96]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>


        </div>
      </section>

      <Contact />
    </>
  );
};

export default Home;