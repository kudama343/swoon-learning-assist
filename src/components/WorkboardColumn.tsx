
import { Card } from '@/components/ui/card';
import { WorkboardCard } from './WorkboardCard';
import { ChevronLeft, ChevronRight, MoreVertical, Plus } from 'lucide-react';

interface WorkboardColumnProps {
  title: string;
  cards: Array<{
    id: string;
    title: string;
    type: string;
    dueDate: Date;
    subject: string;
    tags?: string[];
    score?: string;
    isDue?: boolean;
  }>;
}

export const WorkboardColumn = ({ title, cards }: WorkboardColumnProps) => {
  return (
    <div className="bg-swoon-white rounded-lg border border-swoon-mid-gray min-w-0">
      {/* Column Header */}
      <div className="flex items-center justify-between p-3 md:p-4 border-b border-swoon-mid-gray">
        <div className="flex items-center space-x-1 md:space-x-2 min-w-0">
          <ChevronLeft className="w-3 h-3 md:w-4 md:h-4 text-swoon-dark-gray cursor-pointer hover:text-swoon-black flex-shrink-0" />
          <h3 className="font-semibold text-swoon-black text-xs md:text-sm truncate">{title}</h3>
          <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-swoon-dark-gray cursor-pointer hover:text-swoon-black flex-shrink-0" />
        </div>
        <MoreVertical className="w-3 h-3 md:w-4 md:h-4 text-swoon-dark-gray cursor-pointer hover:text-swoon-black flex-shrink-0" />
      </div>

      {/* Cards */}
      <div className="p-3 md:p-4 space-y-3 min-h-[300px] md:min-h-[400px]">
        {cards.map((card) => (
          <WorkboardCard key={card.id} card={card} />
        ))}
        
        {/* Add Card Button */}
        <button className="w-full border-2 border-dashed border-swoon-mid-gray rounded-lg p-3 md:p-4 text-swoon-dark-gray hover:border-swoon-blue hover:text-swoon-blue transition-colors flex items-center justify-center">
          <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
          <span className="text-xs md:text-sm">Add Card</span>
        </button>
      </div>
    </div>
  );
};