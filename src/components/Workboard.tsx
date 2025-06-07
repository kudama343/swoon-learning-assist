
import { WorkboardColumn } from './WorkboardColumn';
import { useWorkboard } from '@/hooks/useWorkboard';

export const Workboard = () => {
  const { cards } = useWorkboard();
  const columns = ['Core Math', 'AP American Literature', 'AP Biology'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {columns.map((column) => (
        <WorkboardColumn
          key={column}
          title={column}
          cards={cards[column] || []}
        />
      ))}
    </div>
  );
};