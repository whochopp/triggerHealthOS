import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { TriggerLog, TriggerType, TriggerContextType, ApiResponse } from '../types';
import { useAuth } from './AuthContext';
import { airtableService } from '../services/airtable';
import { webhookService } from '../services/webhook';

// Trigger state interface
interface TriggerState {
  triggerLog: TriggerLog[];
  isExecuting: boolean;
  lastTrigger: TriggerLog | null;
  error: string | null;
}

// Trigger actions
type TriggerAction =
  | { type: 'EXECUTE_START' }
  | { type: 'EXECUTE_SUCCESS'; payload: TriggerLog }
  | { type: 'EXECUTE_FAILURE'; payload: string }
  | { type: 'LOAD_LOGS'; payload: TriggerLog[] }
  | { type: 'ADD_LOG'; payload: TriggerLog }
  | { type: 'CLEAR_ERROR' };

// Initial state
const initialState: TriggerState = {
  triggerLog: [],
  isExecuting: false,
  lastTrigger: null,
  error: null,
};

// Trigger reducer
const triggerReducer = (state: TriggerState, action: TriggerAction): TriggerState => {
  switch (action.type) {
    case 'EXECUTE_START':
      return {
        ...state,
        isExecuting: true,
        error: null,
      };
    case 'EXECUTE_SUCCESS':
      return {
        ...state,
        isExecuting: false,
        lastTrigger: action.payload,
        triggerLog: [action.payload, ...state.triggerLog],
        error: null,
      };
    case 'EXECUTE_FAILURE':
      return {
        ...state,
        isExecuting: false,
        error: action.payload,
      };
    case 'LOAD_LOGS':
      return {
        ...state,
        triggerLog: action.payload,
      };
    case 'ADD_LOG':
      return {
        ...state,
        triggerLog: [action.payload, ...state.triggerLog],
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Create Trigger context
const TriggerContext = createContext<TriggerContextType | undefined>(undefined);

// Trigger provider component
export const TriggerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(triggerReducer, initialState);
  const { user } = useAuth();

  // Load trigger logs on component mount
  useEffect(() => {
    if (user) {
      loadTriggerLogs();
    }
  }, [user]);

  // Load trigger logs from Airtable
  const loadTriggerLogs = async (limit: number = 50) => {
    try {
      const filters = user?.role !== 'admin' ? { user_id: user?.id } : undefined;
      const response = await airtableService.getTriggerLogs({ ...filters, limit });
      
      if (response.success && response.data) {
        dispatch({ type: 'LOAD_LOGS', payload: response.data });
      }
    } catch (error) {
      console.error('Error loading trigger logs:', error);
    }
  };

  // Execute trigger function
  const executeTrigger = async (trigger: TriggerType, data?: any): Promise<ApiResponse> => {
    if (!user) {
      return {
        success: false,
        error: 'User not authenticated',
      };
    }

    dispatch({ type: 'EXECUTE_START' });

    try {
      // Prepare trigger data
      const triggerData = {
        trigger,
        role: user.role,
        user_id: user.id,
        timestamp: new Date().toISOString(),
        client_id: data?.client_id,
        additional_data: data,
        success: true,
      };

      // Log trigger to Airtable
      const logResponse = await airtableService.logTrigger(triggerData);

      if (!logResponse.success) {
        throw new Error(logResponse.error || 'Failed to log trigger');
      }

      // Send webhook if configured
      let webhookResponse: ApiResponse | null = null;
      try {
        webhookResponse = await webhookService.sendTriggerWebhook(
          trigger,
          user.role,
          user.id,
          data?.client_id,
          data
        );
      } catch (webhookError) {
        console.warn('Webhook failed, but trigger was logged:', webhookError);
      }

      // Process specific trigger logic
      await processTriggerLogic(trigger, data);

      const successLog = logResponse.data!;
      dispatch({ type: 'EXECUTE_SUCCESS', payload: successLog });

      return {
        success: true,
        data: {
          log: successLog,
          webhook: webhookResponse,
        },
        message: 'Trigger executed successfully',
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Trigger execution failed';
      
      // Log failed trigger
      try {
        const failedTriggerData = {
          trigger,
          role: user.role,
          user_id: user.id,
          timestamp: new Date().toISOString(),
          client_id: data?.client_id,
          additional_data: data,
          success: false,
          error_message: errorMessage,
        };

        const failedLogResponse = await airtableService.logTrigger(failedTriggerData);
        if (failedLogResponse.success) {
          dispatch({ type: 'ADD_LOG', payload: failedLogResponse.data! });
        }
      } catch (logError) {
        console.error('Failed to log trigger failure:', logError);
      }

      dispatch({ type: 'EXECUTE_FAILURE', payload: errorMessage });
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  // Process specific trigger logic
  const processTriggerLogic = async (trigger: TriggerType, data?: any): Promise<void> => {
    switch (trigger) {
      case '/newclient':
        await handleNewClient(data);
        break;
      case '/formreceived':
        await handleFormReceived(data);
        break;
      case '/assignclient':
        await handleAssignClient(data);
        break;
      case '/noshow':
        await handleNoShow(data);
        break;
      case '/remindform':
        await handleRemindForm(data);
        break;
      case '/logsession':
        await handleLogSession(data);
        break;
      case '/needsfeedback':
        await handleNeedsFeedback(data);
        break;
      case '/latefollowup':
        await handleLateFollowUp(data);
        break;
      case '/sendfeedback':
        await handleSendFeedback(data);
        break;
      case '/checkprogress':
        await handleCheckProgress(data);
        break;
      case '/syncgpt':
        await handleSyncGPT(data);
        break;
      default:
        console.warn(`Unknown trigger: ${trigger}`);
    }
  };

  // Trigger-specific handlers
  const handleNewClient = async (data: any) => {
    if (data?.client_id) {
      await airtableService.createClient({
        client_id: data.client_id,
        intake_status: 'pending',
      });
    }
  };

  const handleFormReceived = async (data: any) => {
    if (data?.client_id) {
      await airtableService.updateClient(data.client_id, {
        intake_status: 'received',
      });
    }
  };

  const handleAssignClient = async (data: any) => {
    if (data?.client_id && data?.assigned_to && data?.assigned_role) {
      const updates = data.assigned_role === 'intern' 
        ? { assigned_intern: data.assigned_to }
        : { assigned_therapist: data.assigned_to };
      
      await airtableService.updateClient(data.client_id, updates);
    }
  };

  const handleNoShow = async (data: any) => {
    // Log no-show for tracking purposes
    console.log('No-show logged for client:', data?.client_id);
  };

  const handleRemindForm = async (data: any) => {
    // Reminder logic would trigger external systems
    console.log('Form reminder sent for client:', data?.client_id);
  };

  const handleLogSession = async (data: any) => {
    // Session logging logic
    console.log('Session logged for client:', data?.client_id);
  };

  const handleNeedsFeedback = async (data: any) => {
    // Flag session for therapist feedback
    console.log('Feedback needed for session:', data?.session_id);
  };

  const handleLateFollowUp = async (data: any) => {
    // Late follow-up tracking
    console.log('Late follow-up logged for client:', data?.client_id);
  };

  const handleSendFeedback = async (data: any) => {
    // Feedback processing
    console.log('Feedback sent for session:', data?.session_id);
  };

  const handleCheckProgress = async (data: any) => {
    // Progress check logic
    console.log('Progress check for client:', data?.client_id);
  };

  const handleSyncGPT = async (data: any) => {
    // Export data for GPT analysis
    const exportResponse = await airtableService.exportTriggerLogs();
    if (exportResponse.success) {
      console.log('GPT sync completed, exported logs:', exportResponse.data?.length);
    }
  };

  // Clear error function
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Context value
  const value: TriggerContextType = {
    triggerLog: state.triggerLog,
    executeTrigger,
    isExecuting: state.isExecuting,
    lastTrigger: state.lastTrigger,
  };

  return (
    <TriggerContext.Provider value={value}>
      {children}
    </TriggerContext.Provider>
  );
};

// Custom hook to use trigger context
export const useTrigger = (): TriggerContextType => {
  const context = useContext(TriggerContext);
  if (context === undefined) {
    throw new Error('useTrigger must be used within a TriggerProvider');
  }
  return context;
};

// Helper function to get trigger display name
export const getTriggerDisplayName = (trigger: TriggerType): string => {
  const names: Record<TriggerType, string> = {
    '/newclient': 'New Client',
    '/formreceived': 'Form Received',
    '/assignclient': 'Assign Client',
    '/noshow': 'No Show',
    '/remindform': 'Remind Form',
    '/logsession': 'Log Session',
    '/needsfeedback': 'Needs Feedback',
    '/latefollowup': 'Late Follow-up',
    '/sendfeedback': 'Send Feedback',
    '/checkprogress': 'Check Progress',
    '/syncgpt': 'Sync GPT',
  };
  return names[trigger] || trigger;
};

// Helper function to get trigger color
export const getTriggerColor = (trigger: TriggerType): string => {
  const colors: Record<TriggerType, string> = {
    '/newclient': 'primary',
    '/formreceived': 'success',
    '/assignclient': 'primary',
    '/noshow': 'danger',
    '/remindform': 'warning',
    '/logsession': 'success',
    '/needsfeedback': 'warning',
    '/latefollowup': 'danger',
    '/sendfeedback': 'success',
    '/checkprogress': 'primary',
    '/syncgpt': 'secondary',
  };
  return colors[trigger] || 'secondary';
};

export default TriggerContext;