
import { WorkboardColumn } from './WorkboardColumn';
import { useWorkboard } from '@/hooks/useWorkboard';

export const Workboard = () => {
  const { cards, columnOrder } = useWorkboard();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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