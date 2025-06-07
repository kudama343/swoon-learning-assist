
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

AVAILABLE SUBJECTS: Core Math, AP American Literature, AP Biology

CAPABILITIES:
1. Create assignment cards with natural language
2. Parse dates (today, tomorrow, next Friday, in 2 weeks, etc.)
3. Detect subject from context - be very specific about matching these exact subjects:
   - "Core Math" for any math-related tasks
   - "AP American Literature" for literature, English, writing tasks  
   - "AP Biology" for biology, science tasks

RESPONSE FORMAT for task creation:
When creating a task, respond with JSON:
{
  "action": "create_task",
  "task": {
    "title": "Assignment title",
    "subject": "Core Math|AP American Literature|AP Biology", 
    "type": "Assignment|Homework|Lab Report|Test",
    "dueDate": "YYYY-MM-DD",
    "tags": ["Homework"]
  },
  "message": "Task created successfully!"
}

SUBJECT DETECTION RULES:
- If user mentions "math", "algebra", "calculus", "geometry", "Core Math" → "Core Math"
- If user mentions "literature", "english", "writing", "essay", "AP American Literature" → "AP American Literature"  
- If user mentions "biology", "science", "lab", "cells", "AP Biology" → "AP Biology"
- Default to "Core Math" if subject is unclear

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
      const response = await this.sendMessage(`Create a task: ${userMessage}`);
      console.log('Cerebras response:', response);
      
      // Try to parse JSON response for task creation
      if (response.includes('"action": "create_task"')) {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          console.log('Parsed task:', parsed);
          
          // Ensure subject is one of the valid ones
          const validSubjects = ['Core Math', 'AP American Literature', 'AP Biology'];
          let subject = parsed.task.subject;
          
          if (!validSubjects.includes(subject)) {
            // Fallback subject detection based on user message
            const lowerMessage = userMessage.toLowerCase();
            if (lowerMessage.includes('math') || lowerMessage.includes('algebra') || lowerMessage.includes('calculus') || lowerMessage.includes('core math')) {
              subject = 'Core Math';
            } else if (lowerMessage.includes('literature') || lowerMessage.includes('english') || lowerMessage.includes('writing') || lowerMessage.includes('ap american literature')) {
              subject = 'AP American Literature';
            } else if (lowerMessage.includes('biology') || lowerMessage.includes('science') || lowerMessage.includes('lab') || lowerMessage.includes('ap biology')) {
              subject = 'AP Biology';
            } else {
              subject = 'Core Math'; // default
            }
          }

          const finalCard = {
            ...parsed.task,
            subject,
            dueDate: new Date(parsed.task.dueDate),
            tags: parsed.task.tags || ['Homework']
          };

          console.log('Final card to be created:', finalCard);

          return {
            success: true,
            card: finalCard,
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
}