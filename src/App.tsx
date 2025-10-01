import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Card } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Badge } from './components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './components/ui/alert-dialog';
import { Textarea } from './components/ui/textarea';
import { toast } from 'sonner@2.0.3';
import { Toaster } from './components/ui/sonner';
import { LogOut, Users, UserCheck, UserX, Eye, Ban, Key, Mail, CheckCircle, XCircle, Leaf, MapPin, Upload, FileText, ExternalLink, TreePine } from 'lucide-react';
import IPFSUploader from './components/IPFSUploader';
import PlantationTracker from './components/PlantationTracker';
import Web3ErrorBoundary from './components/Web3ErrorBoundary';
import Web3ConfigHelper from './components/Web3ConfigHelper';

// Indian States List
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

// Types
interface User {
  id: string;
  fullName: string;
  userType: 'patron' | 'credit_client';
  entityType?: string;
  ngoRegId?: string;
  vpName?: string;
  mobile: string;
  email: string;
  aadhar: string;
  walletAddress: string;
  address?: string;
  pincode?: string;
  state?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  ownershipDocument?: string;
  ipfsData?: {
    hash: string;
    name: string;
    size: number;
    url: string;
    timestamp: Date;
  };
  status: 'pending' | 'approved' | 'rejected' | 'banned';
  password?: string;
  rejectionReason?: string;
  createdAt: Date;
  approvedAt?: Date;
}

interface EmailLog {
  id: string;
  userId: string;
  userName: string;
  type: 'approval' | 'rejection';
  sentAt: Date;
  subject: string;
  content: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    type: 'admin' | 'patron' | 'credit_client';
    fullName: string;
  } | null;
}

// Initial data
const initialUsers: User[] = [
  {
    id: 'ptrn1001',
    fullName: 'Ravi Kumar',
    userType: 'patron',
    entityType: 'Farmer',
    mobile: '+91-9876543210',
    email: 'ravi.kumar@email.com',
    aadhar: '1234-5678-9012',
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    coordinates: {
      latitude: 28.6139,
      longitude: 77.2090,
      accuracy: 10
    },
    ownershipDocument: 'farm_ownership_certificate.pdf',
    status: 'approved',
    password: 'temp123',
    createdAt: new Date('2024-01-15'),
    approvedAt: new Date('2024-01-16')
  },
  {
    id: 'crdcl1001',
    fullName: 'Priya Sharma',
    userType: 'credit_client',
    mobile: '+91-9876543211',
    email: 'priya.sharma@company.com',
    aadhar: '2345-6789-0123',
    walletAddress: '0x2345678901bcdef12345678901bcdef123456789',
    status: 'approved',
    password: 'temp456',
    createdAt: new Date('2024-01-16'),
    approvedAt: new Date('2024-01-17')
  }
];

const initialEmailLogs: EmailLog[] = [
  {
    id: 'email_001',
    userId: 'ptrn1001',
    userName: 'Ravi Kumar',
    type: 'approval',
    sentAt: new Date('2024-01-16'),
    subject: 'BlueMercantile Account Approved',
    content: 'Your registration has been approved. Login credentials: ID - ptrn1001, Password - temp123'
  }
];

