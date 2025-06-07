
import { Button } from '@/components/ui/button';
import { useWorkboard } from '@/hooks/useWorkboard';

export const CardHighlightOverlay = () => {
const { highlightedCard, clearHighlight } = useWorkboard() as any;

  if (!highlightedCard) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-white text-lg mb-4">
          New card created successfully!
        </div>
        <Button 
          onClick={clearHighlight}
          className="bg-swoon-blue hover:bg-swoon-bluer text-white"
        >
          OK
        </Button>
      </div>
    </div>
  );
};