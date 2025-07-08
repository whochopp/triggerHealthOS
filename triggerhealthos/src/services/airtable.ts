import { TriggerLog, TriggerType, Role, ApiResponse, AirtableRecord, AirtableResponse, Client, Session } from '../types';

// Environment variables for Airtable configuration
const AIRTABLE_BASE_ID = process.env.REACT_APP_AIRTABLE_BASE_ID || 'appXXXXXXXXXXXXXX';
const AIRTABLE_API_KEY = process.env.REACT_APP_AIRTABLE_API_KEY || 'keyXXXXXXXXXXXXXX';
const AIRTABLE_API_URL = 'https://api.airtable.com/v0';

// Table names
const TABLES = {
  TRIGGER_LOGS: 'TriggerLogs',
  CLIENTS: 'Clients',
  SESSIONS: 'Sessions',
  USERS: 'Users',
};

class AirtableService {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor() {
    this.baseUrl = `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}`;
    this.headers = {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    };
  }

  // Generic method to make API calls to Airtable
  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
    data?: any
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}/${endpoint}`;
      const config: RequestInit = {
        method,
        headers: this.headers,
      };

      if (data && (method === 'POST' || method === 'PATCH')) {
        config.body = JSON.stringify(data);
      }

      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Airtable API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Log a trigger to Airtable
  async logTrigger(triggerData: Omit<TriggerLog, 'id'>): Promise<ApiResponse<TriggerLog>> {
    const record = {
      records: [
        {
          fields: {
            trigger: triggerData.trigger,
            role: triggerData.role,
            client_id: triggerData.client_id || '',
            timestamp: triggerData.timestamp,
            user_id: triggerData.user_id,
            additional_data: triggerData.additional_data ? JSON.stringify(triggerData.additional_data) : '',
            success: triggerData.success,
            error_message: triggerData.error_message || '',
          },
        },
      ],
    };

    const response = await this.makeRequest<AirtableResponse>(`${TABLES.TRIGGER_LOGS}`, 'POST', record);
    
    if (response.success && response.data?.records[0]) {
      const airtableRecord = response.data.records[0];
      const triggerLog: TriggerLog = {
        id: airtableRecord.id,
        trigger: airtableRecord.fields.trigger,
        role: airtableRecord.fields.role,
        client_id: airtableRecord.fields.client_id || undefined,
        timestamp: airtableRecord.fields.timestamp,
        user_id: airtableRecord.fields.user_id,
        additional_data: airtableRecord.fields.additional_data ? JSON.parse(airtableRecord.fields.additional_data) : undefined,
        success: airtableRecord.fields.success,
        error_message: airtableRecord.fields.error_message || undefined,
      };
      
      return {
        success: true,
        data: triggerLog,
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to log trigger',
    };
  }

  // Get trigger logs with optional filtering
  async getTriggerLogs(filters?: {
    role?: Role;
    trigger?: TriggerType;
    client_id?: string;
    user_id?: string;
    limit?: number;
  }): Promise<ApiResponse<TriggerLog[]>> {
    let endpoint = `${TABLES.TRIGGER_LOGS}?sort[0][field]=timestamp&sort[0][direction]=desc`;
    
    if (filters?.limit) {
      endpoint += `&maxRecords=${filters.limit}`;
    }

    // Add filters if provided
    const filterConditions: string[] = [];
    if (filters?.role) {
      filterConditions.push(`{role} = '${filters.role}'`);
    }
    if (filters?.trigger) {
      filterConditions.push(`{trigger} = '${filters.trigger}'`);
    }
    if (filters?.client_id) {
      filterConditions.push(`{client_id} = '${filters.client_id}'`);
    }
    if (filters?.user_id) {
      filterConditions.push(`{user_id} = '${filters.user_id}'`);
    }

    if (filterConditions.length > 0) {
      const filterFormula = filterConditions.length === 1 
        ? filterConditions[0] 
        : `AND(${filterConditions.join(', ')})`;
      endpoint += `&filterByFormula=${encodeURIComponent(filterFormula)}`;
    }

    const response = await this.makeRequest<AirtableResponse>(endpoint);
    
    if (response.success && response.data?.records) {
      const triggerLogs: TriggerLog[] = response.data.records.map(record => ({
        id: record.id,
        trigger: record.fields.trigger,
        role: record.fields.role,
        client_id: record.fields.client_id || undefined,
        timestamp: record.fields.timestamp,
        user_id: record.fields.user_id,
        additional_data: record.fields.additional_data ? JSON.parse(record.fields.additional_data) : undefined,
        success: record.fields.success,
        error_message: record.fields.error_message || undefined,
      }));
      
      return {
        success: true,
        data: triggerLogs,
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to get trigger logs',
    };
  }

  // Create a new client
  async createClient(clientData: { client_id: string; intake_status: 'pending' | 'received' | 'completed'; assigned_intern?: string; assigned_therapist?: string }): Promise<ApiResponse<Client>> {
    const record = {
      records: [
        {
          fields: {
            client_id: clientData.client_id,
            intake_status: clientData.intake_status,
            assigned_intern: clientData.assigned_intern || '',
            assigned_therapist: clientData.assigned_therapist || '',
          },
        },
      ],
    };

    const response = await this.makeRequest<AirtableResponse>(`${TABLES.CLIENTS}`, 'POST', record);
    
    if (response.success && response.data?.records[0]) {
      const airtableRecord = response.data.records[0];
      const client: Client = {
        id: airtableRecord.fields.client_id,
        intake_status: airtableRecord.fields.intake_status,
        assigned_intern: airtableRecord.fields.assigned_intern || undefined,
        assigned_therapist: airtableRecord.fields.assigned_therapist || undefined,
        created_at: airtableRecord.createdTime,
        updated_at: airtableRecord.createdTime,
      };
      
      return {
        success: true,
        data: client,
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to create client',
    };
  }

  // Get clients with optional filtering
  async getClients(filters?: {
    intake_status?: 'pending' | 'received' | 'completed';
    assigned_intern?: string;
    assigned_therapist?: string;
  }): Promise<ApiResponse<Client[]>> {
    let endpoint = `${TABLES.CLIENTS}?sort[0][field]=created_at&sort[0][direction]=desc`;
    
    // Add filters if provided
    const filterConditions: string[] = [];
    if (filters?.intake_status) {
      filterConditions.push(`{intake_status} = '${filters.intake_status}'`);
    }
    if (filters?.assigned_intern) {
      filterConditions.push(`{assigned_intern} = '${filters.assigned_intern}'`);
    }
    if (filters?.assigned_therapist) {
      filterConditions.push(`{assigned_therapist} = '${filters.assigned_therapist}'`);
    }

    if (filterConditions.length > 0) {
      const filterFormula = filterConditions.length === 1 
        ? filterConditions[0] 
        : `AND(${filterConditions.join(', ')})`;
      endpoint += `&filterByFormula=${encodeURIComponent(filterFormula)}`;
    }

    const response = await this.makeRequest<AirtableResponse>(endpoint);
    
    if (response.success && response.data?.records) {
      const clients: Client[] = response.data.records.map(record => ({
        id: record.fields.client_id,
        intake_status: record.fields.intake_status,
        assigned_intern: record.fields.assigned_intern || undefined,
        assigned_therapist: record.fields.assigned_therapist || undefined,
        created_at: record.createdTime,
        updated_at: record.createdTime,
      }));
      
      return {
        success: true,
        data: clients,
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to get clients',
    };
  }

  // Update client
  async updateClient(clientId: string, updates: Partial<Client>): Promise<ApiResponse<Client>> {
    // First, find the record by client_id
    const findResponse = await this.makeRequest<AirtableResponse>(
      `${TABLES.CLIENTS}?filterByFormula={client_id} = '${clientId}'`
    );

    if (!findResponse.success || !findResponse.data?.records[0]) {
      return {
        success: false,
        error: 'Client not found',
      };
    }

    const recordId = findResponse.data.records[0].id;
    
    const record = {
      records: [
        {
          id: recordId,
          fields: {
            ...(updates.intake_status && { intake_status: updates.intake_status }),
            ...(updates.assigned_intern !== undefined && { assigned_intern: updates.assigned_intern || '' }),
            ...(updates.assigned_therapist !== undefined && { assigned_therapist: updates.assigned_therapist || '' }),
          },
        },
      ],
    };

    const response = await this.makeRequest<AirtableResponse>(`${TABLES.CLIENTS}`, 'PATCH', record);
    
    if (response.success && response.data?.records[0]) {
      const airtableRecord = response.data.records[0];
      const client: Client = {
        id: airtableRecord.fields.client_id,
        intake_status: airtableRecord.fields.intake_status,
        assigned_intern: airtableRecord.fields.assigned_intern || undefined,
        assigned_therapist: airtableRecord.fields.assigned_therapist || undefined,
        created_at: airtableRecord.createdTime,
        updated_at: new Date().toISOString(),
      };
      
      return {
        success: true,
        data: client,
      };
    }

    return {
      success: false,
      error: response.error || 'Failed to update client',
    };
  }

  // Export all trigger logs as JSON (for /syncgpt functionality)
  async exportTriggerLogs(): Promise<ApiResponse<TriggerLog[]>> {
    return this.getTriggerLogs({ limit: 1000 });
  }
}

// Create and export singleton instance
export const airtableService = new AirtableService();
export default airtableService;