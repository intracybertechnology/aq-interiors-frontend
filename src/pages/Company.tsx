import React from 'react';

const Company: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Team Banner */}
      <section className="relative h-96 bg-purple-gradient flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
            TEAM OF 100+ EMPLOYEES
          </h1>
          <p className="text-xl md:text-2xl opacity-90" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
            Your Vision - Our Creation
          </p>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              WELCOME TO <span className="accent-purple">AL QETHAA AL QADEEMA</span>
            </h2>
            <p className="text-lg accent-purple font-semibold mb-8" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              #BringVisionToReality®
            </p>
            
            <div className="max-w-6xl mx-auto text-gray-700 leading-relaxed text-lg" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              <p>
                Founded in 2014 and based in Sharjah, UAE, Al Qethaa Al Qadeema L.L.C. is a trusted name in the fit-out and interior solutions industry. With our own fully equipped in-house factory, we specialize in delivering end-to-end fit-out services—from creative designs and detailed drawings to flawless execution and finishing.
              </p>
              <br />
              <p>
                Our expertise spans across  Commercial, retail, residential, healthcare & hospitality projects, where we combine precision, functionality, and style to create spaces that reflect our clients' vision. Backed by a wide range of materials and shop-fitting items, we are able to provide customized solutions that meet diverse needs with efficiency and quality.
              </p>
              <br />
              <p>
                At Al Qethaa Al Qadeema, we don't just deliver projects—we craft experiences by ensuring every detail is executed to perfection, resulting in spaces that inspire and satisfy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="section bg-purple-light">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Vision */}
            <div className="text-center lg:text-left">
              <div className="w-16 h-16 bg-purple-gradient rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Our Vision</h3>
              <p className="text-gray-700 leading-relaxed" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                To be the most trusted fit-out partner, recognized for transforming designs into reality with accuracy, innovation, and uncompromised quality—delivering spaces that meet every client's requirements and exceed their expectations.
              </p>
            </div>

            {/* Mission */}
            <div className="text-center lg:text-left">
              <div className="w-16 h-16 bg-purple-gradient rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Our Mission</h3>
              <p className="text-gray-700 leading-relaxed" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                We are committed to transforming ideas into reality through creative design, skilled craftsmanship, and complete fit-out solutions. By focusing on quality, precision, and client satisfaction, we ensure every project becomes a lasting expression of ' vision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Strengths Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="section-title" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              Core <span className="accent-purple">Strengths</span>
            </h2>
            <p className="section-subtitle" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              What makes us the trusted choice for interior design and fit-out solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                ),
                title: "In-house Factory",
                description: "Fully equipped factory for accurate and high-quality fit-out work"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                title: "Design & Execution",
                description: "Strong design and execution expertise with creative approach"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                ),
                title: "Wide Material Range",
                description: "Extensive range of materials and fittings available"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                ),
                title: "Customized Solutions",
                description: "Tailored solutions for all types of projects"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "On-time Delivery",
                description: "Reliable and consistent project outcomes within budget"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
                title: "Client Satisfaction",
                description: "Focused on client needs and satisfaction with attention to detail"
              }
            ].map((strength, index) => (
              <div key={index} className="card text-center group hover:bg-purple-50 transition-all duration-300">
                <div className="w-16 h-16 bg-purple-gradient rounded-full flex items-center justify-center mx-auto mb-6 text-white group-hover:scale-110 transition-transform duration-300">
                  {strength.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-purple-700" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                  {strength.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                  {strength.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Stats Section */}
      <section className="section bg-purple-gradient text-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="stat-card">
              <div className="stat-number text-white" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>2014</div>
              <div className="stat-label text-purple-100" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Founded</div>
            </div>
            <div className="stat-card">
              <div className="stat-number text-white" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>100+</div>
              <div className="stat-label text-purple-100" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Team Members</div>
            </div>
            <div className="stat-card">
              <div className="stat-number text-white" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>1000+</div>
              <div className="stat-label text-purple-100" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Projects Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-number text-white" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>24/7</div>
              <div className="stat-label text-purple-100" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Contact Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              Our <span className="accent-purple">Headquarters</span>
            </h2>
            <p className="section-subtitle" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              Based in Sharjah, UAE - Serving clients across the Emirates
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Al Qethaa Al Qadeema L.L.C.</h3>
              <div className="space-y-4 text-gray-700" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-purple-600 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Sharjah, United Arab Emirates</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-purple-600 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  <span>Fully Equipped In-house Factory</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-purple-600 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                  <span>• Commercial • Retail • Residential • Hospitality</span>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-light p-8 rounded-xl">
              <h4 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Why Choose Us?</h4>
              <ul className="space-y-3 text-gray-700" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>End-to-end fit-out services from design to execution</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Own manufacturing facility ensuring quality control</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Experienced team of 100+ skilled professionals</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Proven track record since 2014</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Company;