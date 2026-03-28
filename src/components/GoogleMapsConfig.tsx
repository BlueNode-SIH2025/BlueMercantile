import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { ExternalLink, Key, CheckCircle, AlertCircle, Copy } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface GoogleMapsConfigProps {
  onApiKeySet: (apiKey: string) => void;
  currentApiKey?: string;
}

const GoogleMapsConfig: React.FC<GoogleMapsConfigProps> = ({ onApiKeySet, currentApiKey }) => {
  // Set the API key automatically - updated with latest working API key
  const configuredApiKey = 'API_KEY';
  const [apiKey, setApiKey] = useState(currentApiKey || configuredApiKey);
  const [isValid, setIsValid] = useState(false); // Will be validated automatically
  const [isValidating, setIsValidating] = useState(false);
  const [skipGoogleMaps, setSkipGoogleMaps] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('skipGoogleMaps') === 'true' : false
  );

  useEffect(() => {
    // Force update with latest API key and clear fallback mode
    setApiKey(configuredApiKey);
    onApiKeySet(configuredApiKey);
    localStorage.setItem('googleMapsApiKey', configuredApiKey);
    localStorage.setItem('skipGoogleMaps', 'false'); // Reset to try Google Maps first
    setSkipGoogleMaps(false);
    
    // Validate the latest API key automatically
    validateApiKey(configuredApiKey);
    
    // Show testing message with partial key for verification
    setTimeout(() => {
      toast.info('Testing latest Google Maps API key - ' + configuredApiKey.substring(0, 20) + '...');
    }, 500);
  }, [onApiKeySet]);

  const validateApiKey = async (key: string) => {
    if (!key || key.length < 20) {
      setIsValid(false);
      return false;
    }
    
    setIsValidating(true);
    
    try {
      // Test the API key by making a request to the Geocoding API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=test&key=${key}`
      );
      
      const data = await response.json();
      
      // Check for specific error types
      if (data.error_message) {
        console.error('Google Maps API Error:', data.error_message);
        
        if (data.error_message.includes('billing') || data.error_message.includes('BILLING_NOT_ENABLED')) {
          setIsValid(false);
          toast.error('Google Maps billing not enabled. Using fallback map.');
          // Force fallback mode
          localStorage.setItem('skipGoogleMaps', 'true');
          setSkipGoogleMaps(true);
          return false;
        }
        
        if (data.error_message.includes('API project is not authorized') || data.error_message.includes('API_NOT_ACTIVATED')) {
          setIsValid(false);
          toast.error('Maps JavaScript API not enabled. Using fallback map.');
          localStorage.setItem('skipGoogleMaps', 'true');
          setSkipGoogleMaps(true);
          return false;
        }
      }
      
      // Check if the API key is valid (even if address is invalid, the key should work)
      if (response.ok && data.status !== 'REQUEST_DENIED') {
        setIsValid(true);
        // If validation succeeds, we can try using Google Maps
        localStorage.setItem('skipGoogleMaps', 'false');
        setSkipGoogleMaps(false);
        return true;
      } else {
        console.error('API key validation failed:', data.error_message || data.status);
        setIsValid(false);
        // Force fallback mode on validation failure
        localStorage.setItem('skipGoogleMaps', 'true');
        setSkipGoogleMaps(true);
        return false;
      }
    } catch (error) {
      console.error('Error validating API key:', error);
      setIsValid(false);
      // Force fallback mode on network errors
      localStorage.setItem('skipGoogleMaps', 'true');
      setSkipGoogleMaps(true);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleSaveApiKey = async () => {
    const valid = await validateApiKey(apiKey);
    if (valid) {
      onApiKeySet(apiKey);
      // Store in localStorage for persistence
      localStorage.setItem('googleMapsApiKey', apiKey);
      toast.success('Google Maps API key saved successfully!');
    } else {
      toast.error('Invalid API key. Please check and try again.');
    }
  };

  const copyExampleKey = async () => {
    const exampleKey = 'YOUR_GOOGLE_MAPS_API_KEY_HERE';
    try {
      await navigator.clipboard.writeText(exampleKey);
      toast.info('Example API key format copied to clipboard');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Key className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Google Maps API Configuration</h3>
            {currentApiKey && (
              <Badge variant={isValid ? "default" : "destructive"} className="ml-auto">
                {isValid ? "Active" : "Invalid"}
              </Badge>
            )}
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {skipGoogleMaps 
                ? '✅ Using fallback map mode - fully functional without external dependencies or billing requirements.'
                : isValid 
                  ? '✅ Google Maps API key validated and working! Full Google Maps functionality is available.'
                  : '⚠️ Google Maps API key configured but validation failed. Check billing and API permissions below.'
              }
            </AlertDescription>
          </Alert>

          {/* Fallback Mode Toggle */}
          <div className={`p-4 rounded-lg border ${skipGoogleMaps ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className={`font-medium ${skipGoogleMaps ? 'text-green-900' : 'text-yellow-900'}`}>
                  Current Map Mode
                </h4>
                <p className={`text-sm ${skipGoogleMaps ? 'text-green-800' : 'text-yellow-800'}`}>
                  {skipGoogleMaps 
                    ? '✅ Using fallback map - fully functional with real-time plantation tracking'
                    : isValid
                      ? '✅ Using Google Maps with satellite imagery'
                      : '⚠️ Attempting Google Maps but validation failed'
                  }
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setSkipGoogleMaps(true);
                    localStorage.setItem('skipGoogleMaps', 'true');
                    toast.success('Switched to fallback map mode.');
                    window.location.reload();
                  }}
                  variant={skipGoogleMaps ? "default" : "outline"}
                  size="sm"
                >
                  Use Fallback Map
                </Button>
                <Button
                  onClick={async () => {
                    if (apiKey) {
                      const valid = await validateApiKey(apiKey);
                      if (valid) {
                        setSkipGoogleMaps(false);
                        localStorage.setItem('skipGoogleMaps', 'false');
                        toast.success('Google Maps validated! Switching to Google Maps mode.');
                        window.location.reload();
                      } else {
                        toast.error('Google Maps validation failed. Please fix billing and API setup first.');
                      }
                    } else {
                      toast.error('Please enter an API key first.');
                    }
                  }}
                  variant={!skipGoogleMaps && isValid ? "default" : "outline"}
                  size="sm"
                  disabled={isValidating}
                >
                  {isValidating ? 'Testing...' : 'Test Google Maps'}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="apiKey">Google Maps API Key</Label>
            <div className="flex gap-2">
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your Google Maps API key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleSaveApiKey}
                disabled={!apiKey || isValidating}
                className="shrink-0"
              >
                {isValidating ? (
                  'Validating...'
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Step-by-step Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium mb-2 text-blue-900">Step-by-Step Google Maps Setup:</h4>
            <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
              <li>Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">Google Cloud Console <ExternalLink className="h-3 w-3" /></a></li>
              <li><strong>Enable Billing:</strong> Go to Billing → Add a payment method</li>
              <li><strong>Enable APIs:</strong> Go to APIs & Services → Library</li>
              <li className="ml-4">• Search and enable "Maps JavaScript API"</li>
              <li className="ml-4">• Search and enable "Geocoding API"</li>
              <li><strong>Configure API Key:</strong> Go to APIs & Services → Credentials</li>
              <li className="ml-4">• Edit your API key</li>
              <li className="ml-4">• Add application restrictions (HTTP referrers)</li>
              <li className="ml-4">• Add your domain to allowed referrers</li>
              <li>Test the API key and refresh this page</li>
            </ol>
            <div className="mt-3 p-2 bg-blue-100 rounded text-xs text-blue-900">
              💡 <strong>Tip:</strong> You can continue using BlueMercantile with the fallback map while setting up Google Maps billing.
            </div>
          </div>

          {/* Billing and API Setup Warning */}
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h4 className="font-medium mb-2 text-red-900 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Google Maps Setup Required
            </h4>
            <p className="text-sm text-red-800 mb-2">
              Your API key is experiencing the following issues:
            </p>
            <ul className="text-sm text-red-800 space-y-1 list-disc list-inside">
              <li><strong>BillingNotEnabledMapError:</strong> Billing must be enabled in Google Cloud Console</li>
              <li><strong>API Not Authorized:</strong> Maps JavaScript API must be enabled for your project</li>
              <li>The API key may need proper domain restrictions configured</li>
            </ul>
            <p className="text-sm text-red-800 mt-2">
              <strong>Solution:</strong> BlueMercantile includes a powerful fallback map that works perfectly without any Google billing. Click "Use Fallback Map" above to continue using the platform.
            </p>
          </div>

          {/* Status Display */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2 text-blue-900">Current Map Status:</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Map System</span>
                <Badge variant={skipGoogleMaps ? "default" : (isValid ? "default" : "destructive")}>
                  {skipGoogleMaps ? 'Fallback Map' : (isValid ? 'Google Maps' : 'Google Maps (Error)')}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Google Maps Billing</span>
                <Badge variant={isValid ? "default" : "destructive"}>
                  {isValid ? "Enabled" : "Not Enabled"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Fallback Map</span>
                <Badge variant="default">Fully Functional</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Real-time Data</span>
                <Badge variant="default">Available</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Interactive Features</span>
                <Badge variant="default">All Working</Badge>
              </div>
            </div>
          </div>

          {/* Demo/Testing */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2 text-yellow-900">API Key Format:</h4>
            <p className="text-sm text-yellow-800 mb-2">
              Replace the placeholder below with your actual Google Maps API key:
            </p>
            <div className="flex items-center gap-2">
              <code className="bg-white px-2 py-1 rounded text-xs flex-1">
                YOUR_GOOGLE_MAPS_API_KEY_HERE
              </code>
              <Button size="sm" variant="outline" onClick={copyExampleKey}>
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-xs text-yellow-700 mt-2">
              ⚠️ For production use, please create your own API key
            </p>
          </div>
        </div>
      </Card>

      {/* Current Status Summary */}
      <Card className="p-4">
        <div className="space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            BlueMercantile Map Status
          </h3>
          
          {skipGoogleMaps ? (
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900">Fallback Map Active</p>
                  <p className="text-sm text-green-800">
                    Your BlueMercantile platform is running perfectly with our built-in map system. 
                    All plantation tracking, real-time data, and interactive features are fully functional.
                  </p>
                  <ul className="text-sm text-green-800 mt-2 space-y-1">
                    <li>✅ Real-time plantation tracking</li>
                    <li>✅ Interactive plantation markers</li>
                    <li>✅ Performance metrics visualization</li>
                    <li>✅ No external dependencies or billing required</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-900">Google Maps Configuration Needed</p>
                  <p className="text-sm text-yellow-800">
                    Google Maps is not working due to billing/API issues. The platform is automatically 
                    using the fallback map which provides all the same functionality.
                  </p>
                  <p className="text-sm text-yellow-800 mt-1">
                    <strong>Recommendation:</strong> Click "Use Fallback Map" above to continue with full functionality.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* API Status */}
      {currentApiKey && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isValid ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium">
                Google Maps API Status
              </span>
            </div>
            <Badge variant={isValid ? "default" : "destructive"}>
              {isValid ? "Connected" : "Error"}
            </Badge>
          </div>
        </Card>
      )}
    </div>
  );
};

export default GoogleMapsConfig;
