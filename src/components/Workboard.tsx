
import { WorkboardColumn } from './WorkboardColumn';
import { useWorkboard } from '@/hooks/useWorkboard';

export const Workboard = () => {
  const { cards, columnOrder } = useWorkboard();

  return (
    <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 lg:gap-6">
      {columnOrder.map((column) => (
        <WorkboardColumn
          key={column}
          title={column}
          cards={cards[column] || []}
        />
      ))}
    </div>
  );
};