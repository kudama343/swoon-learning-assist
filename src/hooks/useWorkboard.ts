import { useState, useCallback } from 'react';
import { CerebrasService } from '@/services/cerebrasService';

interface WorkboardCard {
  id: string;
  title: string;
  type: string;
  dueDate: Date;
  subject: string;
  tags?: string[];
  score?: string;
  isDue?: boolean;
  isNewCard?: boolean;
}

interface WorkboardState {
  [subject: string]: WorkboardCard[];
}

export const useWorkboard = () => {
  const [columnOrder, setColumnOrder] = useState<string[]>(['Core Math', 'AP American Literature', 'AP Biology']);
  
  const [cards, setCards] = useState<WorkboardState>({
    'Core Math': [      {
        id: '1',
        title: 'Quadratic Equations Practice',
        type: 'Homework',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Due in 2 days
        subject: 'Core Math',
        tags: ['Homework', 'Algebra'],
      }
    ],
    'AP American Literature': [],
    'AP Biology': []
  });

  const [highlightedCard, setHighlightedCard] = useState<string | null>(null);

  const [cerebrasService] = useState(() => new CerebrasService());

  const moveColumnToFront = useCallback((subject: string) => {
    console.log('Moving column to front:', subject);
    setColumnOrder(prev => {
      const filtered = prev.filter(col => col !== subject);
      const newOrder = [subject, ...filtered];
      console.log('New column order:', newOrder);
      return newOrder;
    });
  }, []);

  const addCard = useCallback((card: Omit<WorkboardCard, 'id'>) => {
    console.log('Adding card:', card);
    
    const newCard: WorkboardCard = {
      ...card,
      id: Date.now().toString(),
      isNewCard: true,
      tags: [card.type, ...(card.tags || [])], // Add type to tags array
    };

    console.log('New card created:', newCard);

    setCards(prev => {
      const updated = {
        ...prev,
        [card.subject]: [...(prev[card.subject] || []), newCard],
      };
      console.log('Updated cards state:', updated);
      return updated;
    });

    // Move the column with the new card to the front
    moveColumnToFront(card.subject);

    // Set the highlighted card
    setHighlightedCard(newCard.id);

    // Auto-clear highlight after 5 seconds
    setTimeout(() => {
      console.log('Clearing highlight for card:', newCard.id);
      setHighlightedCard(null);
      setCards(prev => {
        const updated = { ...prev };
        updated[card.subject] = updated[card.subject].map(c => 
          c.id === newCard.id ? { ...c, isNewCard: false } : c
        );
        return updated;
      });
    }, 5000);

    return newCard;
  }, [moveColumnToFront]);

  const clearHighlight = useCallback(() => {
    setHighlightedCard(null);
    // Remove the isNewCard flag from all cards
    setCards(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(subject => {
        updated[subject] = updated[subject].map(card => ({
          ...card,
          isNewCard: false
        }));
      });
      return updated;
    });
  }, []);

  const createTaskFromMessage = useCallback(async (message: string) => {
    console.log('Creating task from message:', message);
    
    const result = await cerebrasService.createTask(message);
    console.log('Cerebras result:', result);
    
    if (result.success && result.card) {
      const newCard = addCard(result.card);
      console.log('Card added successfully:', newCard);
      return { success: true, card: newCard, message: result.message };
    }
    
    return { 
      success: false, 
      message: result.message,
      needsMoreInfo: result.needsMoreInfo 
    };
  }, [addCard, cerebrasService]);

  const sendChatMessage = useCallback(async (message: string) => {
    return await cerebrasService.sendMessage(message, cards);
  }, [cerebrasService, cards]);

  const getDueSoon = useCallback(() => {
    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);

    const dueSoon: WorkboardCard[] = [];
    
    Object.values(cards).flat().forEach(card => {
      if (card.dueDate <= threeDaysFromNow) {
        dueSoon.push(card);
      }
    });

    return dueSoon.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  }, [cards]);

  const getUrgentTasks = useCallback(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return Object.values(cards).flat().filter(card => card.dueDate <= tomorrow);
  }, [cards]);

  return {
    cards,
    columnOrder,
    addCard,
    createTaskFromMessage,
    sendChatMessage,
    getDueSoon,
    getUrgentTasks,
    highlightedCard,
    clearHighlight,
  };
};