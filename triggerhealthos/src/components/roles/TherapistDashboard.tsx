import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import RoleCard from '../ui/RoleCard';
import TriggerButton from '../ui/TriggerButton';

const TherapistDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">
          Welcome, {user?.name}
        </h1>
        <p className="text-secondary-600">
          Today's focus: Supervision and client progress monitoring
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RoleCard
          title="Supervision & Feedback"
          description="Provide guidance and feedback to interns"
        >
          <TriggerButton
            trigger="/sendfeedback"
            label="Send Feedback"
            description="Provide feedback on intern session"
            variant="success"
            requiresClientId={true}
          />
          
          <TriggerButton
            trigger="/checkprogress"
            label="Check Progress"
            description="Review intern's progress with client"
            variant="primary"
            requiresClientId={true}
          />
        </RoleCard>

        <RoleCard
          title="Client Overview"
          description="Monitor client progress across all interns"
        >
          <div className="space-y-3">
            <div className="bg-white border border-secondary-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-secondary-900">CL-001</span>
                <span className="text-sm text-success-600 bg-success-100 px-2 py-1 rounded">On Track</span>
              </div>
              <p className="text-sm text-secondary-600">Intern: Alex Chen</p>
              <p className="text-sm text-secondary-500">Last feedback: 3 days ago</p>
            </div>
            
            <div className="bg-white border border-secondary-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-secondary-900">CL-007</span>
                <span className="text-sm text-warning-600 bg-warning-100 px-2 py-1 rounded">Needs Review</span>
              </div>
              <p className="text-sm text-secondary-600">Intern: Maria Rodriguez</p>
              <p className="text-sm text-secondary-500">Feedback requested: 1 day ago</p>
            </div>
            
            <div className="bg-white border border-secondary-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-secondary-900">CL-012</span>
                <span className="text-sm text-primary-600 bg-primary-100 px-2 py-1 rounded">New Assignment</span>
              </div>
              <p className="text-sm text-secondary-600">Intern: Alex Chen</p>
              <p className="text-sm text-secondary-500">Assigned: Today</p>
            </div>
          </div>
        </RoleCard>
      </div>

      <div className="mt-8">
        <RoleCard
          title="Supervision Dashboard"
          description="Track intern progress and supervision activities"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary-50 p-4 rounded-lg">
              <h3 className="font-semibold text-primary-900 mb-2">Pending Reviews</h3>
              <div className="text-2xl font-bold text-primary-800 mb-1">4</div>
              <p className="text-sm text-primary-700">Sessions awaiting feedback</p>
            </div>
            
            <div className="bg-success-50 p-4 rounded-lg">
              <h3 className="font-semibold text-success-900 mb-2">Completed This Week</h3>
              <div className="text-2xl font-bold text-success-800 mb-1">12</div>
              <p className="text-sm text-success-700">Feedback sessions provided</p>
            </div>
            
            <div className="bg-warning-50 p-4 rounded-lg">
              <h3 className="font-semibold text-warning-900 mb-2">Active Interns</h3>
              <div className="text-2xl font-bold text-warning-800 mb-1">3</div>
              <p className="text-sm text-warning-700">Under supervision</p>
            </div>
          </div>
        </RoleCard>
      </div>

      <div className="mt-6">
        <RoleCard
          title="Intern Progress Summary"
          description="Overview of intern development and performance"
        >
          <div className="space-y-4">
            <div className="bg-white border border-secondary-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-secondary-900">Alex Chen</h4>
                <span className="text-sm text-success-600 bg-success-100 px-2 py-1 rounded">Excellent Progress</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-secondary-600">Sessions</p>
                  <p className="font-semibold text-secondary-900">24</p>
                </div>
                <div>
                  <p className="text-secondary-600">Feedback Score</p>
                  <p className="font-semibold text-secondary-900">4.8/5</p>
                </div>
                <div>
                  <p className="text-secondary-600">Client Satisfaction</p>
                  <p className="font-semibold text-secondary-900">95%</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-secondary-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-secondary-900">Maria Rodriguez</h4>
                <span className="text-sm text-warning-600 bg-warning-100 px-2 py-1 rounded">Needs Support</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-secondary-600">Sessions</p>
                  <p className="font-semibold text-secondary-900">18</p>
                </div>
                <div>
                  <p className="text-secondary-600">Feedback Score</p>
                  <p className="font-semibold text-secondary-900">4.2/5</p>
                </div>
                <div>
                  <p className="text-secondary-600">Client Satisfaction</p>
                  <p className="font-semibold text-secondary-900">88%</p>
                </div>
              </div>
            </div>
          </div>
        </RoleCard>
      </div>

      <div className="mt-6">
        <RoleCard
          title="Quick Actions"
          description="Frequently used supervision tools"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-primary-50 p-4 rounded-lg">
              <h3 className="font-semibold text-primary-900 mb-2">Today's Schedule</h3>
              <ul className="text-sm text-primary-800 space-y-1">
                <li>• 10:00 AM - Supervision with Alex</li>
                <li>• 2:00 PM - Review session CL-007</li>
                <li>• 4:00 PM - Team meeting</li>
              </ul>
            </div>
            
            <div className="bg-success-50 p-4 rounded-lg">
              <h3 className="font-semibold text-success-900 mb-2">Action Items</h3>
              <ul className="text-sm text-success-800 space-y-1">
                <li>• Review Maria's progress plan</li>
                <li>• Update supervision notes</li>
                <li>• Schedule client consultation</li>
              </ul>
            </div>
          </div>
        </RoleCard>
      </div>
    </div>
  );
};

export default TherapistDashboard;