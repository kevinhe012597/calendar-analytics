# Google Calendar OAuth Setup

To enable Google Calendar integration, you need to set up OAuth credentials:

## 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Calendar API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Calendar API" and enable it

## 2. Create OAuth Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application" as the application type
4. Add authorized redirect URIs:
   - For development: `http://localhost:5000/api/auth/google/callback`
   - For Replit: `https://your-replit-url.replit.app/api/auth/google/callback`

## 3. Set Environment Variables

Add these to your Replit Secrets or local environment:

```
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
OPENAI_API_KEY=your_openai_api_key_here
SESSION_SECRET=your_session_secret_here
```

## 4. Test the Integration

1. Restart your application
2. Click "Connect" on Google Calendar 
3. Complete the OAuth flow
4. Your calendar events will be automatically synced and categorized!

Note: The app will work with basic keyword-based categorization if OpenAI API key is not provided.