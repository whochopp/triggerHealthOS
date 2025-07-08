import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTrigger } from '../../contexts/TriggerContext';
import RoleCard from '../ui/RoleCard';
import TriggerButton from '../ui/TriggerButton';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { triggerLog } = useTrigger();

  const recentTriggers = triggerLog.slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">
          Welcome, {user?.name}
        </h1>
        <p className="text-secondary-600">
          System overview and administrative controls
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-primary-50 p-6 rounded-lg">
          <h3 className="font-semibold text-primary-900 mb-2">Total Triggers</h3>
          <div className="text-3xl font-bold text-primary-800 mb-1">{triggerLog.length}</div>
          <p className="text-sm text-primary-700">All time system activity</p>
        </div>
        
        <div className="bg-success-50 p-6 rounded-lg">
          <h3 className="font-semibold text-success-900 mb-2">Active Users</h3>
          <div className="text-3xl font-bold text-success-800 mb-1">6</div>
          <p className="text-sm text-success-700">Currently using system</p>
        </div>
        
        <div className="bg-warning-50 p-6 rounded-lg">
          <h3 className="font-semibold text-warning-900 mb-2">System Health</h3>
          <div className="text-3xl font-bold text-warning-800 mb-1">98%</div>
          <p className="text-sm text-warning-700">Uptime this month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RoleCard
          title="System Administration"
          description="Manage system-wide operations and data"
        >
          <TriggerButton
            trigger="/syncgpt"
            label="Sync GPT"
            description="Export data for AI analysis and insights"
            variant="secondary"
            requiresConfirmation={true}
          />
          
          <div className="bg-secondary-50 p-4 rounded-lg">
            <h4 className="font-semibold text-secondary-900 mb-2">Data Export</h4>
            <p className="text-sm text-secondary-700 mb-3">
              Export trigger logs and analytics for external analysis
            </p>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Download CSV Report
            </button>
          </div>
        </RoleCard>

        <RoleCard
          title="Recent System Activity"
          description="Latest triggers and system events"
        >
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {recentTriggers.length > 0 ? (
              recentTriggers.map((trigger) => (
                <div key={trigger.id} className="bg-white border border-secondary-200 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-secondary-900">{trigger.trigger}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      trigger.success 
                        ? 'bg-success-100 text-success-800' 
                        : 'bg-danger-100 text-danger-800'
                    }`}>
                      {trigger.success ? 'Success' : 'Failed'}
                    </span>
                  </div>
                  <p className="text-sm text-secondary-600">{trigger.role}</p>
                  <p className="text-xs text-secondary-500">
                    {new Date(trigger.timestamp).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-secondary-500 text-sm">No recent activity</p>
            )}
          </div>
        </RoleCard>
      </div>

      <div className="mt-8">
        <RoleCard
          title="Role Performance Analytics"
          description="Activity breakdown by user role"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-primary-50 p-4 rounded-lg">
              <h4 className="font-semibold text-primary-900 mb-1">Receptionist</h4>
              <div className="text-2xl font-bold text-primary-800 mb-1">24</div>
              <p className="text-sm text-primary-700">Triggers today</p>
            </div>
            
            <div className="bg-success-50 p-4 rounded-lg">
              <h4 className="font-semibold text-success-900 mb-1">Interns</h4>
              <div className="text-2xl font-bold text-success-800 mb-1">18</div>
              <p className="text-sm text-success-700">Triggers today</p>
            </div>
            
            <div className="bg-warning-50 p-4 rounded-lg">
              <h4 className="font-semibold text-warning-900 mb-1">Therapists</h4>
              <div className="text-2xl font-bold text-warning-800 mb-1">12</div>
              <p className="text-sm text-warning-700">Triggers today</p>
            </div>
            
            <div className="bg-secondary-50 p-4 rounded-lg">
              <h4 className="font-semibold text-secondary-900 mb-1">Admin</h4>
              <div className="text-2xl font-bold text-secondary-800 mb-1">3</div>
              <p className="text-sm text-secondary-700">Triggers today</p>
            </div>
          </div>
        </RoleCard>
      </div>

      <div className="mt-6">
        <RoleCard
          title="System Metrics"
          description="Key performance indicators and system health"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-white border border-secondary-200 rounded-lg p-4">
                <h4 className="font-semibold text-secondary-900 mb-2">Client Flow</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>New Clients (Today):</span>
                    <span className="font-medium">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Forms Completed:</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Assignments Made:</span>
                    <span className="font-medium">8</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-secondary-200 rounded-lg p-4">
                <h4 className="font-semibold text-secondary-900 mb-2">Session Activity</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Sessions Logged:</span>
                    <span className="font-medium">15</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Feedback Requests:</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Feedback Provided:</span>
                    <span className="font-medium">6</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white border border-secondary-200 rounded-lg p-4">
                <h4 className="font-semibold text-secondary-900 mb-2">System Issues</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Failed Triggers:</span>
                    <span className="font-medium text-danger-600">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Webhook Failures:</span>
                    <span className="font-medium text-danger-600">1</span>
                  </div>
                  <div className="flex justify-between">
                    <span>API Errors:</span>
                    <span className="font-medium text-danger-600">0</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-secondary-200 rounded-lg p-4">
                <h4 className="font-semibold text-secondary-900 mb-2">Performance</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Avg Response Time:</span>
                    <span className="font-medium">245ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Rate:</span>
                    <span className="font-medium text-success-600">97.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Connections:</span>
                    <span className="font-medium">24</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RoleCard>
      </div>
    </div>
  );
};

export default AdminDashboard;