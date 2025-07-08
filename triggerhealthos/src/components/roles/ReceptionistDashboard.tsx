import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import RoleCard from '../ui/RoleCard';
import TriggerButton from '../ui/TriggerButton';

const ReceptionistDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">
          Welcome, {user?.name}
        </h1>
        <p className="text-secondary-600">
          Today's focus: Managing client intake and appointments
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RoleCard
          title="Client Management"
          description="Manage new clients and intake processes"
        >
          <TriggerButton
            trigger="/newclient"
            label="New Client"
            description="Log a new client into the system"
            variant="primary"
            requiresClientId={true}
          />
          
          <TriggerButton
            trigger="/formreceived"
            label="Form Received"
            description="Mark client intake form as received"
            variant="success"
            requiresClientId={true}
          />
          
          <TriggerButton
            trigger="/assignclient"
            label="Assign Client"
            description="Assign client to intern or therapist"
            variant="primary"
            requiresClientId={true}
          />
        </RoleCard>

        <RoleCard
          title="Appointment Management"
          description="Handle appointment scheduling and no-shows"
        >
          <TriggerButton
            trigger="/noshow"
            label="No Show"
            description="Log when a client doesn't show up"
            variant="danger"
            requiresClientId={true}
            requiresConfirmation={true}
          />
          
          <TriggerButton
            trigger="/remindform"
            label="Remind Form"
            description="Send form completion reminder"
            variant="warning"
            requiresClientId={true}
          />
        </RoleCard>
      </div>

      <div className="mt-8">
        <RoleCard
          title="Quick Actions"
          description="Frequently used actions for efficient workflow"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-primary-50 p-4 rounded-lg">
              <h3 className="font-semibold text-primary-900 mb-2">Today's Tasks</h3>
              <ul className="text-sm text-primary-800 space-y-1">
                <li>• Review pending intake forms</li>
                <li>• Follow up on missed appointments</li>
                <li>• Assign new clients to available staff</li>
              </ul>
            </div>
            
            <div className="bg-success-50 p-4 rounded-lg">
              <h3 className="font-semibold text-success-900 mb-2">Client Status</h3>
              <div className="text-sm text-success-800 space-y-1">
                <div className="flex justify-between">
                  <span>Pending Forms:</span>
                  <span className="font-medium">5</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Clients:</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span>Assigned Today:</span>
                  <span className="font-medium">3</span>
                </div>
              </div>
            </div>
          </div>
        </RoleCard>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;