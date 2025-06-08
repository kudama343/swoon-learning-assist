// Updated AddCardModal.tsx - Add prefilledData prop

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (card: {
    title: string;
    subject: string;
    dueDate: Date;
    type: string;
  }) => void;
  defaultColumn?: string;
  prefilledData?: {
    title: string;
    subject: string;
    dueDate: Date;
    type: string;
  };
}

export const AddCardModal = ({ isOpen, onClose, onSave, defaultColumn, prefilledData }: AddCardModalProps) => {
  const [title, setTitle] = useState('');
  const [selectedColumn, setSelectedColumn] = useState(defaultColumn || '');
  const [dueDate, setDueDate] = useState<Date>();
  const [type, setType] = useState('');

  const columns = ['Core Math', 'AP American Literature', 'AP Biology'];
  const cardTypes = ['Assignment', 'Quiz', 'Test', 'Project', 'Homework'];

  // Effect to populate fields when prefilledData is provided
  useEffect(() => {
    if (prefilledData) {
      setTitle(prefilledData.title);
      setSelectedColumn(prefilledData.subject);
      setDueDate(prefilledData.dueDate);
      setType(prefilledData.type);
    } else {
      // Reset to defaults when no prefilled data
      setTitle('');
      setSelectedColumn(defaultColumn || '');
      setDueDate(undefined);
      setType('');
    }
  }, [prefilledData, defaultColumn]);

  const handleSave = () => {
    if (!title || !selectedColumn || !dueDate || !type) {
      return; // Don't save if required fields are missing
    }

    onSave({
      title,
      subject: selectedColumn,
      dueDate,
      type,
    });

    // Reset form
    setTitle('');
    setSelectedColumn(defaultColumn || '');
    setDueDate(undefined);
    setType('');
    onClose();
  };

  const handleCancel = () => {
    // Reset form
    setTitle('');
    setSelectedColumn(defaultColumn || '');
    setDueDate(undefined);
    setType('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {prefilledData ? 'Review and Confirm Task' : 'Add New Card'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Core Math Assignment"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="column">Column</Label>
            <Select value={selectedColumn} onValueChange={setSelectedColumn}>
              <SelectTrigger>
                <SelectValue placeholder="Select a column" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((column) => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "EEEE, MMMM do") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                {cardTypes.map((cardType) => (
                  <SelectItem key={cardType} value={cardType}>
                    {cardType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!title || !selectedColumn || !dueDate || !type}
          >
            {prefilledData ? 'Confirm & Save' : 'Save'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};