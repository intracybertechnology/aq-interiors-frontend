import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const footerLinks = {
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Our Services', path: '/services' },
      { name: 'Projects', path: '/projects' },
      { name: 'Contact Us', path: '/contact' }
    ],
    services: [
      { name: 'Interior Design', path: '/services' },
      { name: 'Complete Fit-out', path: '/services' },
      { name: 'Shop Fittings', path: '/services' },
      { name: 'MEP Services', path: '/services' }
    ]
  };

  const socialLinks = {
    instagram: 'https://www.instagram.com/aqdecor/',
    facebook: 'https://www.facebook.com/people/AQ-DECOR/61579449876941/',
    linkedin: 'https://www.linkedin.com/company/aqdecor'
  };

  return (
    <footer className="text-white bg-[#9B4F96]">
      <div className="container-max py-12 px-8 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">AL QETHAA AL QADEEMA</h3>
            <p className="text-base text-white/90 mb-4 leading-relaxed">
              Your trusted partner in fit-out and interior solutions since 2014. Quality craftsmanship backed by our in-house factory.
            </p>
            <div className="flex space-x-4">
              <a 
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors duration-300 hover:scale-110 transform"
                aria-label="Visit our Facebook page"
              >
                <Facebook size={20} />
              </a>
              <a 
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors duration-300 hover:scale-110 transform"
                aria-label="Visit our Instagram page"
              >
                <Instagram size={20} />
              </a>
              <a 
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors duration-300 hover:scale-110 transform"
                aria-label="Visit our LinkedIn page"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => handleNavigation(link.path)}
                    className="text-base text-white/90 hover:text-white hover:underline underline-offset-4 transition-all duration-300"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h4 className="text-lg font-bold mb-4">Our Services</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((service) => (
                <li key={service.path}>
                  <button
                    onClick={() => handleNavigation(service.path)}
                    className="text-base text-white/90 hover:text-white hover:underline underline-offset-4 transition-all duration-300"
                  >
                    {service.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="text-white flex-shrink-0 mt-1" size={18} />
                <span className="text-base text-white/90">
                  Sharjah, United Arab Emirates
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="text-white flex-shrink-0 mt-1" size={18} />
                <a href="tel:+971561001190" 
                   className="text-base text-white/90 hover:text-white hover:underline underline-offset-4 transition-all duration-300">
                  +971 56 100 1190
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="text-white flex-shrink-0 mt-1" size={18} />
                <a href="mailto:sales@aqdecor.com"
                   className="text-base text-white/90 hover:text-white hover:underline underline-offset-4 transition-all duration-300">
                  sales@aqdecor.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-base text-white/80">
              &copy; {new Date().getFullYear()} Al Qethaa Al Qadeema L.L.C. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <button className="text-base text-white/80 hover:text-white transition-colors duration-300">
                Privacy Policy
              </button>
              <button className="text-base text-white/80 hover:text-white transition-colors duration-300">
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;