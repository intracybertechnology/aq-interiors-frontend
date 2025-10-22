'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Phone, Mail, MapPin, Clock, Send, Factory, Award, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
  service: string;
}

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
        // Basic UAE phone validation
        const cleanPhone = value.replace(/\s/g, '');
        const uaePhoneRegex = /^(\+971|00971|971|0)?[0-9]{9}$/;
        if (!uaePhoneRegex.test(cleanPhone)) {
          setPhoneError('Please enter a valid UAE phone number');
        } else {
          setPhoneError('');
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(false);
    setSubmitError('');

    if (phoneError) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <section className="pt-32 pb-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#9B4F96] via-[#c96bb3] to-[#9B4F96] bg-clip-text text-transparent">
            Get In Touch
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ready to transform your space? Contact Al Qethaa Al Qadeema today for a free consultation and quote.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-2xl">
            <h3 className="text-3xl font-bold mb-8 text-[#9B4F96]">
              Send us a Message
            </h3>

            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-green-800 font-semibold">
                    Thank you for your enquiry!
                  </p>
                  <p className="text-green-700 text-sm mt-1">
                    Al Qethaa Al Qadeema will get back to you soon.
                  </p>
                </div>
              </div>
            )}

            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-800 font-semibold">Submission Failed</p>
                  <p className="text-red-700 text-sm mt-1">{submitError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9B4F96] focus:border-transparent transition-all duration-300"
                    placeholder="Enter your full name"
                    style={{ WebkitTextFillColor: '#111827' }}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9B4F96] focus:border-transparent transition-all duration-300"
                    placeholder="Enter your email"
                    style={{ WebkitTextFillColor: '#111827' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number (UAE) *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    autoComplete="tel"
                    className={`w-full px-4 py-3 text-gray-900 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                      phoneError
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-[#9B4F96] focus:border-transparent'
                    }`}
                    placeholder="050 123 4567"
                    style={{ WebkitTextFillColor: '#111827' }}
                  />
                  {phoneError && (
                    <div className="flex items-start space-x-2 mt-2 text-red-600 text-sm">
                      <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                      <span>{phoneError}</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Format: 050 123 4567 or +971 50 123 4567
                  </p>
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-semibold text-gray-700 mb-2">
                    Service Interested In
                  </label>
                  <select
                    id="service"
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
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9B4F96] focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Tell us about your project..."
                  style={{ WebkitTextFillColor: '#111827' }}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !!phoneError}
                className="w-full bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] hover:from-[#8a4687] hover:to-[#b85ca4] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;