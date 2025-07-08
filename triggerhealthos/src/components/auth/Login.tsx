import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Role } from '../../types';

const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | ''>('');
  const [error, setError] = useState('');
  const [loginMode, setLoginMode] = useState<'role' | 'credentials'>('role');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (loginMode === 'role' && selectedRole) {
        await login('', selectedRole as Role);
      } else if (loginMode === 'credentials') {
        await login(email, password);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const handleRoleLogin = async (role: Role) => {
    setError('');
    try {
      await login('', role);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const roleInfo = {
    receptionist: {
      name: 'Receptionist',
      description: 'Manage new clients, forms, and appointments',
      color: 'bg-primary-500',
    },
    intern: {
      name: 'Intern',
      description: 'Log sessions and request feedback',
      color: 'bg-success-500',
    },
    therapist: {
      name: 'Therapist',
      description: 'Provide feedback and monitor progress',
      color: 'bg-warning-500',
    },
    admin: {
      name: 'Admin',
      description: 'Full access to all features and analytics',
      color: 'bg-secondary-500',
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            TriggerHealthOS
          </h1>
          <p className="text-secondary-600">
            Mental Health Therapy Management System
          </p>
        </div>

        {error && (
          <div className="bg-danger-50 border border-danger-200 rounded-lg p-4 mb-6">
            <p className="text-danger-800 text-sm">{error}</p>
          </div>
        )}

        <div className="mb-6">
          <div className="flex bg-secondary-100 rounded-lg p-1">
            <button
              onClick={() => setLoginMode('role')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginMode === 'role'
                  ? 'bg-white text-secondary-900 shadow-sm'
                  : 'text-secondary-600 hover:text-secondary-900'
              }`}
            >
              Quick Role Login
            </button>
            <button
              onClick={() => setLoginMode('credentials')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginMode === 'credentials'
                  ? 'bg-white text-secondary-900 shadow-sm'
                  : 'text-secondary-600 hover:text-secondary-900'
              }`}
            >
              Email & Password
            </button>
          </div>
        </div>

        {loginMode === 'role' ? (
          <div className="space-y-3">
            <p className="text-sm text-secondary-600 mb-4">
              Select your role to login (demo mode):
            </p>
            {Object.entries(roleInfo).map(([role, info]) => (
              <button
                key={role}
                onClick={() => handleRoleLogin(role as Role)}
                disabled={isLoading}
                className={`w-full p-4 rounded-lg border-2 border-transparent ${info.color} hover:opacity-90 transition-opacity text-white text-left disabled:opacity-50`}
              >
                <div className="font-semibold mb-1">{info.name}</div>
                <div className="text-sm opacity-90">{info.description}</div>
              </button>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="input-field"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full trigger-button disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Logging in...
                </div>
              ) : (
                'Login'
              )}
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-secondary-200">
          <div className="text-center text-sm text-secondary-600">
            <p className="mb-2">Demo Credentials:</p>
            <div className="text-xs space-y-1">
              <p>Receptionist: sarah@clinic.com / receptionist123</p>
              <p>Intern: alex@clinic.com / intern123</p>
              <p>Therapist: david@clinic.com / therapist123</p>
              <p>Admin: admin@clinic.com / admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;