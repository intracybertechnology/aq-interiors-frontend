import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import Card from '../ui/Card';
import type { Location, MapConfig } from '../../types';

// Google Maps API types
declare global {
  interface Window {
    google: any;
    initMap?: () => void;
  }
}

interface LocationMapProps {
  apiKey: string;
  className?: string;
  height?: string;
}

const LocationMap: React.FC<LocationMapProps> = ({ 
  apiKey, 
  className = '', 
  height = '500px' 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const markersRef = useRef<any[]>([]);

  // Default map configuration (Sharjah, UAE)
  const mapConfig: MapConfig = {
    center: { lat: 25.3548, lng: 55.4033 },
    zoom: 12,
    apiKey
  };

  // Fetch locations from your backend API
  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/locations');
      const result = await response.json();
      
      if (result.success) {
        setLocations(result.data);
        setError(null);
      } else {
        setError('Failed to load locations');
      }
    } catch (err) {
      console.error('Error fetching locations:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  // Initialize Google Maps
  const initializeMap = () => {
    if (!window.google || !mapRef.current) return;

    const mapOptions = {
      center: mapConfig.center,
      zoom: mapConfig.zoom,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: true,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ]
    };

    const googleMap = new window.google.maps.Map(mapRef.current, mapOptions);
    setMap(googleMap);

    // Add markers for each location
    addMarkersToMap(googleMap, locations);
  };

  // Add markers to map
  const addMarkersToMap = (googleMap: any, locationData: Location[]) => {
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    locationData.forEach(location => {
      const marker = new window.google.maps.Marker({
        position: { lat: location.latitude, lng: location.longitude },
        map: googleMap,
        title: location.name,
        icon: getMarkerIcon(location.type),
        animation: window.google.maps.Animation.DROP
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: createInfoWindowContent(location)
      });

      marker.addListener('click', () => {
        // Close all other info windows
        markersRef.current.forEach(m => {
          if (m.infoWindow) {
            m.infoWindow.close();
          }
        });
        
        infoWindow.open(googleMap, marker);
      });

      marker.infoWindow = infoWindow;
      markersRef.current.push(marker);
    });

    // Fit map to show all markers
    if (locationData.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      locationData.forEach(location => {
        bounds.extend({ lat: location.latitude, lng: location.longitude });
      });
      googleMap.fitBounds(bounds);
      
      // Don't zoom in too much for a single marker
      if (locationData.length === 1) {
        googleMap.setZoom(15);
      }
    }
  };

  // Get marker icon based on location type
  const getMarkerIcon = (type: Location['type']) => {
    const icons = {
      'office': 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
      'branch': 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
      'service_area': 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
      'project_location': 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
    };
    return icons[type] || icons['office'];
  };

  // Create info window content
  const createInfoWindowContent = (location: Location) => {
    return `
      <div style="max-width: 250px; font-family: 'Inter', sans-serif;">
        <h3 style="margin: 0 0 10px 0; color: #9B4F96; font-family: '"Lucida-Bright", Georgia, serif'; font-weight: 600;">
          ${location.name}
        </h3>
        <p style="margin: 5px 0; color: #374151;">
          <strong>Address:</strong> ${location.address}
        </p>
        <p style="margin: 5px 0; color: #374151;">
          <strong>Type:</strong> 
          <span style="background: ${getTypeColor(location.type)}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; text-transform: uppercase;">
            ${location.type.replace('_', ' ')}
          </span>
        </p>
        ${location.description ? `<p style="margin: 10px 0 0 0; color: #6B7280;">${location.description}</p>` : ''}
        <div style="margin-top: 10px;">
          <a href="https://maps.google.com/maps?daddr=${location.latitude},${location.longitude}" 
             target="_blank" 
             style="color: #9B4F96; text-decoration: none; font-weight: 600;">
            Get Directions →
          </a>
        </div>
      </div>
    `;
  };

  // Get type color
  const getTypeColor = (type: Location['type']) => {
    const colors = {
      'office': '#9B4F96',
      'branch': '#10B981',
      'service_area': '#F59E0B',
      'project_location': '#EF4444'
    };
    return colors[type] || colors['office'];
  };

  // Load Google Maps API
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&libraries=geometry`;
      script.async = true;
      script.defer = true;
      
      window.initMap = () => {
        fetchLocations();
      };
      
      document.head.appendChild(script);
      
      return () => {
        document.head.removeChild(script);
        // FIXED: Use optional chaining and proper cleanup
        if (window.initMap) {
          delete window.initMap;
        }
      };
    } else {
      fetchLocations();
    }
  }, [apiKey]);

  // Initialize map when locations are loaded
  useEffect(() => {
    if (locations.length > 0 && !loading) {
      initializeMap();
    }
  }, [locations, loading]);

  // Filter locations by type
  const filterByType = (type: Location['type'] | 'all') => {
    if (type === 'all') {
      addMarkersToMap(map, locations);
    } else {
      const filteredLocations = locations.filter(loc => loc.type === type);
      addMarkersToMap(map, filteredLocations);
    }
  };

  // Get user's current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        if (map) {
          map.setCenter(userLocation);
          map.setZoom(15);

          // Add user location marker
          new window.google.maps.Marker({
            position: userLocation,
            map: map,
            title: 'Your Location',
            icon: 'https://maps.google.com/mapfiles/ms/icons/blue-pushpin.png'
          });
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Unable to get your location. Please enable location services.');
      }
    );
  };

  // Handle location card click
  const handleLocationClick = (location: Location) => {
    if (map) {
      map.setCenter({ lat: location.latitude, lng: location.longitude });
      map.setZoom(16);
    }
  };

  if (loading) {
    return (
      <Card className={`p-8 ${className}`}>
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-[#9B4F96] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600" style={{ fontFamily: '"Lucida-Bright", Georgia, serif' }}>Loading map...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`p-8 ${className}`}>
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4" style={{ fontFamily: '"Lucida-Bright", Georgia,serif' }}>{error}</p>
            <button 
              onClick={fetchLocations}
              className="px-4 py-2 bg-[#9B4F96] text-white rounded-lg hover:bg-[#8a4687] transition-colors"
              style={{ fontFamily: ' "Lucida-Bright", Georgia, serif' }}
            >
              Try Again
            </button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className={className}>
      {/* Map Controls */}
      <Card className="p-4 mb-4">
        <div className="flex flex-wrap items-center gap-4">
          <h4 className="text-lg font-semibold text-[#9B4F96]" style={{ fontFamily: '"Lucida-Bright", Georgia,serif' }}>
            Our Locations
          </h4>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => filterByType('all')}
              className="px-3 py-1 bg-gray-200 hover:bg-[#9B4F96] hover:text-white rounded-full text-sm transition-colors"
              style={{ fontFamily: '"Lucida-Bright", Georgia,serif' }}
            >
              All Locations
            </button>
            <button
              onClick={() => filterByType('office')}
              className="px-3 py-1 bg-blue-100 hover:bg-blue-500 hover:text-white rounded-full text-sm transition-colors"
              style={{ fontFamily: '"Lucida-Bright", Georgia,serif' }}
            >
              Offices
            </button>
            <button
              onClick={() => filterByType('branch')}
              className="px-3 py-1 bg-green-100 hover:bg-green-500 hover:text-white rounded-full text-sm transition-colors"
              style={{ fontFamily: 'I"Lucida-Bright", Georgia,serif' }}
            >
              Branches
            </button>
          </div>

          <button
            onClick={getCurrentLocation}
            className="flex items-center gap-2 px-4 py-2 bg-[#9B4F96] hover:bg-[#8a4687] text-white rounded-lg transition-colors ml-auto"
            style={{ fontFamily: '"Lucida-Bright", Georgia,serif' }}
          >
            <Navigation size={16} />
            <span>Find Nearby</span>
          </button>
        </div>
      </Card>

      {/* Map Container */}
      <Card className="overflow-hidden">
        <div 
          ref={mapRef} 
          style={{ height }} 
          className="w-full"
        />
      </Card>

      {/* Location List */}
      {locations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {locations.map((location) => (
            // FIXED: Wrap Card in div to handle onClick properly
            <div
              key={location.id}
              className="cursor-pointer"
              onClick={() => handleLocationClick(location)}
            >
              <Card className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-3">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${getTypeColor(location.type)}20` }}
                  >
                    <MapPin 
                      size={20} 
                      style={{ color: getTypeColor(location.type) }}
                    />
                  </div>
                  <div className="flex-1">
                    <h5 
                      className="font-semibold text-[#9B4F96] mb-1"
                      style={{ fontFamily: '"Lucida-Bright", Georgia,serif' }}
                    >
                      {location.name}
                    </h5>
                    <p 
                      className="text-sm text-gray-600 mb-2"
                      style={{ fontFamily: '"Lucida-Bright", Georgia,serif' }}
                    >
                      {location.address}
                    </p>
                    <span 
                      className="inline-block px-2 py-1 rounded-full text-xs text-white"
                      style={{ 
                        backgroundColor: getTypeColor(location.type),
                        fontFamily: '"Lucida-Bright", Georgia,seriff'
                      }}
                    >
                      {location.type.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationMap;