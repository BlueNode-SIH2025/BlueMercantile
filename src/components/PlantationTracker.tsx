import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MapPin, TrendingUp, TrendingDown, Leaf, TreePine, BarChart3, RefreshCw, Zap, Award, AlertCircle } from 'lucide-react';
import GoogleMap from './GoogleMap';

// Mock plantation data with live coordinates across India
const mockPlantations = [
  {
    id: 'PLT001',
    name: 'Green Valley Farm',
    location: 'Karnataka',
    coordinates: { lat: 12.9716, lng: 77.5946 },
    carbonProduction: 850,
    dailyGrowth: 12.5,
    treeCount: 2500,
    area: 45.2,
    plantationType: 'Bamboo',
    status: 'active',
    efficiency: 92,
    lastUpdate: new Date(),
    monthlyData: [
      { month: 'Jan', carbon: 620, trees: 2200 },
      { month: 'Feb', carbon: 680, trees: 2300 },
      { month: 'Mar', carbon: 720, trees: 2400 },
      { month: 'Apr', carbon: 780, trees: 2450 },
      { month: 'May', carbon: 820, trees: 2500 },
      { month: 'Jun', carbon: 850, trees: 2500 }
    ]
  },
  {
    id: 'PLT002',
    name: 'Himalayan Reforestation',
    location: 'Uttarakhand',
    coordinates: { lat: 30.0668, lng: 79.0193 },
    carbonProduction: 1200,
    dailyGrowth: 18.3,
    treeCount: 4200,
    area: 78.5,
    plantationType: 'Pine & Oak',
    status: 'active',
    efficiency: 88,
    lastUpdate: new Date(),
    monthlyData: [
      { month: 'Jan', carbon: 980, trees: 3800 },
      { month: 'Feb', carbon: 1040, trees: 3900 },
      { month: 'Mar', carbon: 1080, trees: 4000 },
      { month: 'Apr', carbon: 1120, trees: 4100 },
      { month: 'May', carbon: 1160, trees: 4150 },
      { month: 'Jun', carbon: 1200, trees: 4200 }
    ]
  },
  {
    id: 'PLT003',
    name: 'Coastal Mangrove Project',
    location: 'Tamil Nadu',
    coordinates: { lat: 11.1271, lng: 78.6569 },
    carbonProduction: 950,
    dailyGrowth: 15.7,
    treeCount: 3100,
    area: 62.3,
    plantationType: 'Mangrove',
    status: 'active',
    efficiency: 95,
    lastUpdate: new Date(),
    monthlyData: [
      { month: 'Jan', carbon: 720, trees: 2800 },
      { month: 'Feb', carbon: 780, trees: 2900 },
      { month: 'Mar', carbon: 820, trees: 2950 },
      { month: 'Apr', carbon: 870, trees: 3000 },
      { month: 'May', carbon: 910, trees: 3050 },
      { month: 'Jun', carbon: 950, trees: 3100 }
    ]
  },
  {
    id: 'PLT004',
    name: 'Desert Afforestation',
    location: 'Rajasthan',
    coordinates: { lat: 27.0238, lng: 74.2179 },
    carbonProduction: 420,
    dailyGrowth: 6.8,
    treeCount: 1200,
    area: 35.7,
    plantationType: 'Desert Plants',
    status: 'developing',
    efficiency: 65,
    lastUpdate: new Date(),
    monthlyData: [
      { month: 'Jan', carbon: 280, trees: 1000 },
      { month: 'Feb', carbon: 310, trees: 1050 },
      { month: 'Mar', carbon: 340, trees: 1100 },
      { month: 'Apr', carbon: 370, trees: 1150 },
      { month: 'May', carbon: 395, trees: 1175 },
      { month: 'Jun', carbon: 420, trees: 1200 }
    ]
  },
  {
    id: 'PLT005',
    name: 'Eastern Ghats Initiative',
    location: 'Andhra Pradesh',
    coordinates: { lat: 15.9129, lng: 79.7400 },
    carbonProduction: 1100,
    dailyGrowth: 16.2,
    treeCount: 3800,
    area: 58.9,
    plantationType: 'Mixed Forest',
    status: 'active',
    efficiency: 90,
    lastUpdate: new Date(),
    monthlyData: [
      { month: 'Jan', carbon: 850, trees: 3400 },
      { month: 'Feb', carbon: 920, trees: 3500 },
      { month: 'Mar', carbon: 980, trees: 3600 },
      { month: 'Apr', carbon: 1020, trees: 3700 },
      { month: 'May', carbon: 1060, trees: 3750 },
      { month: 'Jun', carbon: 1100, trees: 3800 }
    ]
  }
];

