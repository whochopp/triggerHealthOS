// User and Role Types
export type Role = 'receptionist' | 'intern' | 'therapist' | 'admin';

export interface User {
  id: string;
  name: string;
  role: Role;
  email?: string;
  isActive: boolean;
}

// Trigger Types
export type TriggerType = 
  | '/newclient'
  | '/formreceived'
  | '/assignclient'
  | '/noshow'
  | '/remindform'
  | '/logsession'
  | '/needsfeedback'
  | '/latefollowup'
  | '/sendfeedback'
  | '/checkprogress'
  | '/syncgpt';

export interface TriggerLog {
  id: string;
  trigger: TriggerType;
  role: Role;
  client_id?: string;
  timestamp: string;
  user_id: string;
  additional_data?: Record<string, any>;
  success: boolean;
  error_message?: string;
}

// Client Types
export interface Client {
  id: string;
  intake_status: 'pending' | 'received' | 'completed';
  assigned_intern?: string;
  assigned_therapist?: string;
  created_at: string;
  updated_at: string;
}

// Session Types
export interface Session {
  id: string;
  client_id: string;
  intern_id: string;
  therapist_id?: string;
  session_date: string;
  completed: boolean;
  needs_feedback: boolean;
  feedback_provided: boolean;
  late_followup: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Airtable API Types
export interface AirtableRecord {
  id: string;
  fields: Record<string, any>;
  createdTime: string;
}

export interface AirtableResponse {
  records: AirtableRecord[];
  offset?: string;
}

// Component Props Types
export interface TriggerButtonProps {
  trigger: TriggerType;
  label: string;
  description?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  requiresClientId?: boolean;
  requiresConfirmation?: boolean;
}

export interface RoleCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

// Form Types
export interface ClientFormData {
  client_id: string;
  intake_status?: 'pending' | 'received' | 'completed';
}

export interface SessionFormData {
  client_id: string;
  notes?: string;
}

export interface FeedbackFormData {
  session_id: string;
  client_id: string;
  feedback_notes: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Context Types
export interface AuthContextType {
  user: User | null;
  login: (email: string, role: Role) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface TriggerContextType {
  triggerLog: TriggerLog[];
  executeTrigger: (trigger: TriggerType, data?: any) => Promise<ApiResponse>;
  isExecuting: boolean;
  lastTrigger: TriggerLog | null;
}

// Dashboard Stats Types
export interface DashboardStats {
  total_clients: number;
  pending_forms: number;
  completed_sessions: number;
  pending_feedback: number;
  active_interns: number;
  role_specific_stats: Record<Role, any>;
}

// Webhook Types
export interface ZapierWebhookPayload {
  trigger: TriggerType;
  client_id?: string;
  user_id: string;
  timestamp: string;
  additional_data?: Record<string, any>;
}

// Mock Data Types for Testing
export interface MockUser extends User {
  password?: string;
}

export interface MockClient extends Client {
  display_name?: string;
}