// Main App Component
export default function App() {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null
  });
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>(initialEmailLogs);
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'dashboard'>('login');

  // Initialize Web3 configuration
  useEffect(() => {
    console.log('🚀 BlueMercantile Web3 Integration with Ganache Support Ready');
    console.log('📚 See GANACHE_SETUP_GUIDE.md for setup instructions');
    console.log('🔧 Use setGanacheConfig("0xYourAddress") in console to configure');
  }, []);

  // Memoized login form to prevent unnecessary re-renders
  const LoginForm = useMemo(() => {
    return function LoginFormComponent() {
      const [credentials, setCredentials] = useState({ username: '', password: '' });
      const [loginType, setLoginType] = useState<'admin' | 'user'>('admin');

      const handleLogin = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        
        if (loginType === 'admin') {
          if (credentials.username === 'admin' && credentials.password === 'Qwerty') {
            setAuth({
              isAuthenticated: true,
              user: { id: 'admin', type: 'admin', fullName: 'System Administrator' }
            });
            setCurrentView('dashboard');
            toast.success('Welcome to BlueMercantile Admin Panel');
          } else {
            toast.error('Invalid admin credentials');
          }
        } else {
          // User login logic
          const user = users.find(u => 
            u.id === credentials.username && 
            u.password === credentials.password && 
            u.status === 'approved'
          );
          
          if (user) {
            setAuth({
              isAuthenticated: true,
              user: { id: user.id, type: user.userType, fullName: user.fullName }
            });
            setCurrentView('dashboard');
            toast.success(`Welcome back, ${user.fullName}!`);
          } else {
            toast.error('Invalid credentials or account not approved');
          }
        }
      }, [credentials, loginType, users]);

      return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-8 shadow-xl">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="bg-green-600 text-white p-2 rounded-lg">
                  <Leaf className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">BlueMercantile</h1>
              </div>
              <p className="text-gray-600">Carbon Credit Management Platform</p>
            </div>

            <Tabs value={loginType} onValueChange={(value) => setLoginType(value as 'admin' | 'user')} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="admin">Admin</TabsTrigger>
                <TabsTrigger value="user">User</TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">
                  {loginType === 'admin' ? 'Admin Username' : 'User ID'}
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  placeholder={loginType === 'admin' ? 'Enter admin username' : 'Enter your user ID'}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button 
                variant="ghost" 
                onClick={() => setCurrentView('register')}
                className="text-green-600 hover:text-green-700"
              >
                New user? Register here
              </Button>
            </div>

            {loginType === 'admin' && (
              <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
                <strong>Demo Admin:</strong> admin / Qwerty
              </div>
            )}

            {loginType === 'user' && (
              <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-blue-600">
                <strong>Demo Users:</strong><br />
                Patron: ptrn1001 / temp123<br />
                Client: crdcl1001 / temp456
              </div>
            )}
          </Card>
        </div>
      );
    };
  }, [users]);

  // Registration form component
  const RegistrationForm = useMemo(() => {
    return function RegistrationFormComponent() {
      const [formData, setFormData] = useState({
        userType: '',
        fullName: '',
        entityType: '',
        ngoRegId: '',
        vpName: '',
        mobile: '',
        email: '',
        aadhar: '',
        walletAddress: '',
        address: '',
        pincode: '',
        state: '',
        ownershipDocument: '',
        ipfsData: null as any
      });

      const [coordinates, setCoordinates] = useState<{latitude: number, longitude: number, accuracy?: number} | null>(null);
      const [showManualEntry, setShowManualEntry] = useState(true);

      const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.userType || !formData.fullName || !formData.mobile || !formData.email || !formData.aadhar || !formData.walletAddress) {
          toast.error('Please fill in all required fields');
          return;
        }

        // Generate unique ID
        const userCount = users.filter(u => u.userType === formData.userType).length;
        const prefix = formData.userType === 'patron' ? 'ptrn' : 'crdcl';
        const newUserId = `${prefix}${(1000 + userCount + 1)}`;

        const newUser: User = {
          id: newUserId,
          fullName: formData.fullName,
          userType: formData.userType as 'patron' | 'credit_client',
          entityType: formData.entityType || undefined,
          ngoRegId: formData.ngoRegId || undefined,
          vpName: formData.vpName || undefined,
          mobile: formData.mobile,
          email: formData.email,
          aadhar: formData.aadhar,
          walletAddress: formData.walletAddress,
          address: formData.address || undefined,
          pincode: formData.pincode || undefined,
          state: formData.state || undefined,
          coordinates: coordinates || undefined,
          ownershipDocument: formData.ownershipDocument || undefined,
          ipfsData: formData.ipfsData || undefined,
          status: 'pending',
          createdAt: new Date()
        };

        setUsers(prev => [...prev, newUser]);
        toast.success('Registration submitted successfully! Your application is pending admin approval.');
        setCurrentView('login');
        
      }, [formData, coordinates, users]);

      return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 shadow-xl">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="bg-green-600 text-white p-2 rounded-lg">
                    <Leaf className="h-6 w-6" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">BlueMercantile Registration</h1>
                </div>
                <p className="text-gray-600">Join the Carbon Credit Management Platform</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="userType">User Type *</Label>
                  <Select value={formData.userType} onValueChange={(value) => setFormData(prev => ({ ...prev, userType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patron">Patron (Farmer/NGO/Panchayat)</SelectItem>
                      <SelectItem value="credit_client">Credit Client</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.userType && (
                  <>
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder="Enter full name"
                        required
                      />
                    </div>

                    {formData.userType === 'patron' && (
                      <div>
                        <Label htmlFor="entityType">Type of Entity *</Label>
                        <Select value={formData.entityType} onValueChange={(value) => setFormData(prev => ({ ...prev, entityType: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select entity type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Farmer">Farmer</SelectItem>
                            <SelectItem value="NGO">NGO</SelectItem>
                            <SelectItem value="Panchayat">Panchayat</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="mobile">Mobile Number *</Label>
                        <Input
                          id="mobile"
                          value={formData.mobile}
                          onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                          placeholder="+91-XXXXXXXXXX"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="user@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="aadhar">Aadhar Number *</Label>
                        <Input
                          id="aadhar"
                          value={formData.aadhar}
                          onChange={(e) => setFormData(prev => ({ ...prev, aadhar: e.target.value }))}
                          placeholder="XXXX-XXXX-XXXX"
                          maxLength={14}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="walletAddress">Wallet Address *</Label>
                        <Input
                          id="walletAddress"
                          value={formData.walletAddress}
                          onChange={(e) => setFormData(prev => ({ ...prev, walletAddress: e.target.value }))}
                          placeholder="0x..."
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button type="submit" className="bg-green-600 hover:bg-green-700">
                        Submit Registration
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setCurrentView('login')}
                      >
                        Back to Login
                      </Button>
                    </div>
                  </>
                )}
              </form>
            </Card>
          </div>
        </div>
      );
    };
  }, [users]);

  // Dashboard component with Web3 integration
  const Dashboard = useMemo(() => {
    return function DashboardComponent() {
      if (!auth.isAuthenticated || !auth.user) {
        return null;
      }

      const handleLogout = useCallback(() => {
        setAuth({ isAuthenticated: false, user: null });
        setCurrentView('login');
        toast.success('Logged out successfully');
      }, []);

      // Lazy load Web3 components to prevent blocking
      const Web3DashboardComponent = React.lazy(() => import('./components/Web3DashboardFixed'));

      if (auth.user.type === 'admin') {
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm border-b">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-600 text-white p-2 rounded-lg">
                      <Leaf className="h-6 w-6" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">BlueMercantile Admin</h1>
                      <p className="text-sm text-gray-600">Carbon Credit Management Platform</p>
                    </div>
                  </div>
                  <Button onClick={handleLogout} variant="outline" size="sm">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="plantation">Track Plantation</TabsTrigger>
                  <TabsTrigger value="users">User Management</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                        </div>
                        <Users className="h-8 w-8 text-blue-500" />
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Pending Approvals</h3>
                          <p className="text-2xl font-bold text-gray-900">
                            {users.filter(u => u.status === 'pending').length}
                          </p>
                        </div>
                        <UserCheck className="h-8 w-8 text-yellow-500" />
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Approved Users</h3>
                          <p className="text-2xl font-bold text-gray-900">
                            {users.filter(u => u.status === 'approved').length}
                          </p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="plantation" className="mt-8">
                  <PlantationTracker />
                </TabsContent>

                <TabsContent value="users" className="mt-8">
                  <Card className="p-6">
                    <h2 className="text-lg font-semibold mb-4">User Management</h2>
                    <p className="text-gray-600">User management features here...</p>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        );
      }

      // User dashboards with Web3 integration
      return (
        <div className="min-h-screen bg-gray-50">
          <div className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-600 text-white p-2 rounded-lg">
                    <Leaf className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">
                      {auth.user.type === 'patron' ? 'Patron Dashboard' : 'Credit Client Dashboard'}
                    </h1>
                    <p className="text-sm text-gray-600">Welcome, {auth.user.fullName}</p>
                  </div>
                </div>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Web3 Dashboard with Error Boundary */}
            <Web3ErrorBoundary>
              <React.Suspense fallback={
                <Card className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </div>
                </Card>
              }>
                <Web3DashboardComponent userType={auth.user.type as 'patron' | 'credit_client'} />
              </React.Suspense>
            </Web3ErrorBoundary>
          </div>
        </div>
      );
    };
  }, [auth, users]);

  // Main render logic
  return (
    <>
      <Web3ConfigHelper />
      {currentView === 'login' && <LoginForm />}
      {currentView === 'register' && <RegistrationForm />}
      {currentView === 'dashboard' && <Dashboard />}
      <Toaster />
    </>
  );
}