// Mock real-time data simulation
const useRealTimeData = () => {
  const [plantations, setPlantations] = useState(mockPlantations);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setPlantations(prev => prev.map(plantation => ({
        ...plantation,
        carbonProduction: plantation.carbonProduction + Math.random() * 2 - 1,
        dailyGrowth: plantation.dailyGrowth + Math.random() * 0.4 - 0.2,
        lastUpdate: new Date()
      })));
      setLastUpdate(new Date());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return { plantations, lastUpdate };
};

// India API data aggregation
const useIndiaPlantationStats = () => {
  const [stats, setStats] = useState({
    totalPlantations: 156,
    totalCarbonProduction: 45680,
    avgGrowthRate: 14.2,
    topPerformingStates: [
      { state: 'Karnataka', production: 8500, count: 28 },
      { state: 'Tamil Nadu', production: 7200, count: 24 },
      { state: 'Uttarakhand', production: 6800, count: 19 },
      { state: 'Andhra Pradesh', production: 5900, count: 22 },
      { state: 'Maharashtra', production: 5400, count: 18 }
    ],
    monthlyTrend: [
      { month: 'Jan', production: 42000, plantations: 145 },
      { month: 'Feb', production: 43200, plantations: 148 },
      { month: 'Mar', production: 44100, plantations: 152 },
      { month: 'Apr', production: 44800, plantations: 154 },
      { month: 'May', production: 45300, plantations: 155 },
      { month: 'Jun', production: 45680, plantations: 156 }
    ]
  });

  useEffect(() => {
    // Simulate API calls to update India-wide statistics
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalCarbonProduction: prev.totalCarbonProduction + Math.random() * 100 - 50,
        avgGrowthRate: prev.avgGrowthRate + Math.random() * 0.2 - 0.1
      }));
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return stats;
};

