'use client'

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ChevronDown, ArrowRight, X, Menu, Facebook, Instagram, Linkedin } from 'lucide-react';
import DropDownPortal from '@/components/ui/DropDownPortal';

const Navbar: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownTriggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  const servicesData = {
    design:  ['Interior Designing', 'MEP', 'Shop Front Signage', 'Light Boxes', 'Exhibition Stand'],
    develop: ['Fit-out', 'Flooring & Ceiling', 'Partition & Painting', 'Shop Front Glass', 'Office Furniture', 'Painted Furniture'],
    deploy:  ['Mannequins Repainting', 'Acrylic Products', 'Slat Boards & Accessories', 'Stainless Steel Stand', 'Glass Counter', 'Reception Counter', 'Kiosk'],
  };

  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = () => setDropdownOpen(false);
    const handleScroll = () => setDropdownOpen(false);
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('scroll', handleScroll);
    };
  }, [dropdownOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      document.body.style.overflow = 'unset';
      return;
    }
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        !document.querySelector('.mobile-menu')?.contains(target) &&
        !document.querySelector('.mobile-menu-button')?.contains(target)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.addEventListener('click', handleClickOutside), 100);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  const getNavbarClasses = () => {
    const baseClasses = 'transition-all duration-700 ease-in-out';
    if (isHomePage) {
      return isScrolled
        ? `${baseClasses} bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50`
        : `${baseClasses} bg-transparent`;
    }
    return `${baseClasses} bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50`;
  };

  const getTextColor = isHomePage && !isScrolled ? 'text-white' : 'text-gray-900';

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
  };

  const NavLink = ({ href, children }: { href: string; children: string }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        aria-current={isActive ? 'page' : undefined}
        className={`relative text-sm xl:text-base font-semibold uppercase tracking-wider transition-all duration-500 ${getTextColor} whitespace-nowrap group px-2 py-2 rounded-md`}
      >
        <span className="relative z-20 group-hover:text-white transition-colors duration-500">
          {children}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-md z-10" />
        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#9B4F96] group-hover:w-full transition-all duration-500 z-10" />
      </Link>
    );
  };

  const SocialLinks = ({ iconSize = 18 }: { iconSize?: number }) => (
    <>
      <a
        href="https://facebook.com/people/AQ-DECOR/61579449876941/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit AQ Decor on Facebook (opens in new tab)"
        className={`p-2 rounded-full hover:bg-[#9B4F96] transition-all duration-300 ${getTextColor} hover:text-white`}
      >
        <Facebook size={iconSize} aria-hidden="true" />
      </a>
      <a
        href="https://www.instagram.com/aqdecor/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit AQ Decor on Instagram (opens in new tab)"
        className={`p-2 rounded-full hover:bg-[#9B4F96] transition-all duration-300 ${getTextColor} hover:text-white`}
      >
        <Instagram size={iconSize} aria-hidden="true" />
      </a>
      <a
        href="https://www.linkedin.com/company/aqdecor/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit AQ Decor on LinkedIn (opens in new tab)"
        className={`p-2 rounded-full hover:bg-[#9B4F96] transition-all duration-300 ${getTextColor} hover:text-white`}
      >
        <Linkedin size={iconSize} aria-hidden="true" />
      </a>
    </>
  );

  return (
    <>
      <nav
        aria-label="Main navigation"
        className={`fixed top-0 left-0 right-0 z-50 w-full ${getNavbarClasses()}`}
      >
        <div className="h-16 sm:h-20 lg:h-24 px-4 sm:px-6 lg:px-16 flex items-center">
          <div className="max-w-full w-full mx-auto flex items-center justify-between">

            {/* ── Logo ── */}
            <div className="flex items-center flex-shrink-0 overflow-hidden max-w-[65%] sm:max-w-[75%] lg:max-w-none">
              <Link href="/" aria-label="AQ Decor - Go to homepage" className="flex items-center h-full group">
                <Image
                  src="/images/logo/aq-logo.png"
                  alt="AQ Decor logo"
                  width={350}
                  height={96}
                  className="h-14 sm:h-16 md:h-24 lg:h-24 object-contain transition-all duration-700 group-hover:scale-105"
                  style={{ width: 'auto', maxWidth: '350px', maxHeight: '100%' }}
                  priority
                  draggable={false}
                />
                <div className="hidden sm:block ml-3 md:ml-4 lg:ml-4 px-3 md:px-6 py-1.5 md:py-2.5 rounded-lg shadow-md bg-[#B5B9BD]">
                  <span className="font-bold text-xs sm:text-sm md:text-lg lg:text-xl whitespace-nowrap flex items-center h-full text-[#1F2937]">
                    AL QETHAA AL QADEEMA
                  </span>
                </div>
              </Link>
            </div>

            {/* ── Desktop Navigation ── */}
            <div className="hidden lg:flex items-center justify-center flex-1">
              <div className="flex items-center space-x-2 xl:space-x-3">
                <NavLink href="/">Home</NavLink>
                <NavLink href="/company">About Us</NavLink>

                {/* What We Do Dropdown */}
                <div className="relative group">
                  <button
                    ref={dropdownTriggerRef}
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                    aria-controls="services-dropdown"
                    className={`relative text-sm xl:text-base font-semibold uppercase tracking-wider transition-all duration-500 flex items-center space-x-2 ${getTextColor} whitespace-nowrap px-2 py-2 rounded-md`}
                    onMouseEnter={() => setDropdownOpen(true)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(!dropdownOpen);
                    }}
                  >
                    <span className="relative z-20 group-hover:text-white transition-colors duration-500">
                      What We Do
                    </span>
                    <ChevronDown
                      size={16}
                      aria-hidden="true"
                      className={`relative z-20 transition-all duration-500 group-hover:text-white ${dropdownOpen ? 'rotate-180 scale-110' : ''}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-md z-10" />
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#9B4F96] group-hover:w-full transition-all duration-500 z-10" />
                  </button>

                  <DropDownPortal isOpen={dropdownOpen} triggerRef={dropdownTriggerRef as React.RefObject<HTMLElement>}>
                    <div
                      id="services-dropdown"
                      role="menu"
                      aria-label="Services menu"
                      className="p-8"
                      onMouseEnter={() => setDropdownOpen(true)}
                      onMouseLeave={() => setDropdownOpen(false)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="grid grid-cols-3 gap-x-12 gap-y-0">
                        {[
                          { title: 'Design',  items: servicesData.design },
                          { title: 'Develop', items: servicesData.develop },
                          { title: 'Deploy',  items: servicesData.deploy },
                        ].map((category) => (
                          <div key={category.title}>
                            <p className="text-xs font-bold text-[#9B4F96] uppercase tracking-widest mb-3">
                              {category.title}
                            </p>
                            <ul className="space-y-2.5 w-full" role="none">
                              {category.items.map((service) => (
                                <li key={service} role="none" className="transform transition-all duration-300 hover:translate-x-2">
                                  <Link
                                    href="/services"
                                    role="menuitem"
                                    className="text-gray-700 text-sm hover:text-[#9B4F96] transition-all duration-300 block relative group/item leading-tight pl-4"
                                    onClick={() => setDropdownOpen(false)}
                                  >
                                    <span aria-hidden="true" className="absolute left-0 top-[6px] w-2 h-2 bg-[#9B4F96]/30 rounded-full group-hover/item:bg-[#9B4F96] group-hover/item:scale-125 transition-all duration-300" />
                                    {service}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <Link
                          href="/services"
                          role="menuitem"
                          className="w-full bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] hover:from-[#8a4687] hover:to-[#b85ca4] text-white px-4 py-3 rounded-lg text-center font-semibold transition-all duration-500 flex items-center justify-center space-x-2 transform hover:scale-105 hover:shadow-lg"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <span>View All Services</span>
                          <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </DropDownPortal>
                </div>

                <NavLink href="/projects">Projects</NavLink>
                <NavLink href="/blog">Blog</NavLink>
                <NavLink href="/contact">Contact</NavLink>

                {/* Social Media */}
                <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-300" aria-label="Social media links">
                  <SocialLinks iconSize={18} />
                </div>
              </div>
            </div>

            {/* ── Mobile Menu Button ── */}
            <div className="flex lg:hidden flex-shrink-0 ml-auto">
              <button
                className={`mobile-menu-button p-2 transition-all duration-500 hover:bg-[#9B4F96]/10 rounded-lg ${getTextColor} flex items-center justify-center`}
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {mobileMenuOpen
                  ? <X className="w-7 h-7" aria-hidden="true" />
                  : <Menu className="w-7 h-7" aria-hidden="true" />
                }
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu Overlay ── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile Menu ── */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-label="Mobile navigation menu"
        aria-modal="true"
        className={`mobile-menu fixed top-16 sm:top-20 right-0 w-full xs:w-80 sm:w-96 h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] bg-white/98 backdrop-blur-lg shadow-2xl z-50 transform transition-all duration-300 lg:hidden overflow-y-auto ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <nav aria-label="Mobile navigation" className="space-y-2 sm:space-y-4">
            {[
              { name: 'Home',     path: '/' },
              { name: 'About Us', path: '/company' },
              { name: 'Projects', path: '/projects' },
              { name: 'Blog',     path: '/blog' },
              { name: 'Contact',  path: '/contact' },
            ].map((item) => (
              <Link
                key={item.path}
                href={item.path}
                aria-current={pathname === item.path ? 'page' : undefined}
                className="block text-base sm:text-lg font-semibold text-gray-900 hover:text-[#9B4F96] transition-colors duration-300 py-2 sm:py-3 border-b border-gray-200"
                onClick={handleMobileMenuClose}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile Services Dropdown */}
            <div className="border-b border-gray-200">
              <button
                aria-expanded={mobileServicesOpen}
                aria-controls="mobile-services-menu"
                className="flex items-center justify-between w-full text-base sm:text-lg font-semibold text-gray-900 hover:text-[#9B4F96] transition-colors duration-300 py-2 sm:py-3"
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              >
                What We Do
                <ChevronDown
                  aria-hidden="true"
                  className={`w-5 h-5 transition-transform duration-300 ${mobileServicesOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <div
                id="mobile-services-menu"
                className={`overflow-hidden transition-all duration-300 ${
                  mobileServicesOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <ul className="pl-3 sm:pl-4 pb-3 sm:pb-4 space-y-1.5 sm:space-y-2">
                  {[...servicesData.design, ...servicesData.develop, ...servicesData.deploy]
                    .slice(0, 8)
                    .map((service) => (
                      <li key={service}>
                        <Link
                          href="/services"
                          className="text-xs sm:text-sm text-gray-600 hover:text-[#9B4F96] transition-colors duration-300 block py-1"
                          onClick={handleMobileMenuClose}
                        >
                          • {service}
                        </Link>
                      </li>
                    ))}
                </ul>

                <Link
                  href="/services"
                  className="inline-flex items-center justify-center w-full bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] hover:from-[#8a4687] hover:to-[#b85ca4] text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 transform hover:scale-105 mt-3 sm:mt-4"
                  onClick={handleMobileMenuClose}
                >
                  View All Services
                  <ArrowRight size={14} className="ml-2" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </nav>

          {/* Social Media - Mobile */}
          <div className="pt-4 sm:pt-6 border-t border-gray-200">
            <div className="flex justify-center space-x-4 mb-4" aria-label="Social media links">
              <a
                href="https://facebook.com/people/AQ-DECOR/61579449876941/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit AQ Decor on Facebook (opens in new tab)"
                className="p-2.5 rounded-full bg-gray-100 hover:bg-[#9B4F96] text-gray-700 hover:text-white transition-all duration-300"
              >
                <Facebook size={20} aria-hidden="true" />
              </a>
              <a
                href="https://www.instagram.com/aqdecor/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit AQ Decor on Instagram (opens in new tab)"
                className="p-2.5 rounded-full bg-gray-100 hover:bg-[#9B4F96] text-gray-700 hover:text-white transition-all duration-300"
              >
                <Instagram size={20} aria-hidden="true" />
              </a>
              <a
                href="https://www.linkedin.com/company/aqdecor"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit AQ Decor on LinkedIn (opens in new tab)"
                className="p-2.5 rounded-full bg-gray-100 hover:bg-[#9B4F96] text-gray-700 hover:text-white transition-all duration-300"
              >
                <Linkedin size={20} aria-hidden="true" />
              </a>
            </div>

            <div className="text-center">
              <p className="text-base sm:text-lg font-bold text-[#9B4F96] mb-3 sm:mb-4">
                Get In Touch
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center w-full bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] hover:from-[#8a4687] hover:to-[#b85ca4] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
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
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Navbar;