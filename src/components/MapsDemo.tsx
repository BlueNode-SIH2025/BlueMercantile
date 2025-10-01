import React, { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { MapPin, Satellite, Navigation, Zap, Leaf, TrendingUp } from 'lucide-react';
import GoogleMap from './GoogleMap';
import PlantationTracker from './PlantationTracker';

// Demo plantation data for the maps demo
const demoPlantations = [
  {
    id: 'DEMO001',
    name: 'BlueMercantile Demo Farm',
    location: 'Karnataka, India',
    coordinates: { lat: 12.9716, lng: 77.5946 },
    carbonProduction: 1200,
    dailyGrowth: 18.5,
    treeCount: 5000,
    area: 85.5,
    plantationType: 'Mixed Forest',
    status: 'active',
    efficiency: 95,
    lastUpdate: new Date(),
    monthlyData: [
      { month: 'Jan', carbon: 950, trees: 4500 },
      { month: 'Feb', carbon: 1050, trees: 4700 },
      { month: 'Mar', carbon: 1100, trees: 4850 },
      { month: 'Apr', carbon: 1150, trees: 4950 },
      { month: 'May', carbon: 1180, trees: 4980 },
      { month: 'Jun', carbon: 1200, trees: 5000 }
    ]
  },
  {
    id: 'DEMO002',
    name: 'Smart Agriculture Plot',
    location: 'Tamil Nadu, India',
    coordinates: { lat: 11.1271, lng: 78.6569 },
    carbonProduction: 890,
    dailyGrowth: 14.2,
    treeCount: 3200,
    area: 62.3,
    plantationType: 'Bamboo Plantation',
    status: 'active',
    efficiency: 88,
    lastUpdate: new Date(),
    monthlyData: []
  },
  {
    id: 'DEMO003',
    name: 'Himalayan Reforestation',
    location: 'Uttarakhand, India',
    coordinates: { lat: 30.0668, lng: 79.0193 },
    carbonProduction: 1580,
    dailyGrowth: 22.1,
    treeCount: 7200,
    area: 145.2,
    plantationType: 'Pine & Oak Forest',
    status: 'active',
    efficiency: 92,
    lastUpdate: new Date(),
    monthlyData: []
  },
  {
    id: 'DEMO004',
    name: 'Coastal Mangrove Project',
    location: 'Kerala, India',
    coordinates: { lat: 10.8505, lng: 76.2711 },
    carbonProduction: 750,
    dailyGrowth: 12.8,
    treeCount: 2800,
    area: 58.7,
    plantationType: 'Mangrove Forest',
    status: 'developing',
    efficiency: 78,
    lastUpdate: new Date(),
    monthlyData: []
  },
  {
    id: 'DEMO005',
    name: 'Desert Afforestation Hub',
    location: 'Rajasthan, India',
    coordinates: { lat: 27.0238, lng: 74.2179 },
    carbonProduction: 425,
    dailyGrowth: 8.3,
    treeCount: 1800,
    area: 42.1,
    plantationType: 'Desert Vegetation',
    status: 'developing',
    efficiency: 65,
    lastUpdate: new Date(),
    monthlyData: []
  }
];

const MapsDemo: React.FC = () => {
  const [selectedPlantation, setSelectedPlantation] = useState(demoPlantations[0]);
  const [mapView, setMapView] = useState<'production' | 'growth' | 'efficiency'>('production');

  const totalProduction = demoPlantations.reduce((sum, p) => sum + p.carbonProduction, 0);
  const avgGrowth = demoPlantations.reduce((sum, p) => sum + p.dailyGrowth, 0) / demoPlantations.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-green-600 text-white p-3 rounded-xl">
              <Satellite className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              BlueMercantile Live Maps Demo
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience real-time plantation tracking with Google Maps integration. 
            Monitor carbon production, growth rates, and plantation efficiency across India.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Badge variant="default" className="gap-2 px-4 py-2">
              <MapPin className="h-4 w-4" />
              Real-time Data
            </Badge>
            <Badge variant="outline" className="gap-2 px-4 py-2">
              <Leaf className="h-4 w-4" />
              {demoPlantations.length} Active Plantations
            </Badge>
            <Badge variant="outline" className="gap-2 px-4 py-2">
              <TrendingUp className="h-4 w-4" />
              {totalProduction.toFixed(0)} kg/day Carbon
            </Badge>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Leaf className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{totalProduction.toFixed(0)}</h3>
            <p className="text-sm text-gray-600">kg/day Carbon Production</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{avgGrowth.toFixed(1)}%</h3>
            <p className="text-sm text-gray-600">Average Growth Rate</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
              <MapPin className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{demoPlantations.length}</h3>
            <p className="text-sm text-gray-600">Active Plantations</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Zap className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {Math.round(totalProduction * 365 / 1000)}
            </h3>
            <p className="text-sm text-gray-600">Tons/year Projected</p>
          </Card>
        </div>

        <Tabs defaultValue="interactive" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="interactive">Interactive Map</TabsTrigger>
            <TabsTrigger value="full-tracker">Full Plantation Tracker</TabsTrigger>
            <TabsTrigger value="features">Map Features</TabsTrigger>
          </TabsList>

          <TabsContent value="interactive" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <Card className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Live Plantation Map</h3>
                    <div className="flex gap-2">
                      <Button
                        variant={mapView === 'production' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setMapView('production')}
                      >
                        Carbon Production
                      </Button>
                      <Button
                        variant={mapView === 'growth' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setMapView('growth')}
                      >
                        Growth Rate
                      </Button>
                      <Button
                        variant={mapView === 'efficiency' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setMapView('efficiency')}
                      >
                        Efficiency
                      </Button>
                    </div>
                  </div>

                  <GoogleMap
                    plantations={demoPlantations}
                    selectedPlantation={selectedPlantation}
                    onPlantationSelect={setSelectedPlantation}
                    mapView={mapView}
                    height="500px"
                  />
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="p-6">
                  <h4 className="font-semibold mb-4">Selected Plantation</h4>
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-gray-900">{selectedPlantation.name}</h5>
                      <p className="text-sm text-gray-600">{selectedPlantation.location}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Carbon/Day</span>
                        <div className="font-semibold text-green-600">
                          {selectedPlantation.carbonProduction} kg
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Growth</span>
                        <div className="font-semibold text-blue-600">
                          {selectedPlantation.dailyGrowth}%
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Trees</span>
                        <div className="font-semibold">
                          {selectedPlantation.treeCount.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Area</span>
                        <div className="font-semibold">
                          {selectedPlantation.area} acres
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-500 text-sm">Efficiency</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${selectedPlantation.efficiency}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold">{selectedPlantation.efficiency}%</span>
                      </div>
                    </div>

                    <Badge variant={selectedPlantation.status === 'active' ? 'default' : 'secondary'}>
                      {selectedPlantation.status.toUpperCase()}
                    </Badge>
                  </div>
                </Card>

                <Card className="p-6">
                  <h4 className="font-semibold mb-4">All Plantations</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {demoPlantations.map((plantation) => (
                      <button
                        key={plantation.id}
                        onClick={() => setSelectedPlantation(plantation)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          selectedPlantation.id === plantation.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium text-sm">{plantation.name}</div>
                        <div className="text-xs text-gray-600">{plantation.location}</div>
                        <div className="text-xs text-green-600 mt-1">
                          {plantation.carbonProduction} kg/day
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="full-tracker" className="mt-8">
            <PlantationTracker />
          </TabsContent>

          <TabsContent value="features" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Real-time Tracking</h3>
                <p className="text-gray-600 text-sm">
                  Live plantation data with automatic updates every few seconds. Monitor carbon production, 
                  growth rates, and plantation health in real-time.
                </p>
              </Card>

              <Card className="p-6">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Satellite className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Satellite View</h3>
                <p className="text-gray-600 text-sm">
                  Google Maps satellite imagery provides detailed aerial views of plantations. 
                  Zoom in to see individual plots and vegetation coverage.
                </p>
              </Card>

              <Card className="p-6">
                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Navigation className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Interactive Markers</h3>
                <p className="text-gray-600 text-sm">
                  Click on any plantation marker to view detailed information including carbon production, 
                  tree count, growth metrics, and plantation status.
                </p>
              </Card>

              <Card className="p-6">
                <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Performance Metrics</h3>
                <p className="text-gray-600 text-sm">
                  Color-coded markers show performance levels. Switch between carbon production, 
                  growth rate, and efficiency views for comprehensive analysis.
                </p>
              </Card>

              <Card className="p-6">
                <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Auto-refresh Data</h3>
                <p className="text-gray-600 text-sm">
                  Plantation data refreshes automatically to provide the most current information. 
                  Live indicators show when data is being updated.
                </p>
              </Card>

              <Card className="p-6">
                <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Leaf className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Carbon Analytics</h3>
                <p className="text-gray-600 text-sm">
                  Track carbon credit production across all plantations. View projected annual 
                  carbon capture and compare performance across different regions.
                </p>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MapsDemo;