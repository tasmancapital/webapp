import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, user, loading, error: authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState({
    database: 'Checking...',
    customAuth: 'Checking...',
    lastError: null as Error | null
  });

  // Check if already logged in
  useEffect(() => {
    if (user) {
      navigate('/editor');
    }
  }, [user, navigate]);

  // Check database connection and custom auth tables
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Test database connection with basic query
        const { error: pagesError } = await supabase
          .from('pages')
          .select('count')
          .limit(1)
          .single();
          
        if (pagesError) {
          console.error('Database connection error:', pagesError.message);
          setConnectionStatus(prev => ({
            ...prev,
            database: 'Error',
            lastError: pagesError
          }));
        } else {
          console.log('Database connected successfully');
          setConnectionStatus(prev => ({
            ...prev,
            database: 'Connected'
          }));
        }
        
        // Check custom auth tables
        const { error: adminUsersError } = await supabase
          .from('admin_users')
          .select('count')
          .limit(1)
          .single();
        
        if (adminUsersError) {
          console.error('Custom auth tables error:', adminUsersError.message);
          setConnectionStatus(prev => ({
            ...prev,
            customAuth: 'Error - Tables Missing',
            lastError: adminUsersError
          }));
        } else {
          console.log('Custom auth tables exist');
          setConnectionStatus(prev => ({
            ...prev,
            customAuth: 'Tables Ready'
          }));
        }
      } catch (err) {
        console.error('Unexpected connection error:', err);
        setConnectionStatus(prev => ({
          ...prev,
          database: 'Error',
          lastError: err instanceof Error ? err : new Error('Unknown error')
        }));
      }
    };
    
    checkConnection();
  }, []);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    
    try {
      console.log(`Attempting to login with: ${email}`);
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error('Login error:', error.message);
        setLoginError(error.message);
      } else {
        console.log('Login successful, navigating to editor');
        navigate('/editor');
      }
    } catch (err) {
      console.error('Unexpected login error:', err);
      setLoginError('An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tasman Capital</h1>
          <h2 className="text-xl font-semibold text-gray-700">Sign in to your account</h2>
        </div>
        
        {/* Connection Status */}
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Connection Status</h3>
          <div className="text-sm space-y-1">
            <p>Database: <span className={connectionStatus.database === 'Connected' ? 'text-green-600' : 'text-red-600'}>{connectionStatus.database}</span></p>
            <p>Custom Auth: <span className={connectionStatus.customAuth === 'Tables Ready' ? 'text-green-600' : 'text-red-600'}>{connectionStatus.customAuth}</span></p>
            
            {connectionStatus.lastError && (
              <div className="mt-2 text-red-600 text-xs">
                <p>Error: {connectionStatus.lastError.message}</p>
                {connectionStatus.customAuth === 'Error - Tables Missing' && (
                  <div className="mt-1 p-2 bg-yellow-50 rounded border border-yellow-200">
                    <p className="font-semibold">Migration Required</p>
                    <p>Run the following command to create auth tables:</p>
                    <code className="block mt-1 p-1 bg-gray-100 text-xs overflow-x-auto">
                      npx supabase db push
                    </code>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Login Form */}
        <form className="mt-6 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {(loginError || authError) && (
            <div className="text-red-600 text-sm">
              {loginError || (authError && authError.message)}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        
        {/* Test Credentials */}
        <div className="mt-4 text-center text-sm text-gray-500">
          <p className="mb-1">Test credentials:</p>
          <p className="font-mono text-xs">tito@nrgy.com.au / !Daftfunk1</p>
          <p className="font-mono text-xs">admin@tasmancapital.com.au / Tasman!!2025</p>
        </div>
      </div>
    </div>
  );
};

export default Login;