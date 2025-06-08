import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { WorkboardCard } from './WorkboardCard';
import { AddCardModal } from './AddCardModal';
import { ChatInterface } from '@/components/chat/ChatInterface'; // Import ChatInterface
import { ChevronLeft, ChevronRight, MoreVertical, Plus, MessageCircle } from 'lucide-react';
import { useWorkboard } from '@/hooks/useWorkboard';

interface WorkboardColumnProps {
  title: string;
}

export const WorkboardColumn = ({ title }: WorkboardColumnProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // Add chat state
  const [prefilledData, setPrefilledData] = useState<{
    title: string;
    subject: string;
    dueDate: Date;
    type: string;
  } | null>(null);

  const { addCard, cards } = useWorkboard();

  // Get cards for this specific column
  const columnCards = cards[title] || [];

  const handleAddCard = (cardData: {
    title: string;
    subject: string;
    dueDate: Date;
    type: string;
  }) => {
    console.log('card data: ', cardData);
    addCard(cardData);
    setIsModalOpen(false);
    setPrefilledData(null);
  };

  // Listen for prefilledData updates and auto-open modal if provided
  useEffect(() => {
    if (prefilledData) {
      setIsModalOpen(true);
    }
  }, [prefilledData]);

  return (
    <>
      <div className="bg-swoon-white rounded-xl border border-swoon-mid-gray shadow-sm hover:shadow-md transition-shadow duration-200 w-full">
        {/* Column Header */}
        <div className="flex items-center justify-between p-4 border-b border-swoon-mid-gray bg-gradient-to-r from-swoon-light-blue to-swoon-white rounded-t-xl">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <ChevronLeft className="w-4 h-4 text-swoon-dark-gray cursor-pointer hover:text-swoon-blue transition-colors flex-shrink-0" />
            <h3 className="font-semibold text-swoon-black text-sm lg:text-base truncate">{title}</h3>
            <ChevronRight className="w-4 h-4 text-swoon-dark-gray cursor-pointer hover:text-swoon-blue transition-colors flex-shrink-0" />
          </div>
          <div className="flex items-center space-x-2">
            {/* Chat button for this column */}
            <MessageCircle 
              className="w-4 h-4 text-swoon-dark-gray cursor-pointer hover:text-swoon-blue transition-colors flex-shrink-0" 
              onClick={() => setIsChatOpen(true)}
             
            />
            <MoreVertical className="w-4 h-4 text-swoon-dark-gray cursor-pointer hover:text-swoon-blue transition-colors flex-shrink-0" />
          </div>
        </div>

        {/* Cards Container */}
        <div className="p-4 space-y-3 min-h-[250px] sm:min-h-[300px] lg:min-h-[400px]">
          {columnCards.map((card) => (
            <WorkboardCard key={card.id} card={card} />
          ))}

          {/* Add Card Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full border-2 border-dashed border-swoon-mid-gray rounded-xl p-4 text-swoon-dark-gray hover:border-swoon-blue hover:text-swoon-blue hover:bg-swoon-light-blue/30 transition-all duration-200 flex items-center justify-center group"
          >
            <Plus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Add Card</span>
          </button>
        </div>

        {/* Add Card Modal */}
        <AddCardModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setPrefilledData(null);
          }}
          onSave={handleAddCard}
          defaultColumn={title}
          prefilledData={prefilledData || undefined}
        />
      </div>

      {/* ChatInterface for this specific column */}
      <ChatInterface
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        defaultSubject={title} // Pass the column title as default subject
        onCardCreate={handleAddCard} // Pass the handleAddCard function
      />
    </>
  );
};