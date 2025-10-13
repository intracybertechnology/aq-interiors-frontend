import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ArrowRight, X, Menu, Facebook, Instagram, Linkedin } from 'lucide-react';
import DropdownPortal from '../ui/DropdownPortal';

const Navbar: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownTriggerRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();

  // Services data organized by categories
  const servicesData = {
    design: [
      'Interior Designing',
      'MEP',
      'Shop Front Signage',
      'Light Boxes',
      'Exhibition Stand'
    ],
    develop: [
      'Fit-out',
      'Flooring & Ceiling',
      'Partition & Painting',
      'Shop Front Glass',
      'Office Furniture',
      'Painted Furniture'
    ],
    deploy: [
      'Mannequins Repainting',
      'Acrylic Products',
      'Slat Boards & Accessories',
      'Stainless Steel Stand',
      'Glass Counter',
      'Reception Counter',
      'Kiosk'
    ]
  };

  const isHomePage = location.pathname === '/';

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close dropdown when clicking outside or scrolling
  useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(false);
    const handleScroll = () => setDropdownOpen(false);

    if (dropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('scroll', handleScroll);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('scroll', handleScroll);
    };
  }, [dropdownOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const mobileMenuElement = document.querySelector('.mobile-menu');
      const mobileMenuButton = document.querySelector('.mobile-menu-button');

      if (mobileMenuOpen &&
        !mobileMenuElement?.contains(target) &&
        !mobileMenuButton?.contains(target)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
  }, [location]);

  const getNavbarClasses = () => {
    if (isHomePage) {
      return isScrolled
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50'
        : 'bg-transparent';
    } else {
      return 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50';
    }
  };

  const getTextColor = () => {
    if (isHomePage) {
      return isScrolled ? 'text-gray-900' : 'text-white';
    } else {
      return 'text-gray-900';
    }
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Lucida+Bright:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      <nav className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-700 ease-in-out ${getNavbarClasses()}`}>
        {/* Mobile: h-16, Tablet: h-18, Desktop: h-20 */}
        <div className="h-16 sm:h-18 lg:h-20 px-4 sm:px-6 lg:px-16 flex items-center">
          <div className="max-w-full w-full mx-auto flex items-center justify-between">
            {/* Logo - Responsive sizing */}
            <div className="flex items-center flex-shrink-0 overflow-hidden max-w-[65%] sm:max-w-[75%] lg:max-w-none">
              <Link to="/" className="flex items-center h-full group">
                <img
                  src="/images/logo/aq-logo.png"
                  alt="AQ Decor"
                  className="h-12 sm:h-12 md:h-20 lg:h-22 w-auto object-contain transition-all duration-700 group-hover:scale-105"
                  style={{ maxWidth: '250px', maxHeight: '100%' }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />

                {/* Company Name - Hidden on small mobile, visible from sm breakpoint */}
                <div className="hidden sm:block ml-3 md:ml-4 lg:ml-4 px-3 md:px-6 py-1.5 md:py-2.5 rounded-lg shadow-md" style={{ backgroundColor: '#E5E7EB' }}>
                  <span
                    className="font-bold text-xs sm:text-sm md:text-lg lg:text-xl whitespace-nowrap flex items-center h-full"
                    style={{
                      fontFamily: '"Lucida Bright", Georgia, serif',
                      color: '#1F2937'
                    }}
                  >
                    AL QETHAA AL QADEEMA
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-center flex-1">
              <div className="flex items-center space-x-2 xl:space-x-3">
                <Link
                  to="/"
                  className={`relative text-sm xl:text-base font-semibold uppercase tracking-wider transition-all duration-500 ${getTextColor()} whitespace-nowrap group px-2 py-2 rounded-md`}
                  style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                >
                  <span className="relative z-20 group-hover:text-white transition-colors duration-500">HOME</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-md z-10"></div>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#9B4F96] group-hover:w-full transition-all duration-500 z-10"></div>
                </Link>

                <Link
                  to="/about"
                  className={`relative text-sm xl:text-base font-semibold uppercase tracking-wider transition-all duration-500 ${getTextColor()} whitespace-nowrap group px-2 py-2 rounded-md`}
                  style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                >
                  <span className="relative z-20 group-hover:text-white transition-colors duration-500">ABOUT US</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-md z-10"></div>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#9B4F96] group-hover:w-full transition-all duration-500 z-10"></div>
                </Link>

                {/* What We Do Dropdown */}
                <div className="relative group">
                  <button
                    ref={dropdownTriggerRef}
                    className={`relative text-sm xl:text-base font-semibold uppercase tracking-wider transition-all duration-500 flex items-center space-x-2 ${getTextColor()} whitespace-nowrap px-2 py-2 rounded-md`}
                    style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                    onMouseEnter={() => setDropdownOpen(true)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(!dropdownOpen);
                    }}
                  >
                    <span className="relative z-20 group-hover:text-white transition-colors duration-500">WHAT WE DO</span>
                    <ChevronDown size={16} className={`relative z-20 transition-all duration-500 group-hover:text-white ${dropdownOpen ? 'rotate-180 scale-110' : ''}`} />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-md z-10"></div>
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#9B4F96] group-hover:w-full transition-all duration-500 z-10"></div>
                  </button>

                  <DropdownPortal
                    isOpen={dropdownOpen}
                    triggerRef={dropdownTriggerRef}
                  >
             
                    <div
                      className="p-8"
                      onMouseEnter={() => setDropdownOpen(true)}
                      onMouseLeave={() => setDropdownOpen(false)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="grid grid-cols-3 gap-x-12 gap-y-0">
                        {/* Column 1 - Design Services */}
                        <div>
                          <ul className="space-y-2.5 w-full">
                            {servicesData.design.map((service, index) => (
                              <li key={index} className="transform transition-all duration-300 hover:translate-x-2">
                                <Link
                                  to="/services"
                                  className="text-gray-700 text-sm hover:text-[#9B4F96] transition-all duration-300 block relative group/item leading-tight pl-4"
                                  style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                                  onClick={() => setDropdownOpen(false)}
                                >
                                  <span className="absolute left-0 top-[6px] w-2 h-2 bg-[#9B4F96]/30 rounded-full group-hover/item:bg-[#9B4F96] group-hover/item:scale-125 transition-all duration-300"></span>
                                  {service}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Column 2 - Develop Services */}
                        <div>
                          <ul className="space-y-2.5 w-full">
                            {servicesData.develop.map((service, index) => (
                              <li key={index} className="transform transition-all duration-300 hover:translate-x-2">
                                <Link
                                  to="/services"
                                  className="text-gray-700 text-sm hover:text-[#9B4F96] transition-all duration-300 block relative group/item leading-tight pl-4"
                                  style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                                  onClick={() => setDropdownOpen(false)}
                                >
                                  <span className="absolute left-0 top-[6px] w-2 h-2 bg-[#9B4F96]/30 rounded-full group-hover/item:bg-[#9B4F96] group-hover/item:scale-125 transition-all duration-300"></span>
                                  {service}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Column 3 - Deploy Services */}
                        <div>
                          <ul className="space-y-2.5 w-full">
                            {servicesData.deploy.map((service, index) => (
                              <li key={index} className="transform transition-all duration-300 hover:translate-x-2">
                                <Link
                                  to="/services"
                                  className="text-gray-700 text-sm hover:text-[#9B4F96] transition-all duration-300 block relative group/item leading-tight pl-4"
                                  style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                                  onClick={() => setDropdownOpen(false)}
                                >
                                  <span className="absolute left-0 top-[6px] w-2 h-2 bg-[#9B4F96]/30 rounded-full group-hover/item:bg-[#9B4F96] group-hover/item:scale-125 transition-all duration-300"></span>
                                  {service}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <Link
                          to="/services"
                          className="w-full bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] hover:from-[#8a4687] hover:to-[#b85ca4] text-white px-4 py-3 rounded-lg text-center font-semibold transition-all duration-500 flex items-center justify-center space-x-2 transform hover:scale-105 hover:shadow-lg"
                          style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                          onClick={() => setDropdownOpen(false)}
                        >
                          <span>View All Services</span>
                          <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </DropdownPortal>
                </div>

                <Link
                  to="/projects"
                  className={`relative text-sm xl:text-base font-semibold uppercase tracking-wider transition-all duration-500 ${getTextColor()} whitespace-nowrap group px-2 py-2 rounded-md`}
                  style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                >
                  <span className="relative z-20 group-hover:text-white transition-colors duration-500">PROJECTS</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-md z-10"></div>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#9B4F96] group-hover:w-full transition-all duration-500 z-10"></div>
                </Link>

                <Link
                  to="/blogs"
                  className={`relative text-sm xl:text-base font-semibold uppercase tracking-wider transition-all duration-500 ${getTextColor()} whitespace-nowrap group px-2 py-2 rounded-md`}
                  style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                >
                  <span className="relative z-20 group-hover:text-white transition-colors duration-500">BLOG</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-md z-10"></div>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#9B4F96] group-hover:w-full transition-all duration-500 z-10"></div>
                </Link>

                <Link
                  to="/contact"
                  className={`relative text-sm xl:text-base font-semibold uppercase tracking-wider transition-all duration-500 ${getTextColor()} whitespace-nowrap group px-2 py-2 rounded-md`}
                  style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                >
                  <span className="relative z-20 group-hover:text-white transition-colors duration-500">CONTACT</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-md z-10"></div>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#9B4F96] group-hover:w-full transition-all duration-500 z-10"></div>
                </Link>

                {/* Social Media */}
                <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-300">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-full hover:bg-[#9B4F96] transition-all duration-300 ${getTextColor()} hover:text-white`}
                    aria-label="Facebook"
                  >
                    <Facebook size={18} />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-full hover:bg-[#9B4F96] transition-all duration-300 ${getTextColor()} hover:text-white`}
                    aria-label="Instagram"
                  >
                    <Instagram size={18} />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-full hover:bg-[#9B4F96] transition-all duration-300 ${getTextColor()} hover:text-white`}
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={18} />
                  </a>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button - Always visible on mobile/tablet */}
            <div className=" flex lg:hidden flex-shrink-0 ml-auto">
              <button
                className={`mobile-menu-button p-2 transition-all duration-500 hover:bg-[#9B4F96]/10 rounded-lg ${getTextColor()} flex items-center justify-center`}
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-7 h-7 transition-transform duration-300" />
                ) : (
                  <Menu className="w-7 h-7 transition-transform duration-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu - Responsive width */}
      <div
        className={`mobile-menu fixed top-16 sm:top-18 right-0 w-full xs:w-80 sm:w-96 h-[calc(100vh-4rem)] sm:h-[calc(100vh-4.5rem)] bg-white/98 backdrop-blur-lg shadow-2xl z-50 transform transition-all duration-300 ease-in-out lg:hidden overflow-y-auto ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="space-y-2 sm:space-y-4">
            <Link
              to="/"
              className="block text-base sm:text-lg font-semibold text-gray-900 hover:text-[#9B4F96] transition-colors duration-300 py-2 sm:py-3 border-b border-gray-200"
              style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
              onClick={handleMobileMenuClose}
            >
              HOME
            </Link>

            <Link
              to="/about"
              className="block text-base sm:text-lg font-semibold text-gray-900 hover:text-[#9B4F96] transition-colors duration-300 py-2 sm:py-3 border-b border-gray-200"
              style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
              onClick={handleMobileMenuClose}
            >
              ABOUT US
            </Link>

            {/* Mobile Services Dropdown */}
            <div className="border-b border-gray-200">
              <button
                className="flex items-center justify-between w-full text-base sm:text-lg font-semibold text-gray-900 hover:text-[#9B4F96] transition-colors duration-300 py-2 sm:py-3"
                style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              >
                WHAT WE DO
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${mobileServicesOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${mobileServicesOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="pl-3 sm:pl-4 pb-3 sm:pb-4 space-y-2">
                  <ul className="space-y-1.5 sm:space-y-2">
                    {[...servicesData.design, ...servicesData.develop, ...servicesData.deploy].slice(0, 8).map((service, index) => (
                      <li key={index}>
                        <Link
                          to="/services"
                          className="text-xs sm:text-sm text-gray-600 hover:text-[#9B4F96] transition-colors duration-300 block py-1"
                          style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                          onClick={handleMobileMenuClose}
                        >
                          • {service}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/services"
                    className="inline-flex items-center justify-center w-full bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] hover:from-[#8a4687] hover:to-[#b85ca4] text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 transform hover:scale-105 mt-3 sm:mt-4"
                    style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                    onClick={handleMobileMenuClose}
                  >
                    View All Services
                    <ArrowRight size={14} className="ml-2" />
                  </Link>
                </div>
              </div>
            </div>

            <Link
              to="/projects"
              className="block text-base sm:text-lg font-semibold text-gray-900 hover:text-[#9B4F96] transition-colors duration-300 py-2 sm:py-3 border-b border-gray-200"
              style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
              onClick={handleMobileMenuClose}
            >
              PROJECTS
            </Link>

            <Link
              to="/blogs"
              className="block text-base sm:text-lg font-semibold text-gray-900 hover:text-[#9B4F96] transition-colors duration-300 py-2 sm:py-3 border-b border-gray-200"
              style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
              onClick={handleMobileMenuClose}
            >
              BLOG
            </Link>

            <Link
              to="/contact"
              className="block text-base sm:text-lg font-semibold text-gray-900 hover:text-[#9B4F96] transition-colors duration-300 py-2 sm:py-3"
              style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
              onClick={handleMobileMenuClose}
            >
              CONTACT
            </Link>
          </div>

          {/* Social Media Links - Mobile */}
          <div className="pt-4 sm:pt-6 border-t border-gray-200">
            <div className="flex justify-center space-x-4 mb-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-gray-100 hover:bg-[#9B4F96] text-gray-700 hover:text-white transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-gray-100 hover:bg-[#9B4F96] text-gray-700 hover:text-white transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-gray-100 hover:bg-[#9B4F96] text-gray-700 hover:text-white transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>

            <div className="text-center">
              <h3 className="text-base sm:text-lg font-bold text-[#9B4F96] mb-3 sm:mb-4" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                Get In Touch
              </h3>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center w-full bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] hover:from-[#8a4687] hover:to-[#b85ca4] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                onClick={handleMobileMenuClose}
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Dropdown Overlay */}
      {dropdownOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/5 hidden lg:block"
          onClick={() => setDropdownOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;