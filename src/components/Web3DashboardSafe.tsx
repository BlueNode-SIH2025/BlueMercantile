import React, { useState, useCallback, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { AlertCircle, Coins } from 'lucide-react';

interface WalletInfo {
  address: string;
  balance: string;
  chainId: string;
  networkName: string;
}

interface Web3DashboardProps {
  userType: 'patron' | 'credit_client';
  userName: string;
}

export function Web3DashboardSafe({ userType, userName }: Web3DashboardProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initialization
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 flex items-center justify-center">
        <Card className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p>Loading Web3 Dashboard...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <Card className="p-6 max-w-2xl mx-auto">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Error:</strong> {error}
            </AlertDescription>
          </Alert>
          
          <div className="mt-4 text-center">
            <Button onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 text-white p-3 rounded-lg">
                <Coins className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  BlueMercantile Web3 Dashboard
                </h1>
                <p className="text-gray-600 capitalize">
                  {userType.replace('_', ' ')} Portal - {userName}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Safe Mode
            </Badge>
          </div>

          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Web3 features are loading in safe mode. Full functionality will be available once the complete dashboard loads.
            </AlertDescription>
          </Alert>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Dashboard Status</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Dashboard Mode:</span>
              <Badge variant="outline">Safe Mode</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>User Type:</span>
              <Badge>{userType}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>User Name:</span>
              <span>{userName}</span>
            </div>
          </div>
          
          <div className="mt-4">
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="w-full"
            >
              Try Loading Full Dashboard
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Web3DashboardSafe;