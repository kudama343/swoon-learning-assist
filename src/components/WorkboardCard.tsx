
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MoreHorizontal, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useWorkboard } from '@/hooks/useWorkboard';

interface WorkboardCardProps {
  card: {
    id: string;
    title: string;
    type: string;
    dueDate: Date;
    subject: string;
    tags?: string[];
    score?: string;
    isDue?: boolean;
    isNewCard?: boolean;
  };
}

export const WorkboardCard = ({ card }: WorkboardCardProps) => {
  const { highlightedCard } = useWorkboard();
  const isHighlighted = highlightedCard === card.id;

  return (
    <Card 
      className={`
        bg-swoon-white border border-swoon-mid-gray hover:shadow-lg transition-all duration-300 cursor-pointer group
        ${isHighlighted ? 'animate-pulse border-swoon-blue border-2 shadow-2xl shadow-swoon-blue/50 ring-4 ring-swoon-blue/30 scale-105' : 'hover:scale-102'}
        ${card.isNewCard ? 'animate-pulse border-swoon-blue border-2 shadow-2xl shadow-swoon-blue/50 ring-4 ring-swoon-blue/30 scale-105' : ''}
      `}
    >
      <div className="p-4 space-y-3">
        {/* Card Title */}
        <h4 className="font-medium text-swoon-black text-sm lg:text-base leading-relaxed group-hover:text-swoon-blue transition-colors">
          {card.title}
        </h4>
        
        {/* Tags */}
        {card.tags && (
          <div className="flex flex-wrap gap-2">
            {card.tags.map((tag, index) => (
              <Badge 
                key={index}
                className={`text-xs px-3 py-1 font-medium rounded-full ${
                  tag === 'Homework' 
                    ? 'bg-swoon-green/10 text-swoon-green border border-swoon-green/20' 
                    : 'bg-swoon-blue/10 text-swoon-blue border border-swoon-blue/20'
                }`}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Due Date and Actions */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            {card.isDue && <AlertCircle className="w-4 h-4 text-swoon-red" />}
            <Clock className="w-4 h-4 text-swoon-dark-gray" />
            <span className="text-swoon-dark-gray font-medium">{format(card.dueDate, 'MMM d')}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            {card.score && (
              <span className="text-swoon-dark-gray font-medium">{card.score}</span>
            )}
            <MoreHorizontal className="w-4 h-4 text-swoon-dark-gray cursor-pointer hover:text-swoon-blue transition-colors" />
            <div className="w-6 h-6 bg-gradient-to-br from-swoon-blue to-swoon-bluer rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white text-xs font-semibold">i</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};