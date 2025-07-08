# TriggerHealthOS

A modular, self-training frontend web app for mental health therapy business management. Built with React + TailwindCSS and optimized for iPad display.

## Overview

TriggerHealthOS is designed for mental health therapy businesses to manage workflow through a trigger-based system. The app serves four main roles (Receptionist, Intern, Therapist, Admin) with role-specific dashboards and triggers that log to Airtable and initiate workflows via Zapier webhooks.

## Features

### 🔐 Role-Based Access Control
- **Receptionist**: Client management, form processing, appointments
- **Intern**: Session logging, feedback requests, progress tracking
- **Therapist**: Supervision, feedback provision, progress monitoring
- **Admin**: System analytics, data export, comprehensive oversight

### 🧱 Core Functionality
- **Trigger System**: 11 different triggers for workflow automation
- **Airtable Integration**: All interactions logged to Airtable via API
- **Zapier Webhooks**: Automated workflows triggered by button presses
- **iPad Optimized**: Large buttons, responsive layout for tablet use
- **HIPAA Compliant**: No PHI stored, only Client IDs used

### 📊 Available Triggers
- `/newclient` - Log new client
- `/formreceived` - Mark intake form complete
- `/assignclient` - Assign client to intern/therapist
- `/noshow` - Log missed appointment
- `/remindform` - Send form reminder
- `/logsession` - Record session completion
- `/needsfeedback` - Request therapist feedback
- `/latefollowup` - Log delayed follow-up
- `/sendfeedback` - Provide feedback to intern
- `/checkprogress` - Review client progress
- `/syncgpt` - Export data for AI analysis

## Tech Stack

- **Frontend**: React with TypeScript
- **Styling**: TailwindCSS
- **Backend**: Airtable (database)
- **Automation**: Zapier (workflows)
- **Optional**: GPT-4 API, Any.do API

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Airtable account
- Zapier account (for webhooks)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd triggerhealthos
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your actual values:
   - `REACT_APP_AIRTABLE_BASE_ID`: Your Airtable base ID
   - `REACT_APP_AIRTABLE_API_KEY`: Your Airtable API key
   - `REACT_APP_ZAPIER_*_WEBHOOK`: Individual webhook URLs for each trigger

4. **Set up Airtable**
   Create tables in your Airtable base:
   - `TriggerLogs`: Log all trigger interactions
   - `Clients`: Store client information
   - `Sessions`: Track therapy sessions
   - `Users`: Store user information

5. **Configure Zapier Webhooks**
   - Create webhook endpoints for each trigger
   - Set up automations (e.g., Any.do reminders, email notifications)
   - Add webhook URLs to your `.env` file

6. **Start the development server**
   ```bash
   npm start
   ```

## Usage

### Demo Login
The app includes mock users for testing:

- **Receptionist**: sarah@clinic.com / receptionist123
- **Intern**: alex@clinic.com / intern123
- **Therapist**: david@clinic.com / therapist123
- **Admin**: admin@clinic.com / admin123

Or use the quick role login feature on the login screen.

### Role-Specific Workflows

#### Receptionist Dashboard
- Add new clients to system
- Process intake forms
- Assign clients to staff
- Handle no-shows and reminders

#### Intern Dashboard
- Log completed sessions
- Request feedback from supervisors
- Track assigned clients
- Monitor learning progress

#### Therapist Dashboard
- Provide feedback on intern sessions
- Monitor client progress
- Review supervision activities
- Track intern development

#### Admin Dashboard
- View system-wide analytics
- Export data for analysis
- Monitor system health
- Manage user performance

## API Integration

### Airtable Schema

**TriggerLogs Table**
- `trigger`: Text (trigger type)
- `role`: Text (user role)
- `client_id`: Text (client identifier)
- `user_id`: Text (user identifier)
- `timestamp`: DateTime
- `success`: Checkbox
- `additional_data`: Long text (JSON)
- `error_message`: Text

**Clients Table**
- `client_id`: Text (primary key)
- `intake_status`: Single select (pending, received, completed)
- `assigned_intern`: Text
- `assigned_therapist`: Text
- `created_at`: DateTime
- `updated_at`: DateTime

### Webhook Payload Format

```json
{
  "trigger": "/newclient",
  "client_id": "CL-001",
  "user_id": "user-rec-001",
  "timestamp": "2025-01-08T14:32:00Z",
  "additional_data": {
    "intake_status": "pending"
  }
}
```

## Architecture

### Component Structure
```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── roles/          # Role-specific dashboards
│   └── ui/             # Reusable UI components
├── contexts/           # React contexts for state management
├── services/           # API services (Airtable, Webhooks)
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

### State Management
- **AuthContext**: User authentication and role management
- **TriggerContext**: Trigger execution and logging
- **Local Storage**: Persistent login state

### Security Considerations
- No PHI (Protected Health Information) stored in frontend
- Client IDs only (e.g., "CL-001") for identification
- All sensitive data stored in SimplePractice or similar HIPAA-compliant system
- Webhook signatures for API security

## Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
Ensure all production environment variables are set:
- Airtable credentials
- Zapier webhook URLs
- Any optional API keys

### Hosting Recommendations
- **Vercel**: Easy deployment with environment variable support
- **Netlify**: Simple hosting with form handling
- **AWS S3 + CloudFront**: Scalable static hosting

## Development

### Adding New Triggers
1. Add trigger type to `types/index.ts`
2. Update `TriggerContext` with handler logic
3. Add webhook configuration to `services/webhook.ts`
4. Create trigger button in relevant dashboard

### Customizing Roles
1. Update `Role` type in `types/index.ts`
2. Add new dashboard component
3. Update `AuthContext` and `App.tsx` routing
4. Configure role-specific permissions

## Testing

### Mock Data
The app includes mock users and data for testing:
- Mock clients (CL-001, CL-007, CL-012)
- Sample trigger logs
- Test user accounts

### Testing Triggers
1. Login with test account
2. Use trigger buttons with test Client IDs
3. Verify logs in Airtable
4. Check webhook deliveries in Zapier

## Support

For issues or questions:
1. Check the console for error messages
2. Verify Airtable API connectivity
3. Test webhook endpoints in Zapier
4. Review environment variable configuration

## License

[Add your license information here]

## Contributing

[Add contribution guidelines here]
