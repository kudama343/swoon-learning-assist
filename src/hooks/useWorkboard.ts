
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
}

interface WorkboardState {
  [subject: string]: WorkboardCard[];
}

export const useWorkboard = () => {
  const [cards, setCards] = useState<WorkboardState>({
    'Core Math': [
      {
        id: '1',
        title: 'dadad',
        type: 'Assignment',
        dueDate: new Date(2024, 4, 16),
        subject: 'Core Math'
      },
      {
        id: '2',
        title: 'dadda',
        type: 'Assignment',
        dueDate: new Date(2024, 4, 18),
        subject: 'Core Math'
      },
      {
        id: '3',
        title: 'Turn in language arts worksheet by 8:10 AM the next day',
        type: 'Homework',
        tags: ['Homework', 'Session Summary'],
        dueDate: new Date(2024, 4, 16),
        subject: 'Core Math',
        score: '0/4',
        isDue: true
      },
      {
        id: '4',
        title: 'Review Fanboys information on Trello board',
        type: 'Session Summary',
        tags: ['Session Summary'],
        dueDate: new Date(2024, 4, 18),
        subject: 'Core Math',
        score: '0/2'
      }
    ],
    'AP American Literature': [],
    'AP Biology': [],
    'AP Calculus AB': [],
    'AP Calculus BC': []
  });

  const [cerebrasService] = useState(() => new CerebrasService('csk-ckx4c5rfw9f4y6fdrtn5fyc564xcvvyynyfjvet3nvxcj6hj'));

  const addCard = useCallback((card: Omit<WorkboardCard, 'id'>) => {
    const newCard: WorkboardCard = {
      ...card,
      id: Date.now().toString(),
    };

    setCards(prev => ({
      ...prev,
      [card.subject]: [...(prev[card.subject] || []), newCard],
    }));

    return newCard;
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
    addCard,
    createTaskFromMessage,
    sendChatMessage,
    getDueSoon,
    getUrgentTasks,
  };
};