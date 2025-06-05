
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MoreHorizontal, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

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
  };
}

export const WorkboardCard = ({ card }: WorkboardCardProps) => {
  return (
    <Card className="bg-swoon-white border border-swoon-mid-gray hover:shadow-md transition-shadow cursor-pointer">
      <div className="p-3 space-y-3">
        {/* Card Title */}
        <h4 className="font-medium text-swoon-black text-sm leading-5">{card.title}</h4>
        
        {/* Tags */}
        {card.tags && (
          <div className="flex flex-wrap gap-1">
            {card.tags.map((tag, index) => (
              <Badge 
                key={index}
                className={`text-xs px-2 py-1 ${
                  tag === 'Homework' 
                    ? 'bg-swoon-green text-white' 
                    : 'bg-swoon-blue text-white'
                }`}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Due Date and Score */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1">
            {card.isDue && <AlertCircle className="w-3 h-3 text-swoon-red" />}
            <Clock className="w-3 h-3 text-swoon-dark-gray" />
            <span className="text-swoon-dark-gray">{format(card.dueDate, 'MMM d')}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {card.score && (
              <span className="text-swoon-dark-gray">{card.score}</span>
            )}
            <MoreHorizontal className="w-3 h-3 text-swoon-dark-gray cursor-pointer hover:text-swoon-black" />
            <div className="w-6 h-6 bg-swoon-blue rounded-full flex items-center justify-center">
              <span className="text-white text-xs">i</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};