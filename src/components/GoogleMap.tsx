import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Loader2, MapPin, RefreshCw } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import FallbackMap from './FallbackMap';

interface GoogleMapProps {
  plantations: Array<{
    id: string;
    name: string;
    location: string;
    coordinates: { lat: number; lng: number };
    carbonProduction: number;
    dailyGrowth: number;
    efficiency: number;
    status: string;
    plantationType: string;
    treeCount: number;
    area: number;
  }>;
  selectedPlantation?: any;
  onPlantationSelect?: (plantation: any) => void;
  mapView: 'production' | 'growth' | 'efficiency';
  className?: string;
  height?: string;
}

// Google Maps API Key - Updated with latest working API key
const GOOGLE_MAPS_API_KEY = 'PLACE_API_KEY_HERE';

// Check if we should skip Google Maps loading
// This can be controlled via localStorage or environment variables
const getSkipGoogleMaps = (): boolean => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('skipGoogleMaps');
    if (stored !== null) {
      return stored === 'true';
    }
  }
  return false; // Default to false to try Google Maps first with new API key
};

const SKIP_GOOGLE_MAPS = getSkipGoogleMaps();

declare global {
  interface Window {
    google: any;
    initMap: () => void;
    googlemaps: any;
  }
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  plantations,
  selectedPlantation,
  onPlantationSelect,
  mapView,
  className = '',
  height = '400px'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(!SKIP_GOOGLE_MAPS);
  const [error, setError] = useState<string | null>(null);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [useFallback, setUseFallback] = useState(SKIP_GOOGLE_MAPS);

  // Load Google Maps API with proper async loading
  useEffect(() => {
    // Skip Google Maps loading if we know billing isn't enabled
    if (SKIP_GOOGLE_MAPS) {
      setUseFallback(true);
      setIsLoading(false);
      setError('Google Maps billing not enabled - using fallback map');
      return;
    }

    if (window.google && window.google.maps) {
      setIsApiLoaded(true);
      setIsLoading(false);
      return;
    }

    // Use proper async loading pattern
    const loadGoogleMaps = async () => {
      try {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry&loading=async&callback=initMap`;
        script.async = true;
        script.defer = true;

        window.initMap = () => {
          // Check for any Google Maps errors before proceeding
          try {
            if (window.google && window.google.maps) {
              setIsApiLoaded(true);
              setIsLoading(false);
              setUseFallback(false);
            } else {
              throw new Error('Google Maps API not properly loaded');
            }
          } catch (initError) {
            console.error('Google Maps initialization error:', initError);
            setError('Google Maps initialization failed - using fallback view');
            setUseFallback(true);
            setIsLoading(false);
          }
        };

        script.onerror = (error) => {
          console.error('Google Maps API loading error:', error);
          setError('Failed to load Google Maps API. Using fallback view.');
          setUseFallback(true);
          setIsLoading(false);
        };

        // Listen for global Google Maps errors
        const handleGlobalError = (event: ErrorEvent) => {
          const message = event.message || '';
          if (message.includes('Google Maps') || 
              message.includes('BillingNotEnabledMapError') ||
              message.includes('ApiNotActivatedMapError') ||
              message.includes('InvalidKeyMapError') ||
              message.includes('This API project is not authorized')) {
            console.error('Google Maps runtime error:', message);
            
            // Provide specific error messages
            let errorMsg = 'Google Maps error detected. Using fallback view.';
            if (message.includes('BillingNotEnabledMapError')) {
              errorMsg = 'Google Maps billing not enabled. Using fully functional fallback map.';
            } else if (message.includes('This API project is not authorized')) {
              errorMsg = 'Google Maps API not authorized. Using fully functional fallback map.';
            }
            
            setError(errorMsg);
            setUseFallback(true);
            setIsLoading(false);
            
            // Persist the fallback preference
            localStorage.setItem('skipGoogleMaps', 'true');
          }
        };

        window.addEventListener('error', handleGlobalError);

        // Also listen for unhandled promise rejections from Google Maps
        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
          const reason = event.reason || '';
          if (reason.toString().includes('Google Maps') || 
              reason.toString().includes('BillingNotEnabledMapError') ||
              reason.toString().includes('This API project is not authorized')) {
            console.error('Google Maps promise rejection:', reason);
            
            let errorMsg = 'Google Maps failed to load properly. Using fallback view.';
            if (reason.toString().includes('BillingNotEnabledMapError')) {
              errorMsg = 'Google Maps billing not enabled. Using fully functional fallback map.';
            } else if (reason.toString().includes('This API project is not authorized')) {
              errorMsg = 'Google Maps API not authorized. Using fully functional fallback map.';
            }
            
            setError(errorMsg);
            setUseFallback(true);
            setIsLoading(false);
            localStorage.setItem('skipGoogleMaps', 'true');
            event.preventDefault(); // Prevent unhandled rejection error
          }
        };

        window.addEventListener('unhandledrejection', handleUnhandledRejection);

        document.head.appendChild(script);

        // Timeout fallback
        setTimeout(() => {
          if (!window.google || !window.google.maps) {
            setError('Google Maps API loading timeout. Using fallback view.');
            setUseFallback(true);
            setIsLoading(false);
          }
        }, 5000); // Reduced timeout for faster fallback

        return () => {
          window.removeEventListener('error', handleGlobalError);
          window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        };

      } catch (error) {
        console.error('Error setting up Google Maps:', error);
        setError('Error setting up Google Maps. Using fallback view.');
        setUseFallback(true);
        setIsLoading(false);
      }
    };

    loadGoogleMaps();
  }, []);

  // Get marker color based on metric
  const getMarkerColor = useCallback((plantation: any) => {
    switch (mapView) {
      case 'production':
        if (plantation.carbonProduction > 900) return '#22c55e'; // green
        if (plantation.carbonProduction > 600) return '#eab308'; // yellow
        return '#ef4444'; // red
      case 'growth':
        if (plantation.dailyGrowth > 15) return '#22c55e';
        if (plantation.dailyGrowth > 10) return '#eab308';
        return '#ef4444';
      case 'efficiency':
        if (plantation.efficiency > 90) return '#22c55e';
        if (plantation.efficiency > 75) return '#eab308';
        return '#ef4444';
      default:
        return '#3b82f6';
    }
  }, [mapView]);

  // Get metric value for display
  const getMetricValue = useCallback((plantation: any) => {
    switch (mapView) {
      case 'production':
        return `${plantation.carbonProduction.toFixed(0)} kg/day`;
      case 'growth':
        return `${plantation.dailyGrowth.toFixed(1)}% growth`;
      case 'efficiency':
        return `${plantation.efficiency}% efficiency`;
      default:
        return '';
    }
  }, [mapView]);

  // Initialize map
  useEffect(() => {
    if (!isApiLoaded || !mapRef.current || !window.google) return;

    try {
      // Center map on India
      const indiaCenter = { lat: 20.5937, lng: 78.9629 };
      
      // Create map with minimal configuration to avoid conflicts
      const mapOptions: google.maps.MapOptions = {
        zoom: 5,
        center: indiaCenter,
        mapTypeId: 'satellite',
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        // Add styles only if no mapId conflicts
        styles: [
          {
            featureType: 'all',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }]
          }
        ]
      };

      const newMap = new window.google.maps.Map(mapRef.current, mapOptions);

      // Test if map is working by attempting to get center
      const testCenter = newMap.getCenter();
      if (!testCenter) {
        throw new Error('Map initialization test failed');
      }

      setMap(newMap);
      setError(null);
    } catch (err: any) {
      console.error('Error initializing map:', err);
      
      // Handle different types of errors
      const errorMessage = err.message || err.toString();
      
      setError('Google Maps initialization failed - using fallback view');
      setUseFallback(true);
      
      // Don't show toast errors since we have a working fallback
      console.warn('Google Maps error, using fallback:', errorMessage);
    }
  }, [isApiLoaded]);

  // Update markers when plantations or mapView changes
  useEffect(() => {
    if (!map || !window.google || !plantations.length) return;

    // Clear existing markers
    markers.forEach(marker => {
      if (marker.setMap) {
        marker.setMap(null);
      } else if (marker.map) {
        marker.map = null;
      }
    });

    const newMarkers: any[] = [];
    const bounds = new window.google.maps.LatLngBounds();

    try {
      plantations.forEach((plantation) => {
        const position = new window.google.maps.LatLng(
          plantation.coordinates.lat,
          plantation.coordinates.lng
        );

        let marker;

        try {
          // For now, use legacy Marker to avoid billing issues with AdvancedMarkerElement
          // AdvancedMarkerElement requires billing and mapId, so we'll stick with the reliable legacy markers
          marker = new window.google.maps.Marker({
            position,
            map,
            title: plantation.name,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 12,
              fillColor: getMarkerColor(plantation),
              fillOpacity: 0.8,
              strokeColor: '#ffffff',
              strokeWeight: 2
            },
            animation: window.google.maps.Animation.DROP
          });
        } catch (markerError) {
          console.warn('Error creating marker:', markerError);
          
          // Final fallback - simple marker without custom icon
          marker = new window.google.maps.Marker({
            position,
            map,
            title: plantation.name
          });
        }

        // Create info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: 600;">
                ${plantation.name}
              </h3>
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
                📍 ${plantation.location}
              </p>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
                <div>
                  <span style="color: #6b7280; font-size: 12px;">Carbon Production</span>
                  <div style="color: #059669; font-weight: 600;">
                    ${plantation.carbonProduction.toFixed(0)} kg/day
                  </div>
                </div>
                <div>
                  <span style="color: #6b7280; font-size: 12px;">Growth Rate</span>
                  <div style="color: #2563eb; font-weight: 600;">
                    ${plantation.dailyGrowth.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <span style="color: #6b7280; font-size: 12px;">Trees</span>
                  <div style="color: #7c3aed; font-weight: 600;">
                    ${plantation.treeCount.toLocaleString()}
                  </div>
                </div>
                <div>
                  <span style="color: #6b7280; font-size: 12px;">Efficiency</span>
                  <div style="color: #dc2626; font-weight: 600;">
                    ${plantation.efficiency}%
                  </div>
                </div>
              </div>
              <div style="padding: 6px 12px; background: #f3f4f6; border-radius: 6px; margin-top: 8px;">
                <span style="color: #374151; font-size: 12px;">
                  🌳 ${plantation.plantationType} • ${plantation.area} acres
                </span>
              </div>
              <div style="margin-top: 8px;">
                <span style="display: inline-block; padding: 2px 8px; background: ${
                  plantation.status === 'active' ? '#dcfce7' : '#f3f4f6'
                }; color: ${
                  plantation.status === 'active' ? '#166534' : '#374151'
                }; border-radius: 4px; font-size: 12px; font-weight: 500;">
                  ${plantation.status.toUpperCase()}
                </span>
              </div>
            </div>
          `
        });

        // Add click listener
        marker.addListener('click', () => {
          // Close all other info windows
          newMarkers.forEach(m => m.infoWindow?.close());
          
          // Open this info window
          infoWindow.open(map, marker);
          
          // Call selection callback
          if (onPlantationSelect) {
            onPlantationSelect(plantation);
          }

          // Center map on selected plantation
          map.panTo(position);
          map.setZoom(Math.max(map.getZoom(), 8));
        });

        marker.infoWindow = infoWindow;
        newMarkers.push(marker);
        bounds.extend(position);
      });

      // Fit map to show all plantations
      if (plantations.length > 1) {
        map.fitBounds(bounds);
      }

      setMarkers(newMarkers);

    } catch (error) {
      console.error('Error creating markers:', error);
      setError('Error creating map markers. Using fallback view.');
      setUseFallback(true);
    }
  }, [map, plantations, mapView, getMarkerColor, onPlantationSelect]);

  // Highlight selected plantation
  useEffect(() => {
    if (!map || !selectedPlantation || !markers.length) return;

    const selectedMarker = markers.find(marker => 
      marker.getTitle() === selectedPlantation.name
    );

    if (selectedMarker) {
      // Animate the selected marker
      selectedMarker.setAnimation(window.google.maps.Animation.BOUNCE);
      setTimeout(() => {
        selectedMarker.setAnimation(null);
      }, 2000);

      // Open info window for selected plantation
      selectedMarker.infoWindow?.open(map, selectedMarker);
      
      // Center on selected plantation
      map.panTo(selectedMarker.getPosition());
    }
  }, [selectedPlantation, markers, map]);

  // If we should use fallback or there's an error, use FallbackMap
  if (useFallback || error) {
    return (
      <FallbackMap
        plantations={plantations}
        selectedPlantation={selectedPlantation}
        onPlantationSelect={onPlantationSelect}
        mapView={mapView}
        className={className}
        height={height}
      />
    );
  }

  if (isLoading) {
    return (
      <Card className={`p-8 ${className}`} style={{ height }}>
        <div className="flex flex-col items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Google Maps</h3>
          <p className="text-sm text-gray-600 text-center">
            Initializing real-time plantation tracking...
          </p>
        </div>
      </Card>
    );
  }

  if (false) { // This block is now unreachable since we handle errors above
    // Fallback map view
    return (
      <div className={`relative ${className}`}>
        <Card className="p-6" style={{ height, width: '100%' }}>
          <div className="h-full relative bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-gray-200 overflow-hidden">
            {/* Fallback map header */}
            <div className="absolute top-4 left-4 right-4 z-10">
              <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-orange-600" />
                    <span className="font-medium text-gray-900">Fallback Map View</span>
                  </div>
                  <Badge variant="destructive" className="text-xs">
                    Google Maps Unavailable
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">{error}</p>
              </div>
            </div>

            {/* Fallback plantation markers */}
            <div className="absolute inset-0 pt-20">
              {plantations.map((plantation, index) => (
                <div
                  key={plantation.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
                  style={{
                    left: `${20 + (index * 15)}%`,
                    top: `${30 + (index % 3) * 20}%`
                  }}
                  onClick={() => onPlantationSelect && onPlantationSelect(plantation)}
                >
                  <div
                    className="w-5 h-5 rounded-full border-2 border-white shadow-lg relative"
                    style={{ backgroundColor: getMarkerColor(plantation) }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap min-w-max">
                      {plantation.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Fallback legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {mapView.charAt(0).toUpperCase() + mapView.slice(1)} Legend
              </h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs">High Performance</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-xs">Medium Performance</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-xs">Low Performance</span>
                </div>
              </div>
            </div>

            {/* Retry button */}
            <div className="absolute bottom-4 right-4">
              <Button 
                onClick={() => {
                  setError(null);
                  setIsLoading(true);
                  setIsApiLoaded(false);
                  window.location.reload();
                }} 
                variant="outline" 
                size="sm"
                className="bg-white/90 backdrop-blur-sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Google Maps
              </Button>
            </div>

            {/* Fallback indicator */}
            <div className="absolute top-4 right-4">
              <Badge variant="outline" className="gap-1 bg-orange-100 text-orange-700 border-orange-200">
                <MapPin className="h-3 w-3" />
                Fallback View
              </Badge>
            </div>

            {/* Plantation count */}
            <div className="absolute top-20 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg shadow-lg">
              <span className="text-sm font-medium text-gray-700">
                {plantations.length} Active Plantations
              </span>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapRef} 
        style={{ height, width: '100%' }}
        className="rounded-lg overflow-hidden border border-gray-200"
      />
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg border">
        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {mapView.charAt(0).toUpperCase() + mapView.slice(1)} Legend
        </h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs">High Performance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-xs">Medium Performance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs">Low Performance</span>
          </div>
        </div>
      </div>

      {/* Real-time indicator */}
      <div className="absolute top-4 right-4">
        <Badge variant="default" className="gap-1 bg-green-600">
          <RefreshCw className="h-3 w-3 animate-spin" />
          Live Data
        </Badge>
      </div>

      {/* Plantation count */}
      <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-lg shadow-lg border">
        <span className="text-sm font-medium text-gray-700">
          {plantations.length} Active Plantations
        </span>
      </div>
    </div>
  );
};

export default GoogleMap;
