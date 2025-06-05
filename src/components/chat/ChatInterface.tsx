
import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialMessages: Message[] = [
  {
    id: '1',
    content: "Hi Kelly! I'm Swoon Assist, your AI study companion. I can help you create new assignments, check what's due, and organize your workboard. What would you like to work on today?",
    sender: 'assistant',
    timestamp: new Date()
  }
];

export const ChatInterface = ({ isOpen, onClose }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I'd be happy to help you with that! Let me create a new assignment card for you.",
        "Based on your current workload, I recommend focusing on your AP Biology lab report since it's due tomorrow.",
        "Here's what you have coming up this week. Would you like me to help prioritize these tasks?",
        "Great question! I can help you organize your assignments by due date and importance."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
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

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 w-96 h-[500px] z-40 animate-slide-up">
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
                <p className="text-xs opacity-90">Your AI study companion</p>
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
                  max-w-[80%] p-3 rounded-lg text-sm
                  ${message.sender === 'user'
                    ? 'bg-swoon-yellow text-swoon-black'
                    : 'bg-swoon-light-blue text-swoon-black'
                  }
                `}>
                  {message.content}
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
              disabled={!inputValue.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};