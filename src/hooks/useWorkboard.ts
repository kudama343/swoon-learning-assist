
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
    'Core Math': [],
    'AP American Literature': [],
    'AP Biology': []
  });

  const [highlightedCard, setHighlightedCard] = useState<string | null>(null);

  const [cerebrasService] = useState(() => new CerebrasService('csk-ckx4c5rfw9f4y6fdrtn5fyc564xcvvyynyfjvet3nvxcj6hj'));

  const moveColumnToFront = useCallback((subject: string) => {
    setColumnOrder(prev => {
      const filtered = prev.filter(col => col !== subject);
      return [subject, ...filtered];
    });
  }, []);

  const addCard = useCallback((card: Omit<WorkboardCard, 'id'>) => {
    const newCard: WorkboardCard = {
      ...card,
      id: Date.now().toString(),
      isNewCard: true,
    };

    setCards(prev => ({
      ...prev,
      [card.subject]: [...(prev[card.subject] || []), newCard],
    }));

    // Move the column with the new card to the front
    moveColumnToFront(card.subject);

    // Set the highlighted card
    setHighlightedCard(newCard.id);

    // Auto-clear highlight after 5 seconds
    setTimeout(() => {
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
    const result = await cerebrasService.createTask(message);
    
    if (result.success && result.card) {
      const newCard = addCard(result.card);
      return { success: true, card: newCard, message: result.message };
    }
    
    return { success: false, message: result.message };
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