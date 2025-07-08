import { TriggerType, Role, ZapierWebhookPayload, ApiResponse } from '../types';

// Environment variables for webhook configuration
const ZAPIER_WEBHOOK_BASE_URL = process.env.REACT_APP_ZAPIER_WEBHOOK_URL || 'https://hooks.zapier.com/hooks/catch/';
const WEBHOOK_SECRET = process.env.REACT_APP_WEBHOOK_SECRET || 'your-webhook-secret';

// Webhook endpoints for different triggers
const WEBHOOK_ENDPOINTS = {
  '/newclient': process.env.REACT_APP_ZAPIER_NEWCLIENT_WEBHOOK || '',
  '/formreceived': process.env.REACT_APP_ZAPIER_FORMRECEIVED_WEBHOOK || '',
  '/assignclient': process.env.REACT_APP_ZAPIER_ASSIGNCLIENT_WEBHOOK || '',
  '/noshow': process.env.REACT_APP_ZAPIER_NOSHOW_WEBHOOK || '',
  '/remindform': process.env.REACT_APP_ZAPIER_REMINDFORM_WEBHOOK || '',
  '/logsession': process.env.REACT_APP_ZAPIER_LOGSESSION_WEBHOOK || '',
  '/needsfeedback': process.env.REACT_APP_ZAPIER_NEEDSFEEDBACK_WEBHOOK || '',
  '/latefollowup': process.env.REACT_APP_ZAPIER_LATEFOLLOWUP_WEBHOOK || '',
  '/sendfeedback': process.env.REACT_APP_ZAPIER_SENDFEEDBACK_WEBHOOK || '',
  '/checkprogress': process.env.REACT_APP_ZAPIER_CHECKPROGRESS_WEBHOOK || '',
  '/syncgpt': process.env.REACT_APP_ZAPIER_SYNCGPT_WEBHOOK || '',
};

class WebhookService {
  private generateSignature(payload: string): string {
    // In a real implementation, you'd use a proper HMAC signature
    // For demo purposes, we'll use a simple hash
    return btoa(payload + WEBHOOK_SECRET);
  }

