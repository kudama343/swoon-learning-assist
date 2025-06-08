import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, CheckCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useWorkboard } from '@/hooks/useWorkboard';
import { useToast } from '@/hooks/use-toast';
import { AddCardModal } from '@/components/AddCardModal';
import { WelcomeModal } from '@/components/WelcomeModal';

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
  defaultSubject?: string; // Add optional prop for default subject
  onCardCreate?: (cardData: {
    title: string;
    subject: string;
    dueDate: Date;
    type: string;
  }) => void; // Callback to pass card data to parent
}

const initialMessages: Message[] = [
  {
    id: '1',
    content: "Hi! I'm Swoon Assist, your AI study companion. I can help you create new assignments, check what's due, and organize your workboard. What would you like to work on today?",
    sender: 'assistant',
    timestamp: new Date()
  }
];

const STORAGE_KEY = 'swoon-chat-history';

const saveChatHistory = (messages: Message[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Failed to save chat history:', error);
  }
};

const loadChatHistory = (): Message[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((msg: any, index: number) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
        id: msg.id || `initial-${index}-${Date.now()}` // Ensure unique IDs for old messages
      }));
    }
  } catch (error) {
    console.error('Failed to load chat history:', error);
  }
  return initialMessages;
};

export const ChatInterface = ({ isOpen, onClose, defaultSubject, onCardCreate }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>(() => loadChatHistory());
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [modalData, setModalData] = useState<{
    title: string;
    subject: string;
    dueDate: Date;
    type: string;
  } | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messageIdCounter = useRef(Math.floor(Math.random() * 10000)); // Start with random number
  const { createTaskFromMessage, sendChatMessage, getDueSoon, getUrgentTasks } = useWorkboard();
  const { toast } = useToast();

  // Generate unique message ID
  const generateMessageId = () => {
    messageIdCounter.current += 1;
    return `msg-${Date.now()}-${messageIdCounter.current}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    saveChatHistory(messages);
  }, [messages]);

  // Updated handleAddCard to pass data to parent component
  const handleAddCard = (cardData: {
    title: string;
    subject: string;
    dueDate: Date;
    type: string;
  }) => {
    console.log('card data: ', cardData);
    
    // Pass card data to parent (WorkboardColumn) if callback exists
    if (onCardCreate) {
      // Override subject with defaultSubject if provided
      const finalCardData = {
        ...cardData,
        subject: defaultSubject || cardData.subject
      };
      onCardCreate(finalCardData);
    }
    
    setIsModalOpen(false);
    setModalData(null);
    
    toast({
      title: "Task Created! ✨",
      description: `Added "${cardData.title}" to ${defaultSubject || cardData.subject}`,
      className: "bg-swoon-blue text-white border-swoon-blue",
    });

    // Add success message to chat
    const successMessage: Message = {
      id: generateMessageId(),
      content: `Perfect! I've successfully created "${cardData.title}" and added it to your ${defaultSubject || cardData.subject} column. The card is now glowing to help you spot it easily!`,
      sender: 'assistant',
      timestamp: new Date(),
      cardCreated: true
    };
    setMessages(prev => [...prev, successMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: generateMessageId(),
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
      const taskCreationKeywords = ['create', 'add', 'new', 'assignment', 'homework', 'due', 'task', 'test', 'quiz', 'project'];
      const isTaskCreation = taskCreationKeywords.some(keyword => 
        currentInput.toLowerCase().includes(keyword)
      );

      let response: string;
      let cardCreated = false;

      if (isTaskCreation) {
        console.log('Detected task creation request:', currentInput);
        const result = await createTaskFromMessage(currentInput);
        console.log('Task creation result:', result);
        
        response = result.message;
        
        if (result.success && result.card) {
          // Extract card data and show modal for user to review/edit
          setModalData({
            title: result.card.title,
            subject: defaultSubject || result.card.subject, // Use defaultSubject if provided
            dueDate: result.card.dueDate,
            type: result.card.type
          });
          setIsModalOpen(true);
          
          response = `I've prepared your task card with the details I understood. Please review and confirm the information in the modal that just opened.`;
        } else if (result.needsMoreInfo) {
          console.log('Task creation needs more info:', result.message);
          // If more info is needed, the AI will ask for it in the response
        }
      } else {
        const lowerInput = currentInput.toLowerCase();
  
  // Enhanced priority/status detection
  const priorityKeywords = [
    'priority', 'priorities', 'urgent', 'first', 'important', 'focus',
    'status', 'what should i do', 'what to do', 'next task', 'start with',
    'most important', 'tackle first', 'begin with', 'work on first',
    'due soon', 'coming up', 'deadlines', 'schedule', 'today', 'tomorrow'
  ];
  
  const isPriorityRequest = priorityKeywords.some(keyword => 
    lowerInput.includes(keyword)
  );
  
  if (isPriorityRequest) {
    // Show WelcomeModal for priority tasks
    setShowWelcomeModal(true);
    response = "Let me show you what needs your attention right now! I've opened your priority overview.";
  } else if (lowerInput.includes('due') && lowerInput.includes('week')) {
    const dueSoon = getDueSoon();
    response = dueSoon.length > 0 
      ? `Here's what's due this week:\n${dueSoon.map(card => `• ${card.title} (${card.subject}) - Due ${card.dueDate.toLocaleDateString()}`).join('\n')}`
      : "You don't have any assignments due this week. Great job staying ahead!";
  } else {
    response = await sendChatMessage(currentInput);
  }
}

      const assistantMessage: Message = {
        id: generateMessageId(),
        content: response,
        sender: 'assistant',
        timestamp: new Date(),
        cardCreated
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: generateMessageId(),
        content: "I'm having trouble right now. Please try again in a moment!",
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalData(null);
    
    // Add cancellation message to chat
    const cancelMessage: Message = {
      id: generateMessageId(),
      content: "No problem! Let me know if you'd like to create a different task or need help with anything else.",
      sender: 'assistant',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, cancelMessage]);
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
    <>
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
                    max-w-[80%] p-3 rounded-lg text-sm relative
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
      
      {/* Modal rendered outside the main card to ensure proper z-index */}
      {modalData && (
        <AddCardModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSave={handleAddCard}
          defaultColumn={defaultSubject || modalData.subject}
          prefilledData={modalData}
        />
      )}
      {showWelcomeModal && (
  <WelcomeModal 
    onClose={() => setShowWelcomeModal(false)}
  />
)}
    </>
  );
};