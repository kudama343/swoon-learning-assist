import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import assistIcon from '@/components/assets/assist-icon.png'; // Adjust the path if needed

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
            <img
              src={assistIcon}
              alt="Swoon Assist"
              className="w-6 h-6"
            />
            {/* Notification dot */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-swoon-yellow rounded-full animate-pulse" />
          </div>
        )}
      </Button>

      {/* Swoon Learning Badge */}
      {!isOpen && (
        <div className="absolute bottom-16 right-0 bg-swoon-white rounded-lg shadow-md px-3 py-2 animate-float-in">
          
          {/* Arrow pointing down */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-swoon-white" />
          </div>
        </div>
      )}
    </div>
  );
};