  private async sendWebhook(
    endpoint: string,
    payload: ZapierWebhookPayload,
    retries: number = 3
  ): Promise<ApiResponse> {
    const payloadString = JSON.stringify(payload);
    const signature = this.generateSignature(payloadString);

    const headers = {
      'Content-Type': 'application/json',
      'X-Webhook-Signature': signature,
      'X-Webhook-Source': 'TriggerHealthOS',
    };

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: payloadString,
        });

        if (response.ok) {
          const result = await response.json().catch(() => ({ success: true }));
          return {
            success: true,
            data: result,
            message: 'Webhook sent successfully',
          };
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error(`Webhook attempt ${attempt} failed:`, error);
        
        if (attempt === retries) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown webhook error',
          };
        }

        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

    return {
      success: false,
      error: 'All webhook attempts failed',
    };
  }

  // Send trigger webhook to Zapier
  async sendTriggerWebhook(
    trigger: TriggerType,
    role: Role,
    userId: string,
    clientId?: string,
    additionalData?: Record<string, any>
  ): Promise<ApiResponse> {
    const endpoint = WEBHOOK_ENDPOINTS[trigger];
    
    if (!endpoint) {
      console.warn(`No webhook endpoint configured for trigger: ${trigger}`);
      return {
        success: false,
        error: `No webhook endpoint configured for trigger: ${trigger}`,
      };
    }

    const payload: ZapierWebhookPayload = {
      trigger,
      client_id: clientId,
      user_id: userId,
      timestamp: new Date().toISOString(),
      additional_data: additionalData,
    };

    return this.sendWebhook(endpoint, payload);
  }

  // Send specific webhook for new client
  async sendNewClientWebhook(
    userId: string,
    clientId: string,
    intakeStatus: 'pending' | 'received' | 'completed' = 'pending'
  ): Promise<ApiResponse> {
    return this.sendTriggerWebhook(
      '/newclient',
      'receptionist',
      userId,
      clientId,
      { intake_status: intakeStatus }
    );
  }

  // Send webhook for form received
  async sendFormReceivedWebhook(
    userId: string,
    clientId: string
  ): Promise<ApiResponse> {
    return this.sendTriggerWebhook(
      '/formreceived',
      'receptionist',
      userId,
      clientId
    );
  }

  // Send webhook for client assignment
  async sendAssignClientWebhook(
    userId: string,
    clientId: string,
    assignedTo: string,
    assignedRole: 'intern' | 'therapist'
  ): Promise<ApiResponse> {
    return this.sendTriggerWebhook(
      '/assignclient',
      'receptionist',
      userId,
      clientId,
      { assigned_to: assignedTo, assigned_role: assignedRole }
    );
  }

  // Send webhook for no-show
  async sendNoShowWebhook(
    userId: string,
    clientId: string,
    appointmentDate: string
  ): Promise<ApiResponse> {
    return this.sendTriggerWebhook(
      '/noshow',
      'receptionist',
      userId,
      clientId,
      { appointment_date: appointmentDate }
    );
  }

  // Send webhook for form reminder
  async sendFormReminderWebhook(
    userId: string,
    clientId: string,
    reminderType: 'first' | 'second' | 'final' = 'first'
  ): Promise<ApiResponse> {
    return this.sendTriggerWebhook(
      '/remindform',
      'receptionist',
      userId,
      clientId,
      { reminder_type: reminderType }
    );
  }

  // Send webhook for session logged
  async sendSessionLoggedWebhook(
    userId: string,
    clientId: string,
    sessionNotes?: string
  ): Promise<ApiResponse> {
    return this.sendTriggerWebhook(
      '/logsession',
      'intern',
      userId,
      clientId,
      { session_notes: sessionNotes }
    );
  }

  // Send webhook for feedback needed
  async sendFeedbackNeededWebhook(
    userId: string,
    clientId: string,
    sessionId: string
  ): Promise<ApiResponse> {
    return this.sendTriggerWebhook(
      '/needsfeedback',
      'intern',
      userId,
      clientId,
      { session_id: sessionId }
    );
  }

  // Send webhook for late follow-up
  async sendLateFollowUpWebhook(
    userId: string,
    clientId: string,
    daysLate: number
  ): Promise<ApiResponse> {
    return this.sendTriggerWebhook(
      '/latefollowup',
      'intern',
      userId,
      clientId,
      { days_late: daysLate }
    );
  }

  // Send webhook for feedback sent
  async sendFeedbackSentWebhook(
    userId: string,
    clientId: string,
    sessionId: string,
    feedbackNotes: string
  ): Promise<ApiResponse> {
    return this.sendTriggerWebhook(
      '/sendfeedback',
      'therapist',
      userId,
      clientId,
      { session_id: sessionId, feedback_notes: feedbackNotes }
    );
  }

  // Send webhook for progress check
  async sendProgressCheckWebhook(
    userId: string,
    clientId: string,
    internId: string
  ): Promise<ApiResponse> {
    return this.sendTriggerWebhook(
      '/checkprogress',
      'therapist',
      userId,
      clientId,
      { intern_id: internId }
    );
  }

  // Send webhook for GPT sync
  async sendGPTSyncWebhook(
    userId: string,
    exportData: any
  ): Promise<ApiResponse> {
    return this.sendTriggerWebhook(
      '/syncgpt',
      'admin',
      userId,
      undefined,
      { export_data: exportData }
    );
  }

  // Test webhook endpoint
  async testWebhook(trigger: TriggerType): Promise<ApiResponse> {
    const endpoint = WEBHOOK_ENDPOINTS[trigger];
    
    if (!endpoint) {
      return {
        success: false,
        error: `No webhook endpoint configured for trigger: ${trigger}`,
      };
    }

    const testPayload: ZapierWebhookPayload = {
      trigger,
      client_id: 'CL-TEST-001',
      user_id: 'USER-TEST-001',
      timestamp: new Date().toISOString(),
      additional_data: { test: true },
    };

    return this.sendWebhook(endpoint, testPayload, 1);
  }

  // Get configured webhooks
  getConfiguredWebhooks(): { trigger: TriggerType; endpoint: string }[] {
    return Object.entries(WEBHOOK_ENDPOINTS)
      .filter(([_, endpoint]) => endpoint.length > 0)
      .map(([trigger, endpoint]) => ({
        trigger: trigger as TriggerType,
        endpoint,
      }));
  }
}

// Create and export singleton instance
export const webhookService = new WebhookService();
export default webhookService;