const PlantationTracker = () => {
  const { plantations, lastUpdate } = useRealTimeData();
  const indiaStats = useIndiaPlantationStats();
  const [selectedPlantation, setSelectedPlantation] = useState(plantations[0]);
  const [mapView, setMapView] = useState<'production' | 'growth' | 'efficiency'>('production');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Sort plantations by different metrics
  const topProducers = [...plantations].sort((a, b) => b.carbonProduction - a.carbonProduction);
  const lowProducers = [...plantations].sort((a, b) => a.carbonProduction - b.carbonProduction);
  const fastestGrowing = [...plantations].sort((a, b) => b.dailyGrowth - a.dailyGrowth);

  // Color mapping for different metrics
  const getMarkerColor = (plantation: any) => {
    switch (mapView) {
      case 'production':
        return plantation.carbonProduction > 900 ? '#22c55e' : plantation.carbonProduction > 600 ? '#eab308' : '#ef4444';
      case 'growth':
        return plantation.dailyGrowth > 15 ? '#22c55e' : plantation.dailyGrowth > 10 ? '#eab308' : '#ef4444';
      case 'efficiency':
        return plantation.efficiency > 90 ? '#22c55e' : plantation.efficiency > 75 ? '#eab308' : '#ef4444';
      default:
        return '#3b82f6';
    }
  };

  const COLORS = ['#22c55e', '#3b82f6', '#eab308', '#f97316', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Header with real-time indicators */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Plantation Tracking</h2>
          <p className="text-sm text-gray-600">
            Last updated: {lastUpdate.toLocaleTimeString()} | {plantations.length} Active Plantations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={autoRefresh ? "default" : "secondary"} className="gap-1">
            <RefreshCw className={`h-3 w-3 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Live' : 'Paused'}
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? 'Pause' : 'Resume'} Updates
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TreePine className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Carbon Production</p>
              <p className="text-xl font-bold text-gray-900">
                {plantations.reduce((sum, p) => sum + p.carbonProduction, 0).toFixed(0)} kg/day
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Growth Rate</p>
              <p className="text-xl font-bold text-gray-900">
                {(plantations.reduce((sum, p) => sum + p.dailyGrowth, 0) / plantations.length).toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Award className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Best Performer</p>
              <p className="text-lg font-bold text-gray-900">{topProducers[0]?.name}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Needs Attention</p>
              <p className="text-lg font-bold text-gray-900">{lowProducers[0]?.name}</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="map" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="map">Live Map</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="rankings">Rankings</TabsTrigger>
          <TabsTrigger value="india-stats">India Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Real Google Map */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Real-time Plantation Distribution</h3>
                  <Select value={mapView} onValueChange={(value: any) => setMapView(value)}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="production">Carbon Production</SelectItem>
                      <SelectItem value="growth">Growth Rate</SelectItem>
                      <SelectItem value="efficiency">Efficiency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="relative">
                  <GoogleMap
                    plantations={plantations}
                    selectedPlantation={selectedPlantation}
                    onPlantationSelect={setSelectedPlantation}
                    mapView={mapView}
                    height="400px"
                  />
                  
                  {/* Status indicator - now handled by the map components themselves */}
                </div>
              </Card>
            </div>

            {/* Plantation Details */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Plantation Details</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">{selectedPlantation.name}</h4>
                  <p className="text-sm text-gray-600">{selectedPlantation.location}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Carbon/Day</p>
                    <p className="font-semibold">{selectedPlantation.carbonProduction.toFixed(1)} kg</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Growth Rate</p>
                    <p className="font-semibold">{selectedPlantation.dailyGrowth.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Tree Count</p>
                    <p className="font-semibold">{selectedPlantation.treeCount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Area</p>
                    <p className="font-semibold">{selectedPlantation.area} acres</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-2">Efficiency</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${selectedPlantation.efficiency}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{selectedPlantation.efficiency}%</p>
                </div>

                <Badge variant={selectedPlantation.status === 'active' ? 'default' : 'secondary'}>
                  {selectedPlantation.status}
                </Badge>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trend Chart */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Monthly Carbon Production Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedPlantation.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="carbon" stroke="#22c55e" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Production Distribution */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Carbon Production Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={plantations.map(p => ({ name: p.name, value: p.carbonProduction }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {plantations.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Growth Rate Comparison */}
            <Card className="lg:col-span-2 p-6">
              <h3 className="text-lg font-semibold mb-4">Daily Growth Rate Comparison</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={plantations}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="dailyGrowth" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rankings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Producers */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Top Carbon Producers
              </h3>
              <div className="space-y-3">
                {topProducers.map((plantation, index) => (
                  <div key={plantation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <div>
                        <p className="font-medium text-sm">{plantation.name}</p>
                        <p className="text-xs text-gray-600">{plantation.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{plantation.carbonProduction.toFixed(0)} kg</p>
                      <p className="text-xs text-gray-600">per day</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Fastest Growing */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                Fastest Growing
              </h3>
              <div className="space-y-3">
                {fastestGrowing.map((plantation, index) => (
                  <div key={plantation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <div>
                        <p className="font-medium text-sm">{plantation.name}</p>
                        <p className="text-xs text-gray-600">{plantation.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-600">{plantation.dailyGrowth.toFixed(1)}%</p>
                      <p className="text-xs text-gray-600">daily growth</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Need Attention */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Need Attention
              </h3>
              <div className="space-y-3">
                {lowProducers.map((plantation, index) => (
                  <div key={plantation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="destructive">!</Badge>
                      <div>
                        <p className="font-medium text-sm">{plantation.name}</p>
                        <p className="text-xs text-gray-600">{plantation.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">{plantation.carbonProduction.toFixed(0)} kg</p>
                      <p className="text-xs text-gray-600">per day</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="india-stats" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* India-wide Monthly Trend */}
            <Card className="lg:col-span-2 p-6">
              <h3 className="text-lg font-semibold mb-4">India-wide Carbon Production Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={indiaStats.monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="production" 
                      stroke="#22c55e" 
                      fill="#22c55e" 
                      fillOpacity={0.3} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Top Performing States */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Top Performing States</h3>
              <div className="space-y-3">
                {indiaStats.topPerformingStates.map((state, index) => (
                  <div key={state.state} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <div>
                        <p className="font-medium text-sm">{state.state}</p>
                        <p className="text-xs text-gray-600">{state.count} plantations</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{state.production.toLocaleString()} kg</p>
                      <p className="text-xs text-gray-600">per day</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Key Statistics */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">National Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Plantations</span>
                  <span className="font-semibold">{indiaStats.totalPlantations}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Carbon Production</span>
                  <span className="font-semibold">{indiaStats.totalCarbonProduction.toLocaleString()} kg/day</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Growth Rate</span>
                  <span className="font-semibold">{indiaStats.avgGrowthRate.toFixed(1)}%</span>
                </div>
                <div className="pt-4 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {Math.round(indiaStats.totalCarbonProduction * 365 / 1000)} tons
                    </p>
                    <p className="text-sm text-gray-600">Projected Annual Carbon Capture</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlantationTracker;