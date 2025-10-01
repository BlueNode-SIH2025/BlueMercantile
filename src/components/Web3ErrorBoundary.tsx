import React from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class Web3ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Web3 Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="p-6 max-w-2xl mx-auto">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold mb-4">Web3 Feature Unavailable</h2>
            
            <Alert className="mb-4 text-left">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                There was an error loading the Web3 features. This might be due to:
                <ul className="mt-2 ml-4 list-disc">
                  <li>MetaMask not being installed</li>
                  <li>Network connectivity issues</li>
                  <li>Browser compatibility problems</li>
                  <li>Configuration errors</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reload Page
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => window.open('https://metamask.io/download/', '_blank')}
                className="w-full"
              >
                Install MetaMask
              </Button>
            </div>

            <div className="mt-6 text-sm text-gray-600">
              <p>If the problem persists, you can still use the platform without Web3 features.</p>
              <p className="mt-2">
                Error details: {this.state.error?.message || 'Unknown error'}
              </p>
            </div>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default Web3ErrorBoundary;