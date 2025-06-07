
interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface CerebrasResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}


interface TaskCreationResult {
  success: boolean;
  card?: {
    title: string;
    subject: string;
    type: string;
    dueDate: Date;
    tags?: string[];
  };
  message: string;
  needsMoreInfo?: boolean;
}

export class CerebrasService {
  private apiKey: string;
  private apiUrl = 'https://api.cerebras.ai/v1/chat/completions';
  private conversationHistory: Message[] = [];

  constructor() {
    this.apiKey = import.meta.env.VITE_CEREBRAS_API_KEY;
    if (!this.apiKey) {
      throw new Error('VITE_CEREBRAS_API_KEY environment variable is required');
    }
    this.initializeContext();
  }

  private initializeContext() {
    const today = new Date();
    const currentDate = today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const systemPrompt = `You are Swoon Assist, an AI study companion that helps students create assignment cards for their workboard.

CURRENT DATE: ${currentDate}

AVAILABLE COLUMNS: Core Math, AP American Literature, AP Biology
AVAILABLE TYPES: Assignment, Homework, Test, Quiz, Project, Lab Report

YOUR TASK: Parse user messages to create assignment cards. You must ALWAYS respond in valid JSON format.

RESPONSE RULES:
1. If ANY required information is missing (Title, Column, Due Date, Type), ask for the missing information and return:
   {
     "needsMoreInfo": true,
     "message": "I need more information. What [missing info] would you like for this task?"
   }

2. If ALL information is provided or can be inferred, return:
   {
     "Title": "generated or provided title",
     "Column": "Core Math|AP American Literature|AP Biology",
     "Due Date": "Day, Month Date" (e.g., "Friday, May 17th"),
     "Type": "Assignment|Homework|Test|Quiz|Project|Lab Report"
   }

DATE PARSING:
- "today" → ${today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
- "tomorrow" → ${new Date(today.getTime() + 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
- "next Friday" → calculate the next Friday date
- "in 2 weeks" → calculate date 2 weeks from today
- Specific dates should be formatted as "Day, Month Date"

COLUMN DETECTION:
- Math-related keywords → "Core Math"
- Literature/English/Writing keywords → "AP American Literature"  
- Biology/Science keywords → "AP Biology"

TITLE GENERATION:
- If user doesn't provide a title, generate a descriptive one based on the type and subject
- If user provides a title, use it exactly

You must ALWAYS return valid JSON. Never include explanatory text outside the JSON.`;

    this.conversationHistory = [
      { role: 'system', content: systemPrompt }
    ];
  }

  private parseDate(dateString: string): Date {
    const today = new Date();
    const lowerDate = dateString.toLowerCase();

    if (lowerDate === 'today') {
      return today;
    }
    
    if (lowerDate === 'tomorrow') {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      return tomorrow;
    }

    if (lowerDate.includes('next friday')) {
      const nextFriday = new Date(today);
      const daysUntilFriday = (5 - today.getDay() + 7) % 7 || 7;
      nextFriday.setDate(today.getDate() + daysUntilFriday);
      return nextFriday;
    }

    if (lowerDate.includes('week')) {
      const weeks = parseInt(lowerDate.match(/\d+/)?.[0] || '1');
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + (weeks * 7));
      return futureDate;
    }

    // Try to parse other date formats
    const parsed = new Date(dateString);
    return isNaN(parsed.getTime()) ? today : parsed;
  }

  async sendMessage(userMessage: string, workboardState?: any): Promise<string> {
    try {
      this.conversationHistory.push({ role: 'user', content: userMessage });

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b',
          messages: this.conversationHistory,
          max_tokens: 500,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data: CerebrasResponse = await response.json();
      const assistantMessage = data.choices[0]?.message?.content || 'Sorry, I couldn\'t process that request.';

      this.conversationHistory.push({ role: 'assistant', content: assistantMessage });

      return assistantMessage;
    } catch (error) {
      console.error('Cerebras API error:', error);
      return 'I\'m having trouble connecting right now. Please try again in a moment.';
    }
  }

  async createTask(userMessage: string): Promise<TaskCreationResult> {
    try {
      const response = await this.sendMessage(`Create assignment card: ${userMessage}`);
      console.log('Cerebras response:', response);
      
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return {
          success: false,
          message: 'I had trouble understanding your request. Please try again.',
        };
      }

      const parsed = JSON.parse(jsonMatch[0]);
      console.log('Parsed response:', parsed);
      
      // Check if more information is needed
      if (parsed.needsMoreInfo) {
        return {
          success: false,
          message: parsed.message,
          needsMoreInfo: true,
        };
      }

      // Validate required fields
      if (!parsed.Title || !parsed.Column || !parsed['Due Date'] || !parsed.Type) {
        return {
          success: false,
          message: 'I need more information to create this task. Please provide the title, subject, due date, and type.',
          needsMoreInfo: true,
        };
      }

      // Parse the due date
      const dueDate = this.parseDate(parsed['Due Date']);

      const finalCard = {
        title: parsed.Title,
        subject: parsed.Column,
        type: parsed.Type,
        dueDate: dueDate,
        tags: [parsed.Type]
      };

      console.log('Final card to be created:', finalCard);

      return {
        success: true,
        card: finalCard,
        message: `Perfect! I've created "${parsed.Title}" for ${parsed.Column}, due ${parsed['Due Date']}.`,
      };
    } catch (error) {
      console.error('Task creation error:', error);
      return {
        success: false,
        message: 'I had trouble creating that task. Could you try rephrasing your request?',
      };
    }
  }
}