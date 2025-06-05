
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloatingChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export const FloatingChatButton = ({ isOpen, onClick }: FloatingChatButtonProps) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={onClick}
        className={`
          w-14 h-14 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110
          ${isOpen 
            ? 'bg-swoon-bluer hover:bg-swoon-bluer/90' 
            : 'bg-swoon-blue hover:bg-swoon-bluer'
          }
        `}
        size="icon"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-6 h-6 text-white" />
            {/* Notification dot */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-swoon-yellow rounded-full animate-pulse" />
          </div>
        )}
      </Button>

      {/* Swoon Learning Badge */}
      {!isOpen && (
        <div className="absolute bottom-16 right-0 bg-swoon-white rounded-lg shadow-md px-3 py-2 animate-float-in">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-swoon-blue rounded-sm flex items-center justify-center">
              <span className="text-white font-bold text-xs">S</span>
            </div>
            <span className="text-swoon-black text-sm font-medium">Swoon Assist</span>
          </div>
          {/* Arrow pointing down */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-swoon-white" />
          </div>
        </div>
      )}
    </div>
  );
};