
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
    <div className="bg-swoon-white rounded-lg border border-swoon-mid-gray">
      {/* Column Header */}
      <div className="flex items-center justify-between p-4 border-b border-swoon-mid-gray">
        <div className="flex items-center space-x-2">
          <ChevronLeft className="w-4 h-4 text-swoon-dark-gray cursor-pointer hover:text-swoon-black" />
          <h3 className="font-semibold text-swoon-black text-sm">{title}</h3>
          <ChevronRight className="w-4 h-4 text-swoon-dark-gray cursor-pointer hover:text-swoon-black" />
        </div>
        <MoreVertical className="w-4 h-4 text-swoon-dark-gray cursor-pointer hover:text-swoon-black" />
      </div>

      {/* Cards */}
      <div className="p-4 space-y-3 min-h-[400px]">
        {cards.map((card) => (
          <WorkboardCard key={card.id} card={card} />
        ))}
        
        {/* Add Card Button */}
        <button className="w-full border-2 border-dashed border-swoon-mid-gray rounded-lg p-4 text-swoon-dark-gray hover:border-swoon-blue hover:text-swoon-blue transition-colors flex items-center justify-center">
          <Plus className="w-4 h-4 mr-2" />
          <span className="text-sm">Add Card</span>
        </button>
      </div>
    </div>
  );
};