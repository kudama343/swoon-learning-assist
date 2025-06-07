
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
    <div className="bg-swoon-white rounded-xl border border-swoon-mid-gray shadow-sm hover:shadow-md transition-shadow duration-200 w-full">
      {/* Column Header */}
      <div className="flex items-center justify-between p-4 border-b border-swoon-mid-gray bg-gradient-to-r from-swoon-light-blue to-swoon-white rounded-t-xl">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <ChevronLeft className="w-4 h-4 text-swoon-dark-gray cursor-pointer hover:text-swoon-blue transition-colors flex-shrink-0" />
          <h3 className="font-semibold text-swoon-black text-sm lg:text-base truncate">{title}</h3>
          <ChevronRight className="w-4 h-4 text-swoon-dark-gray cursor-pointer hover:text-swoon-blue transition-colors flex-shrink-0" />
        </div>
        <MoreVertical className="w-4 h-4 text-swoon-dark-gray cursor-pointer hover:text-swoon-blue transition-colors flex-shrink-0" />
      </div>

      {/* Cards Container */}
      <div className="p-4 space-y-3 min-h-[250px] sm:min-h-[300px] lg:min-h-[400px]">
        {cards.map((card) => (
          <WorkboardCard key={card.id} card={card} />
        ))}
        
        {/* Add Card Button */}
        <button className="w-full border-2 border-dashed border-swoon-mid-gray rounded-xl p-4 text-swoon-dark-gray hover:border-swoon-blue hover:text-swoon-blue hover:bg-swoon-light-blue/30 transition-all duration-200 flex items-center justify-center group">
          <Plus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium">Add Card</span>
        </button>
      </div>
    </div>
  );
};