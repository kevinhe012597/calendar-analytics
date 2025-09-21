import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import OpenAI from 'openai';

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email'
];

export class GoogleCalendarService {
  private oauth2Client: OAuth2Client;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI || `${process.env.REPLIT_DEV_DOMAIN}/api/auth/google/callback`
    );
  }

  generateAuthUrl(): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent',
    });
  }

  async exchangeCodeForTokens(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    
    // Get user info
    const oauth2 = google.oauth2({ version: 'v2', auth: this.oauth2Client });
    const userInfo = await oauth2.userinfo.get();

    return {
      accessToken: tokens.access_token!,
      refreshToken: tokens.refresh_token || null,
      expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      email: userInfo.data.email!,
      name: userInfo.data.name || userInfo.data.email!,
    };
  }

  async refreshTokens(refreshToken: string) {
    this.oauth2Client.setCredentials({ refresh_token: refreshToken });
    const { credentials } = await this.oauth2Client.refreshAccessToken();
    
    return {
      accessToken: credentials.access_token!,
      expiresAt: credentials.expiry_date ? new Date(credentials.expiry_date) : null,
    };
  }

  async fetchCalendarEvents(accessToken: string, refreshToken?: string, expiresAt?: Date, timeMin?: Date, timeMax?: Date) {
    // Check if token needs refresh
    if (refreshToken && expiresAt && new Date() > expiresAt) {
      try {
        const refreshed = await this.refreshTokens(refreshToken);
        accessToken = refreshed.accessToken;
      } catch (error) {
        console.error('Token refresh failed:', error);
        throw new Error('Authentication expired. Please reconnect your calendar.');
      }
    }

    this.oauth2Client.setCredentials({ access_token: accessToken });
    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: timeMin ? timeMin.toISOString() : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      timeMax: timeMax ? timeMax.toISOString() : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      maxResults: 250,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items || [];
  }

  async categorizeEvent(title: string, description?: string): Promise<{
    category: 'work' | 'exercise' | 'social' | 'rest' | 'other';
    confidence: 'high' | 'medium' | 'low';
  }> {
    // Fallback if OpenAI is not available
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key not configured, using basic categorization');
      return this.basicCategorize(title, description);
    }

    try {
      const prompt = `Categorize this calendar event into one of these categories: work, exercise, social, rest, or other.
      
Event Title: ${title}
Event Description: ${description || 'No description'}

Analyze the event and respond with JSON in this format:
{
  "category": "work|exercise|social|rest|other", 
  "confidence": "high|medium|low",
  "reasoning": "brief explanation of why you chose this category"
}

Categories:
- work: professional activities, meetings, work tasks, business events
- exercise: fitness activities, sports, gym, running, yoga, physical activities
- social: personal social events, parties, dinners with friends, social gatherings
- rest: breaks, relaxation, meditation, sleep, personal downtime
- other: everything else that doesn't fit the above categories`;

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          { role: "system", content: "You are an expert at categorizing calendar events. Be accurate and consistent." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      // Validate and default the response
      const validCategories = ['work', 'exercise', 'social', 'rest', 'other'];
      const validConfidences = ['high', 'medium', 'low'];
      
      return {
        category: validCategories.includes(result.category) ? result.category : 'other',
        confidence: validConfidences.includes(result.confidence) ? result.confidence : 'medium',
      };
    } catch (error) {
      console.error('Error categorizing event:', error);
      return this.basicCategorize(title, description);
    }
  }

  private basicCategorize(title: string, description?: string): {
    category: 'work' | 'exercise' | 'social' | 'rest' | 'other';
    confidence: 'high' | 'medium' | 'low';
  } {
    const text = `${title} ${description || ''}`.toLowerCase();
    
    // Work keywords
    if (text.match(/(meeting|standup|call|work|office|client|project|review|interview|conference|presentation)/)) {
      return { category: 'work', confidence: 'medium' };
    }
    
    // Exercise keywords  
    if (text.match(/(gym|workout|exercise|run|yoga|fitness|sport|training|cycling|swimming|basketball|football|soccer|tennis|baseball|volleyball|hockey)/)) {
      return { category: 'exercise', confidence: 'medium' };
    }
    
    // Social keywords
    if (text.match(/(dinner|lunch|coffee|party|social|friends|family|birthday|wedding|date)/)) {
      return { category: 'social', confidence: 'medium' };
    }
    
    // Rest keywords
    if (text.match(/(break|rest|sleep|relax|vacation|holiday|personal|medical|doctor|appointment)/)) {
      return { category: 'rest', confidence: 'medium' };
    }
    
    return { category: 'other', confidence: 'low' };
  }
}

export const googleCalendarService = new GoogleCalendarService();