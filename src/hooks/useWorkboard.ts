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
  const STORAGE_KEY = 'workboard_data';
  const [columnOrder, setColumnOrder] = useState<string[]>(['Core Math', 'AP American Literature', 'AP Biology']);
  
  const [cards, setCards] = useState<WorkboardState>(() => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      Object.keys(parsed).forEach(subject => {
        parsed[subject] = parsed[subject].map((card: any) => ({
          ...card,
          dueDate: new Date(card.dueDate)
        }));
      });
      return parsed;
    }
  } catch (error) {
    console.error('Error loading workboard data:', error);
  }
  
  // Default data if nothing in localStorage
  return {
    'Core Math': [],
    'AP American Literature': [],
    'AP Biology': []
  };
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
    tags: [card.type, ...(card.tags || [])],
  };

  console.log('New card created:', newCard);

  setCards(prev => {
    const updated = {
      ...prev,
      [card.subject]: [...(prev[card.subject] || []), newCard],
    };
    console.log('Updated cards state:', updated);
    
    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
    
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
      
      // Save updated state to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
      
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
  const dueSoon: WorkboardCard[] = [];
  
  Object.values(cards).flat().forEach(card => {
    dueSoon.push(card);
  });

  // Sort by due date (earliest first) and return only first 2
  return dueSoon
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
    .slice(0, 2);
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