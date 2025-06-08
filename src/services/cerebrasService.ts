// Updated cerebrasService.ts

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
  parsedData?: {
    Title: string;
    Column: string;
    'Due Date': string;
    Type: string;
  };
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

INTELLIGENCE RULES:
- ALWAYS try to infer missing information from context before asking
- Use conversation history to fill gaps
- Be smart about column detection and title generation
- Only ask for information that cannot be reasonably inferred

COLUMN DETECTION (Enhanced):
Core Math:
- Keywords: math, algebra, calculus, geometry, trigonometry, statistics, equations, functions, derivatives, integrals, probability, numbers, mathematical, arithmetic, quadratic, linear, polynomial, exponential, logarithmic

AP American Literature:
- Keywords: literature, english, writing, essay, poem, poetry, novel, book, story, author, character, theme, analysis, reading, shakespeare, twain, hemingway, fitzgerald, steinbeck, american authors, literary analysis, composition, rhetoric, grammar, vocabulary, reading comprehension, creative writing, research paper, book report, literary criticism

AP Biology:
- Keywords: biology, science, cell, DNA, genetics, evolution, ecology, organism, photosynthesis, respiration, enzyme, protein, chromosome, mitosis, meiosis, lab, experiment, microscope, bacteria, virus, plant, animal, ecosystem, biodiversity, molecular biology, biochemistry, anatomy, physiology, medicine, sickness

TITLE GENERATION RULES:
- If user provides a specific title/name (like "Black Death History"), use it exactly
- If no title but topic is mentioned, generate descriptive title
- If type and subject are clear, create format: "[Type] - [Topic/Subject]"
- Examples: "Homework - Calculus Practice", "Test - Cell Division", "Essay - American Dream Theme"

SMART INFERENCE:
1. If user says "Create a Homework named 'Black Death History'":
   - Title: "Black Death History" (explicitly stated)
   - Type: "Homework" (explicitly stated)
   - Column: Infer from topic - "Black Death" is historical literature topic → "AP American Literature"

2. If user says "Math quiz tomorrow":
   - Title: "Math Quiz" (generated from type + subject)
   - Type: "Quiz" (explicitly stated)
   - Column: "Core Math" (from "Math")
   - Due Date: "tomorrow"

3. If user says "Biology lab report due Friday":
   - Title: "Biology Lab Report" (generated)
   - Type: "Lab Report" (explicitly stated)
   - Column: "AP Biology" (from "Biology")
   - Due Date: "Friday"

RESPONSE FORMAT:
Always respond in valid JSON. Try to complete the task with available information:

If ALL required info can be determined or reasonably inferred:
{
  "Title": "title from user or generated",
  "Column": "Core Math|AP American Literature|AP Biology",
  "Due Date": "Day, Month Date",
  "Type": "Assignment|Homework|Test|Quiz|Project|Lab Report"
}

Only if CRITICAL information is truly missing and cannot be inferred:
{
  "needsMoreInfo": true,
  "message": "I need to know [specific missing info]. Everything else looks good!"
}

IMPORTANT: Never respond with just JSON data in conversational text. Always use the structured JSON format above. When you have enough information to create a task, return the complete JSON object immediately without additional conversation.

DATE PARSING:
- "today" → ${today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
- "tomorrow" → ${new Date(today.getTime() + 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
- "next Monday" → calculate next Monday
- "next week Monday" → calculate Monday of next week
- "in 2 weeks" → calculate date 2 weeks from today
- "Friday" → this Friday if it hasn't passed, otherwise next Friday

CONTEXT AWARENESS:
- Remember previous messages in the conversation
- If user provides additional info in follow-up, combine with previous context
- Never ask for information that was already provided earlier in the conversation

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

    // Handle "next week Monday" or "next Monday"
    if (lowerDate.includes('next') && lowerDate.includes('monday')) {
      const nextMonday = new Date(today);
      const daysUntilNextMonday = (1 - today.getDay() + 7) % 7 || 7;
      nextMonday.setDate(today.getDate() + daysUntilNextMonday);
      return nextMonday;
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

    // Handle day names (Friday, Monday, etc.)
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayIndex = dayNames.findIndex(day => lowerDate.includes(day));
    if (dayIndex !== -1) {
      const targetDate = new Date(today);
      const daysUntilTarget = (dayIndex - today.getDay() + 7) % 7;
      targetDate.setDate(today.getDate() + (daysUntilTarget || 7));
      return targetDate;
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
      // Add user message to conversation history for context
      this.conversationHistory.push({ role: 'user', content: userMessage });

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b',
          messages: this.conversationHistory, // Use full conversation history
          max_tokens: 500,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data: CerebrasResponse = await response.json();
      const assistantMessage = data.choices[0]?.message?.content || 'Sorry, I couldn\'t process that request.';
      
      console.log('Cerebras response:', assistantMessage);
      
      // Add assistant response to history
      this.conversationHistory.push({ role: 'assistant', content: assistantMessage });

      // Extract JSON from response
      const jsonMatch = assistantMessage.match(/\{[\s\S]*\}/);
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

      // Check if this is a direct JSON response that should create a task
      if (parsed.Title && parsed.Column && parsed['Due Date'] && parsed.Type) {
        // This is a complete task response, process it immediately
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
          parsedData: parsed
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
        parsedData: parsed
      };
    } catch (error) {
      console.error('Task creation error:', error);
      return {
        success: false,
        message: 'I had trouble creating that task. Could you try rephrasing your request?',
      };
    }
  }

  // Method to clear conversation history if needed
  clearHistory() {
    this.initializeContext();
  }
}