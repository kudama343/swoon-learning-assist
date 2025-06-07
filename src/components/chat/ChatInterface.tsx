import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, CheckCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useWorkboard } from '@/hooks/useWorkboard';
import { useToast } from '@/hooks/use-toast';

// Cerebras API integration
const CEREBRAS_API_KEY = import.meta.env.VITE_CEREBRAS_API_KEY;

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  cardCreated?: boolean;
}

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialMessages: Message[] = [
  {
    id: '1',
    content: "Hi! I'm Swoon Assist, your AI study companion powered by Cerebras. I can help you create new assignments, check what's due, and organize your workboard. What would you like to work on today?",
    sender: 'assistant',
    timestamp: new Date()
  }
];

// Cerebras API function
const callCerebrasAPI = async (message: string): Promise<string> => {
  try {
    const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CEREBRAS_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama3.1-8b',
        messages: [
          {
            role: 'system',
            content: 'You are Swoon Assist, a helpful AI study companion. You help students manage their assignments, create study plans, and stay organized. Be friendly, encouraging, and concise in your responses.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Cerebras API error: ${response.status} ${response.statusText}`);
    }
    console.log('Response Data: ', response)
    const data = await response.json();
    console.log('Cerebras API Response:', data);
    
    return data.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response. Please try again!';
  } catch (error) {
    console.error('Cerebras API Error:', error);
    return 'I\'m having trouble connecting to my AI brain right now. Please try again in a moment!';
  }
};

export const ChatInterface = ({ isOpen, onClose }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { createTaskFromMessage, sendChatMessage, getDueSoon, getUrgentTasks } = useWorkboard();
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // Check if this is a task creation request
      const taskCreationKeywords = ['create', 'add', 'new', 'assignment', 'homework', 'due'];
      const isTaskCreation = taskCreationKeywords.some(keyword => 
        currentInput.toLowerCase().includes(keyword)
      );

      let response: string;
      let cardCreated = false;

      if (isTaskCreation) {
        // Handle task creation with workboard integration
        const result = await createTaskFromMessage(currentInput);
        response = result.message;
        cardCreated = result.success;
        
        if (result.success) {
          toast({
            title: "Task Created!",
            description: `Added "${result.card?.title}" to ${result.card?.subject}`,
          });
        }
      } else if (currentInput.toLowerCase().includes('due') && currentInput.toLowerCase().includes('week')) {
        // Handle due assignments query
        const dueSoon = getDueSoon();
        response = dueSoon.length > 0 
          ? `Here's what's due this week:\n${dueSoon.map(card => `• ${card.title} (${card.subject}) - Due ${card.dueDate.toLocaleDateString()}`).join('\n')}`
          : "You don't have any assignments due this week. Great job staying ahead!";
      } else if (currentInput.toLowerCase().includes('urgent') || currentInput.toLowerCase().includes('first')) {
        // Handle urgent tasks query
        const urgent = getUrgentTasks();
        response = urgent.length > 0
          ? `Here are your most urgent tasks:\n${urgent.map(card => `🚨 ${card.title} (${card.subject}) - Due ${card.dueDate.toLocaleDateString()}`).join('\n')}\n\nI recommend starting with the earliest due date!`
          : "No urgent tasks right now! You're all caught up.";
      } else {
        // Use Cerebras API for general chat
        console.log('Sending message to Cerebras:', currentInput);
        response = await callCerebrasAPI(currentInput);
        console.log('Cerebras response received:', response);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'assistant',
        timestamp: new Date(),
        cardCreated
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble right now. Please try again in a moment!",
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Check for API key on component mount
  useEffect(() => {
    if (!CEREBRAS_API_KEY) {
      console.warn('CEREBRAS_API_KEY not found. Please set your API key in environment variables.');
    } else {
      console.log('Cerebras API key loaded successfully');
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 md:bottom-24 md:right-6 w-[calc(100vw-2rem)] md:w-96 h-[calc(100vh-2rem)] md:h-[500px] z-40 animate-slide-up">
      <Card className="bg-swoon-white border border-swoon-mid-gray shadow-xl h-full flex flex-col">
        {/* Header */}
        <div className="bg-swoon-blue text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-swoon-white rounded-full flex items-center justify-center">
                <span className="text-swoon-blue font-bold text-sm">S</span>
              </div>
              <div>
                <h3 className="font-semibold">Swoon Assist</h3>
                <p className="text-xs opacity-90">Powered by Cerebras AI</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-swoon-bluer h-8 w-8 p-0"
            >
              ×
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                  ${message.sender === 'user' 
                    ? 'bg-swoon-yellow' 
                    : 'bg-swoon-blue'
                  }
                `}>
                  {message.sender === 'user' ? (
                    <User className="w-4 h-4 text-swoon-black" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                
                <div className={`
                  max-w-[80%] p-3 rounded-lg text-sm relative whitespace-pre-line
                  ${message.sender === 'user'
                    ? 'bg-swoon-yellow text-swoon-black'
                    : 'bg-swoon-light-blue text-swoon-black'
                  }
                `}>
                  {message.content}
                  {message.cardCreated && (
                    <div className="flex items-center mt-2 text-swoon-blue">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span className="text-xs font-medium">Card created!</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-swoon-blue rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-swoon-light-blue p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-swoon-dark-gray rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-swoon-dark-gray rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-swoon-dark-gray rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-swoon-mid-gray">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your assignments..."
              className="flex-1 border-swoon-mid-gray focus:border-swoon-blue"
            />
            <Button
              onClick={handleSendMessage}
              className="bg-swoon-blue hover:bg-swoon-bluer"
              size="icon"
              disabled={!inputValue.trim() || isTyping}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};