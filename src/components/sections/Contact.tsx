'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Phone, Mail, Clock, Send, Factory, Award, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import type { ContactForm } from '@/types';
import { validateUAEPhone, getPhoneExample } from '@/utils/phoneValidator';
import contactApi from '@/services/contactApi';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    message: '',
    service: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (submitSuccess || submitError) {
      setSubmitSuccess(false);
      setSubmitError('');
    }

    if (name === 'phone') {
      if (value.trim() === '') {
        setPhoneError('');
      } else {
        const validation = validateUAEPhone(value);
        setPhoneError(validation.isValid ? '' : validation.message);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(false);
    setSubmitError('');

    if (formData.phone.trim() === '') {
      setPhoneError('Phone number is required');
      return;
    }

    const phoneValidation = validateUAEPhone(formData.phone);
    if (!phoneValidation.isValid) {
      setPhoneError(phoneValidation.message);
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await contactApi.submitEnquiry({
        fullName: formData.name,
        emailAddress: formData.email,
        phoneNumber: formData.phone,
        serviceInterestedIn: formData.service || undefined,
        projectDetails: formData.message
      });

      if (data.success) {
        setSubmitSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          service: ''
        });
        setPhoneError('');
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        setSubmitError(data.message || 'Failed to submit. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: ['+971 56 100 1190', 'Call us anytime'],
      href: 'tel:+971561001190',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['sales@aqdecor.com', 'Get in touch'],
      href: 'mailto:sales@aqdecor.com',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: ['Mon-Fri: 8AM-6PM', 'Sat: 9AM-2PM'],
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const whyChooseUs = [
    { icon: Factory, text: 'In-house Factory for Quality Control' },
    { icon: Award, text: '10+ Years Trusted Experience (Since 2014)' },
    { icon: CheckCircle, text: 'End-to-end Fit-out Solutions' },
    { icon: CheckCircle, text: '4 Key Sectors Coverage' },
    { icon: CheckCircle, text: 'Skilled Craftsmanship & Attention to Detail' },
    { icon: CheckCircle, text: 'On-time Delivery Within Budget' },
    { icon: CheckCircle, text: 'Wide Range of Materials Available' },
    { icon: CheckCircle, text: 'Customized Solutions for All Projects' }
  ];

  const services = [
    'Interior Design & Fit-out',
    'Residential Projects',
    'Commercial Fit-out',
    'Retail Shop Fittings',
    'Hospitality Design',
    'MEP Services',
    'Shop Front Signage',
    'Light Boxes',
    'Exhibition Stands',
    'Flooring & Ceiling',
    'Partition & Painting',
    'Office Furniture',
    'Reception Counters',
    'Display Counters',
    'Glass Counters',
    'Acrylic Products',
    'Stainless Steel Work',
    'Mannequin Services',
    'Kiosk Design',
    'Other Services'
  ];

  return (
    <section id="contact" className="pt-32 pb-16 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div
          id="contact-header"
          data-animate
          className={`text-center mb-16 transition-all duration-1000 transform ${isVisible['contact-header'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
        >
          <div className="relative inline-block">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#9B4F96] via-[#c96bb3] to-[#9B4F96] bg-clip-text text-transparent animate-gradient bg-300% leading-tight"
              style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              Get In Touch
            </h2>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] rounded-full"></div>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-8 leading-relaxed"
            style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
            Ready to transform your space? Contact Al Qethaa Al Qadeema today for a free consultation and quote.
            Experience our in-house factory advantage.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div
            id="contact-info"
            data-animate
            className={`space-y-8 transition-all duration-1000 delay-200 transform ${isVisible['contact-info'] ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
              }`}
          >
            <div>
              <h3 className="text-3xl font-bold mb-8 text-[#9B4F96]" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                Contact Information
              </h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="p-6 group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border border-gray-100">
                    <div className="flex items-start space-x-4">
                      <div className={`p-4 rounded-xl bg-gradient-to-r ${info.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <info.icon className="text-white" size={24} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold mb-2 text-[#9B4F96] text-lg group-hover:text-[#c96bb3] transition-colors duration-300"
                          style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                          {info.title}
                        </h4>
                        {info.href ? (
                          <a
                            href={info.href}
                            className="text-base text-[#9B4F96] hover:text-[#c96bb3] font-semibold transition-colors duration-300 block mb-1"
                            style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                          >
                            {info.details[0]}
                          </a>
                        ) : (
                          <p className="text-base text-gray-700 font-semibold mb-1" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                            {info.details[0]}
                          </p>
                        )}
                        <p className="text-gray-500 text-sm" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                          {info.details[1]}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-lg font-bold text-[#9B4F96]" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                Quick Contact
              </h4>
              <div className="flex flex-col space-y-4">
                <a
                  href="https://wa.me/971561001190"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center space-x-3 bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
                  style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                >
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                  <span>WhatsApp Us</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={16} />
                </a>

                <a
                  href="tel:+971561001190"
                  className="group flex items-center justify-center space-x-3 bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
                  style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                >
                  <Phone size={20} className="group-hover:scale-110 transition-transform duration-300" />
                  <span>Call Now</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={16} />
                </a>

                <a
                  href="mailto:sales@aqdecor.com"
                  className="group flex items-center justify-center space-x-3 bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] hover:from-[#8a4687] hover:to-[#b85ca4] text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
                  style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                >
                  <Mail size={20} className="group-hover:scale-110 transition-transform duration-300" />
                  <span>Email Us</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={16} />
                </a>
              </div>
            </div>
          </div>

          <div
            id="contact-form" 
            data-animate
            className={`lg:col-span-2 transition-all duration-1000 delay-400 transform ${isVisible['contact-form'] ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`}
          >
            <Card className="p-8 shadow-2xl border border-gray-100">
              <h3 className="text-3xl font-bold mb-8 text-[#9B4F96]" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                Send us a Message
              </h3>

              {submitSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-green-800 font-semibold" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                      Thank you for your enquiry!
                    </p>
                    <p className="text-green-700 text-sm mt-1" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                      Al Qethaa Al Qadeema will get back to you soon.
                    </p>
                  </div>
                </div>
              )}

              {submitError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-red-800 font-semibold" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                      Submission Failed
                    </p>
                    <p className="text-red-700 text-sm mt-1" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                      {submitError}
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9B4F96] focus:border-transparent transition-all duration-300"
                      placeholder="Enter your full name"
                      style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9B4F96] focus:border-transparent transition-all duration-300"
                      placeholder="Enter your email"
                      style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                      Phone Number (UAE) *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className={`w-full px-4   text-gray-900   py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${phoneError
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-[#9B4F96] focus:border-transparent'
                        }`}
                      placeholder={getPhoneExample()}
                      style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                    />
                    {phoneError && (
                      <div className="flex items-start space-x-2 mt-2 text-red-600 text-sm">
                        <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                        <span style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>{phoneError}</span>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                      Format: 050 123 4567 or +971 50 123 4567
                    </p>     
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                      Service Interested In
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9B4F96] focus:border-transparent transition-all duration-300"
                    >
                      <option value="">Select a service</option>
                      {services.map((service, index) => (
                        <option key={index} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9B4F96] focus:border-transparent transition-all duration-300"
                    placeholder="Tell us about your project..."
                    style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !!phoneError}
                  className="w-full bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] hover:from-[#8a4687] hover:to-[#b85ca4] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Send size={20} />
                      <span>Send Message</span>
                    </div>
                  )}
                </button>
              </form>
            </Card>
          </div>
        </div>

        <div
          id="why-choose-us"
          data-animate
          className={`mt-16 transition-all duration-1000 delay-1000 transform ${isVisible['why-choose-us'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 text-[#9B4F96]" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              Why Choose Al Qethaa Al Qadeema?
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              Experience excellence with our comprehensive fit-out solutions and in-house factory advantage
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, index) => (
              <Card key={index} className="p-6 text-center group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] mb-4 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="text-white" size={24} />
                </div>
                <p className="text-base text-gray-700 font-semibold leading-relaxed group-hover:text-[#9B4F96] transition-colors duration-300"
                  style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                  {item.text}
                </p>
              </Card>
            ))}
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

export default Contact;