import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { CheckCircle } from 'lucide-react';
import type { Service } from '../../types';

interface ServiceCardProps {
  service: Service;
  variant?: 'default' | 'compact' | 'detailed';
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, variant = 'default' }) => {
  if (variant === 'compact') {
    return (
      <Card className="p-6 text-center h-full" hover>
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 bg-primary rounded-lg"></div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{service.description}</p>
        <ul className="text-xs text-gray-500 space-y-1">
          {service.features.slice(0, 3).map((feature, index) => (
            <li key={index}>• {feature}</li>
          ))}
        </ul>
      </Card>
    );
  }

  if (variant === 'detailed') {
    return (
      <Card className="p-8 h-full" hover>
        <div className="flex items-start space-x-6">
          <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg"></div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">{service.title}</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
            
            <div className="space-y-4 mb-6">
              <h4 className="font-semibold text-gray-900">What's Included:</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-2">
                    <CheckCircle className="text-primary flex-shrink-0 mt-0.5" size={16} />
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Button size="sm">
              Learn More
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className="p-6 text-center h-full" hover>
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <div className="w-8 h-8 bg-primary rounded-lg"></div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
      <p className="text-gray-600 text-sm mb-4">{service.description}</p>
      
      <div className="space-y-3 mb-6">
        <h4 className="font-medium text-gray-900 text-sm">Key Features:</h4>
        <ul className="text-xs text-gray-500 space-y-1">
          {service.features.slice(0, 4).map((feature, index) => (
            <li key={index} className="flex items-center justify-center space-x-1">
              <CheckCircle size={12} className="text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <Button size="sm" variant="outline" className="w-full">
        View Details
      </Button>
    </Card>
  );
};

export default ServiceCard;