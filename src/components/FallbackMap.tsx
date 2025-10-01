import React, { useState, useCallback } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MapPin, ZoomIn, ZoomOut, Move, Layers, RefreshCw } from 'lucide-react';

interface FallbackMapProps {
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

const FallbackMap: React.FC<FallbackMapProps> = ({
  plantations,
  selectedPlantation,
  onPlantationSelect,
  mapView,
  className = '',
  height = '400px'
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [showSatellite, setShowSatellite] = useState(true);

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

  // Calculate plantation position on the map
  const getPlantationPosition = (plantation: any, index: number) => {
    // Use actual coordinates to position markers more accurately
    const { lat, lng } = plantation.coordinates;
    
    // Convert lat/lng to percentage positions (rough approximation for India)
    // India bounds: lat 8-37, lng 68-97
    const latPercent = ((lat - 8) / (37 - 8)) * 100;
    const lngPercent = ((lng - 68) / (97 - 68)) * 100;
    
    return {
      left: `${Math.max(5, Math.min(95, lngPercent))}%`,
      top: `${Math.max(5, Math.min(95, 100 - latPercent))}%` // Invert lat for screen coordinates
    };
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleReset = () => {
    setZoomLevel(1);
    setMapOffset({ x: 0, y: 0 });
  };

  return (
    <div className={`relative ${className}`}>
      <Card className="overflow-hidden" style={{ height, width: '100%' }}>
        {/* Map Container */}
        <div 
          className="relative w-full h-full overflow-hidden cursor-move"
          style={{
            transform: `scale(${zoomLevel}) translate(${mapOffset.x}px, ${mapOffset.y}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease'
          }}
        >
          {/* Background Map */}
          <div 
            className={`absolute inset-0 ${
              showSatellite 
                ? 'bg-gradient-to-br from-green-100 via-green-50 to-blue-100' 
                : 'bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50'
            }`}
            style={{
              backgroundImage: showSatellite 
                ? `radial-gradient(circle at 30% 20%, rgba(34, 197, 94, 0.1) 0%, transparent 70%),
                   radial-gradient(circle at 70% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 70%),
                   radial-gradient(circle at 20% 60%, rgba(168, 85, 247, 0.05) 0%, transparent 70%)`
                : 'none'
            }}
          >
            {/* India outline simulation */}
            <div className="absolute inset-0 opacity-20">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 400 600"
                className="text-green-600"
              >
                {/* Simplified India shape */}
                <path
                  d="M200 50 L180 80 L160 120 L140 160 L130 200 L120 240 L110 280 L130 320 L150 360 L180 400 L220 420 L260 400 L290 360 L310 320 L320 280 L310 240 L300 200 L290 160 L280 120 L260 80 L240 50 Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>

            {/* Plantation markers */}
            {plantations.map((plantation, index) => {
              const position = getPlantationPosition(plantation, index);
              const isSelected = selectedPlantation && selectedPlantation.id === plantation.id;
              
              return (
                <div key={plantation.id}>
                  {/* Marker */}
                  <div
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
                      isSelected ? 'scale-125 z-20' : 'hover:scale-110 z-10'
                    }`}
                    style={position}
                    onClick={() => onPlantationSelect && onPlantationSelect(plantation)}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                        isSelected ? 'animate-pulse' : ''
                      }`}
                      style={{ backgroundColor: getMarkerColor(plantation) }}
                    />
                    
                    {/* Marker label */}
                    <div className={`absolute top-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap transition-all duration-200 ${
                      isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-95 hover:opacity-100 hover:scale-100'
                    }`}>
                      <div className="font-medium">{plantation.name}</div>
                      <div className="text-gray-600">{getMetricValue(plantation)}</div>
                    </div>
                  </div>

                  {/* Selection circle for selected plantation */}
                  {isSelected && (
                    <div
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                      style={position}
                    >
                      <div className="w-12 h-12 border-2 border-blue-500 rounded-full animate-ping opacity-30" />
                      <div className="absolute inset-0 w-12 h-12 border-2 border-blue-500 rounded-full" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            className="w-8 h-8 p-0 bg-white/90 backdrop-blur-sm"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            className="w-8 h-8 p-0 bg-white/90 backdrop-blur-sm"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="w-8 h-8 p-0 bg-white/90 backdrop-blur-sm"
          >
            <Move className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSatellite(!showSatellite)}
            className="w-8 h-8 p-0 bg-white/90 backdrop-blur-sm"
          >
            <Layers className="h-4 w-4" />
          </Button>
        </div>

        {/* Legend */}
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

        {/* Status indicator */}
        <div className="absolute top-4 left-4">
          <Badge variant="default" className="gap-1 bg-green-600">
            <RefreshCw className="h-3 w-3 animate-spin" />
            Live Data - Fallback Map
          </Badge>
        </div>

        {/* Plantation count */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg shadow-lg">
          <span className="text-sm font-medium text-gray-700">
            {plantations.length} Active Plantations
          </span>
        </div>

        {/* Zoom indicator */}
        <div className="absolute top-16 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs">
          Zoom: {Math.round(zoomLevel * 100)}%
        </div>
      </Card>
    </div>
  );
};

export default FallbackMap;