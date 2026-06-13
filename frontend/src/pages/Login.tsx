import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export const Login: React.FC = () => {
  const [token, setToken] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { setToken: storeToken, toggleDemoMode } = useStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      alert('Please enter a valid API token');
      return;
    }

    setIsLoading(true);
    try {
      // Validate token with Deriv API
      storeToken(token);
      if (!isDemoMode) {
        toggleDemoMode();
      }
      navigate('/trading');
    } catch (error) {
      alert('Invalid token. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">
          Deriv Trading
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Live Trading Platform
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Token
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter your Deriv API token"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-2">
              Get your token from Deriv Security settings
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="demoMode"
              checked={isDemoMode}
              onChange={() => setIsDemoMode(!isDemoMode)}
              className="h-4 w-4 text-blue-600"
            />
            <label htmlFor="demoMode" className="ml-2 text-sm text-gray-700">
              Use Demo Account
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition disabled:bg-gray-400"
          >
            {isLoading ? 'Connecting...' : 'Connect'}
          </button>
        </form>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-sm mb-2">Demo Features:</h3>
          <ul className="text-xs text-gray-700 space-y-1">
            <li>✓ Real-time market data</li>
            <li>✓ Practice trading with virtual funds</li>
            <li>✓ Live price charts</li>
            <li>✓ Portfolio tracking</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
