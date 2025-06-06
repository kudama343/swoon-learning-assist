
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
}

export class CerebrasService {
  private apiKey: string;
  private apiUrl = 'https://api.cerebras.ai/v1/chat/completions';
  private conversationHistory: Message[] = [];

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.initializeContext();
  }

  private initializeContext() {
    const systemPrompt = `You are Swoon Assist, an AI study companion for students. You help manage their workboard tasks and assignments.

AVAILABLE SUBJECTS: Core Math, AP American Literature, AP Biology, AP Calculus AB, AP Calculus BC

CAPABILITIES:
1. Create assignment cards with natural language
2. Parse dates (today, tomorrow, next Friday, in 2 weeks, etc.)
3. Detect subject from context
4. Provide study suggestions and priority recommendations

RESPONSE FORMAT for task creation:
When creating a task, respond with JSON:
{
  "action": "create_task",
  "task": {
    "title": "Assignment title",
    "subject": "Subject name",
    "type": "Assignment|Homework|Lab Report|Test",
    "dueDate": "YYYY-MM-DD",
    "tags": ["optional", "tags"]
  },
  "message": "Friendly confirmation message"
}

For general questions, respond naturally without JSON.

Current date: ${new Date().toISOString().split('T')[0]}`;

    this.conversationHistory = [
      { role: 'system', content: systemPrompt }
    ];
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
          model: 'llama3.1-8b',
          messages: this.conversationHistory,
          max_tokens: 500,
          temperature: 0.7,
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
      const response = await this.sendMessage(userMessage);
      
      // Try to parse JSON response for task creation
      if (response.includes('"action": "create_task"')) {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            success: true,
            card: {
              ...parsed.task,
              dueDate: new Date(parsed.task.dueDate),
            },
            message: parsed.message,
          };
        }
      }

      return {
        success: false,
        message: response,
      };
    } catch (error) {
      console.error('Task creation error:', error);
      return {
        success: false,
        message: 'I had trouble creating that task. Could you try rephrasing your request?',
      };
    }
  }

  parseDueDate(dateString: string): Date {
    const today = new Date();
    const lowerDate = dateString.toLowerCase();

    if (lowerDate.includes('today')) {
      return today;
    }
    
    if (lowerDate.includes('tomorrow')) {
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

    // Default to tomorrow if parsing fails
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow;
  }
}