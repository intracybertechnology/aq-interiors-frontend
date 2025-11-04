'use client'

import React, { useEffect, useState } from 'react';
import { clientApi, Client } from '@/services/clientApi';
import { Briefcase } from 'lucide-react';

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const response = await clientApi.getClients({ limit: 100 });
        // Filter only active clients
        const activeClients = response.clients.filter(client => client.isActive);
        setClients(activeClients);
      } catch (err) {
        console.error('Error fetching clients:', err);
        setError('Failed to load clients');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Split clients into two columns
  const midPoint = Math.ceil(clients.length / 2);
  const leftColumn = clients.slice(0, midPoint);
  const rightColumn = clients.slice(midPoint);

  if (loading) {
    return (
      <section id="clients" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#9B4F96]"></div>
            <p className="mt-4 text-gray-600" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              Loading our clients...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="clients" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center text-red-600">
            <p style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="clients" className="py-20 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="relative inline-block">
            <h2 
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#9B4F96] via-[#c96bb3] to-[#9B4F96] bg-clip-text text-transparent animate-gradient bg-300% leading-tight"
              style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
            >
               Our Clients
            </h2>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] rounded-full"></div>
          </div>
          <p 
            className="text-lg text-gray-600 max-w-3xl mx-auto mt-8 leading-relaxed"
            style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
          >
            Trusted by leading brands across UAE for exceptional fit-out and interior solutions
          </p>
        </div>

        {/* Clients Grid */}
        <div className="relative max-w-6xl mx-auto">
          {/* Background Image Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100/50 to-gray-200/50 rounded-3xl backdrop-blur-sm"></div>
          
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12">
            {/* Left Column */}
            <div className="space-y-4">
              {leftColumn.map((client, index) => (
                <div
                  key={client.id}
                  className="group flex items-center space-x-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards',
                    opacity: 0
                  }}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-[#9B4F96] to-[#c96bb3] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Briefcase className="text-white" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 
                      className="text-base font-semibold text-gray-800 group-hover:text-[#9B4F96] transition-colors duration-300 truncate"
                      style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                    >
                      {client.name}
                    </h3>
                    <p 
                      className="text-sm text-gray-500 truncate"
                      style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                    >
                      {client.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {rightColumn.map((client, index) => (
                <div
                  key={client.id}
                  className="group flex items-center space-x-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                  style={{
                    animationDelay: `${(index + leftColumn.length) * 50}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards',
                    opacity: 0
                  }}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-[#9B4F96] to-[#c96bb3] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Briefcase className="text-white" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 
                      className="text-base font-semibold text-gray-800 group-hover:text-[#9B4F96] transition-colors duration-300 truncate"
                      style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                    >
                      {client.name}
                    </h3>
                    <p 
                      className="text-sm text-gray-500 truncate"
                      style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                    >
                      {client.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Client Count Badge */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#9B4F96] to-[#c96bb3] rounded-full shadow-lg">
            <span 
              className="text-white font-bold text-lg"
              style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
            >
              {clients.length}+ Satisfied Clients
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

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

export default Clients;