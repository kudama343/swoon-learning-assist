
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Construction } from 'lucide-react';

interface ComingSoonModalProps {
  title: string;
  onClose: () => void;
}

export const ComingSoonModal = ({ title, onClose }: ComingSoonModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-swoon-white max-w-md w-full transform transition-all duration-300">
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-swoon-yellow rounded-full flex items-center justify-center">
                <Construction className="w-6 h-6 text-swoon-black" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-swoon-black">{title}</h2>
                <p className="text-swoon-dark-gray text-sm">Coming Soon</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-swoon-dark-gray hover:text-swoon-black h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="bg-swoon-light-blue p-4 rounded-lg">
            <p className="text-swoon-black text-sm">
              The <strong>{title}</strong> section is currently under development. 
              We're working hard to bring you this feature soon!
            </p>
          </div>

          {/* Action Button */}
          <Button 
            onClick={onClose}
            className="w-full bg-swoon-blue hover:bg-swoon-bluer text-white"
          >
            Got it, thanks!
          </Button>
        </div>
      </Card>
    </div>
  );
};