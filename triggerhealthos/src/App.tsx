import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TriggerProvider } from './contexts/TriggerContext';
import Login from './components/auth/Login';
import ReceptionistDashboard from './components/roles/ReceptionistDashboard';
import InternDashboard from './components/roles/InternDashboard';
import TherapistDashboard from './components/roles/TherapistDashboard';
import AdminDashboard from './components/roles/AdminDashboard';

const DashboardRouter: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <Login />;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'receptionist':
        return <ReceptionistDashboard />;
      case 'intern':
        return <InternDashboard />;
      case 'therapist':
        return <TherapistDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <header className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-secondary-900">
                TriggerHealthOS
              </h1>
              <span className="text-sm text-secondary-600">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-secondary-600">
                {user.name}
              </span>
              <button
                onClick={logout}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="pb-12">
        {renderDashboard()}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <TriggerProvider>
        <DashboardRouter />
      </TriggerProvider>
    </AuthProvider>
  );
}

export default App;
