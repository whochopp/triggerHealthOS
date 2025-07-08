import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import RoleCard from '../ui/RoleCard';
import TriggerButton from '../ui/TriggerButton';

const InternDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">
          Welcome, {user?.name}
        </h1>
        <p className="text-secondary-600">
          Today's focus: Session management and learning progress
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RoleCard
          title="Session Management"
          description="Log sessions and track client progress"
        >
          <TriggerButton
            trigger="/logsession"
            label="Log Session"
            description="Record completion of therapy session"
            variant="success"
            requiresClientId={true}
          />
          
          <TriggerButton
            trigger="/needsfeedback"
            label="Needs Feedback"
            description="Request feedback from supervising therapist"
            variant="warning"
            requiresClientId={true}
          />
          
          <TriggerButton
            trigger="/latefollowup"
            label="Late Follow-up"
            description="Log when follow-up is delayed"
            variant="danger"
            requiresClientId={true}
            requiresConfirmation={true}
          />
        </RoleCard>

        <RoleCard
          title="My Assigned Clients"
          description="Track your current caseload"
        >
          <div className="space-y-3">
            <div className="bg-white border border-secondary-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-secondary-900">CL-001</span>
                <span className="text-sm text-success-600 bg-success-100 px-2 py-1 rounded">Active</span>
              </div>
              <p className="text-sm text-secondary-600">Last session: 2 days ago</p>
            </div>
            
            <div className="bg-white border border-secondary-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-secondary-900">CL-007</span>
                <span className="text-sm text-warning-600 bg-warning-100 px-2 py-1 rounded">Pending</span>
              </div>
              <p className="text-sm text-secondary-600">Next session: Tomorrow</p>
            </div>
            
            <div className="bg-white border border-secondary-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-secondary-900">CL-012</span>
                <span className="text-sm text-primary-600 bg-primary-100 px-2 py-1 rounded">Follow-up</span>
              </div>
              <p className="text-sm text-secondary-600">Session scheduled: This week</p>
            </div>
          </div>
        </RoleCard>
      </div>

      <div className="mt-8">
        <RoleCard
          title="Learning Progress"
          description="Track your development and feedback"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-success-50 p-4 rounded-lg">
              <h3 className="font-semibold text-success-900 mb-2">This Week</h3>
              <ul className="text-sm text-success-800 space-y-1">
                <li>• Sessions completed: 8</li>
                <li>• Feedback received: 3</li>
                <li>• Follow-ups scheduled: 2</li>
              </ul>
            </div>
            
            <div className="bg-warning-50 p-4 rounded-lg">
              <h3 className="font-semibold text-warning-900 mb-2">Action Items</h3>
              <ul className="text-sm text-warning-800 space-y-1">
                <li>• Review feedback from Dr. Wilson</li>
                <li>• Complete follow-up with CL-001</li>
                <li>• Schedule supervision meeting</li>
              </ul>
            </div>
          </div>
        </RoleCard>
      </div>

      <div className="mt-6">
        <RoleCard
          title="Resources"
          description="Quick access to learning materials and support"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary-50 p-4 rounded-lg text-center">
              <h4 className="font-semibold text-primary-900 mb-1">Therapy Guidelines</h4>
              <p className="text-sm text-primary-700">Session structure and best practices</p>
            </div>
            
            <div className="bg-secondary-50 p-4 rounded-lg text-center">
              <h4 className="font-semibold text-secondary-900 mb-1">Supervision Schedule</h4>
              <p className="text-sm text-secondary-700">Weekly meetings with supervisors</p>
            </div>
            
            <div className="bg-success-50 p-4 rounded-lg text-center">
              <h4 className="font-semibold text-success-900 mb-1">Progress Tracking</h4>
              <p className="text-sm text-success-700">Client progress and outcomes</p>
            </div>
          </div>
        </RoleCard>
      </div>
    </div>
  );
};

export default InternDashboard;