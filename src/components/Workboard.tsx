
import { WorkboardColumn } from './WorkboardColumn';

const mockCards = {
  'Core Math': [
    {
      id: '1',
      title: 'dadad',
      type: 'Assignment',
      dueDate: new Date(2024, 4, 16), // May 16, 2024
      subject: 'Core Math'
    },
    {
      id: '2',
      title: 'dadda',
      type: 'Assignment',
      dueDate: new Date(2024, 4, 18), // May 18, 2024
      subject: 'Core Math'
    },
    {
      id: '3',
      title: 'Turn in language arts worksheet by 8:10 AM the next day',
      type: 'Homework',
      tags: ['Homework', 'Session Summary'],
      dueDate: new Date(2024, 4, 16), // May 16
      subject: 'Core Math',
      score: '0/4',
      isDue: true
    },
    {
      id: '4',
      title: 'Review Fanboys information on Trello board',
      type: 'Session Summary',
      tags: ['Session Summary'],
      dueDate: new Date(2024, 4, 18), // May 18
      subject: 'Core Math',
      score: '0/2'
    }
  ],
  'AP American Literature': [],
  'AP Biology': [],
  'AP Calculus AB': [],
  'AP Calculus BC': []
};

export const Workboard = () => {
  const columns = ['Core Math', 'AP American Literature', 'AP Biology', 'AP Calculus AB', 'AP Calculus BC'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {columns.map((column) => (
        <WorkboardColumn
          key={column}
          title={column}
          cards={mockCards[column as keyof typeof mockCards] || []}
        />
      ))}
    </div>
  );
};