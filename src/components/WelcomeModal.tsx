
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Calendar, AlertCircle, Lightbulb } from 'lucide-react';

interface WelcomeModalProps {
  onClose: () => void;
}

export const WelcomeModal = ({ onClose }: WelcomeModalProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const upcomingTasks = [
    {
      title: 'AP Biology lab report',
      subject: 'AP Biology',
      dueDate: 'tomorrow',
      priority: 'high'
    },
    {
      title: 'Core Math homework',
      subject: 'Core Math',
      dueDate: 'in 2 days',
      priority: 'medium'
    }
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className={`
        bg-swoon-white max-w-md w-full transform transition-all duration-300
        ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
      `}>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-swoon-blue rounded-full flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-swoon-black">🎯 Good morning, Kelly!</h2>
                <p className="text-swoon-dark-gray text-sm">Here's what needs your attention</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-swoon-dark-gray hover:text-swoon-black h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Due Soon Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-swoon-red" />
              <h3 className="font-semibold text-swoon-black">📚 Due Soon:</h3>
            </div>
            
            <div className="space-y-3">
              {upcomingTasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-swoon-light-gray rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-swoon-black text-sm">{task.title}</p>
                    <p className="text-xs text-swoon-dark-gray">{task.subject}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`text-xs ${
                      task.priority === 'high' 
                        ? 'bg-swoon-red text-white' 
                        : 'bg-swoon-yellow text-swoon-black'
                    }`}>
                      Due {task.dueDate}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggestion */}
          <div className="bg-swoon-light-blue p-4 rounded-lg space-y-2">
            <div className="flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-swoon-blue" />
              <h3 className="font-semibold text-swoon-black">💡 Suggestion:</h3>
            </div>
            <p className="text-sm text-swoon-black">
              Start with your <strong>biology lab report</strong> since it's due tomorrow!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button 
              onClick={handleClose}
              className="flex-1 bg-swoon-blue hover:bg-swoon-bluer text-white"
            >
              Got it, thanks!
            </Button>
            <Button 
              variant="outline"
              onClick={handleClose}
              className="border-swoon-mid-gray text-swoon-dark-gray hover:bg-swoon-light-gray"
            >
              Remind me later
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};