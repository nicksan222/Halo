'use client';

import { Clock } from 'lucide-react';
import * as React from 'react';
import { cn } from '../lib/utils';
import { Button } from './button';
import { Input } from './input';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { ScrollArea } from './scroll-area';

interface TimePickerProps {
  value?: string;
  onChange?: (time: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
  minuteStep?: number;
}

export function TimePicker({
  value,
  onChange,
  placeholder = 'Select time',
  className,
  disabled,
  id,
  minuteStep = 15
}: TimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const generateTimeSlots = () => {
    const slots: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += minuteStep) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const timeSlots = React.useMemo(() => generateTimeSlots(), [minuteStep]);

  const formatDisplay = (time: string) => {
    if (!time) return placeholder;
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {formatDisplay(value || '')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <ScrollArea className="h-72">
          <div className="p-1">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={value === time ? 'default' : 'ghost'}
                className="w-full justify-start font-normal"
                size="sm"
                onClick={() => {
                  onChange?.(time);
                  setIsOpen(false);
                }}
              >
                {formatDisplay(time)}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

interface TimeInputProps {
  value?: string;
  onChange?: (time: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
}

export function TimeInput({
  value,
  onChange,
  placeholder = '00:00',
  className,
  disabled,
  id
}: TimeInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    // Remove non-numeric characters except colon
    let cleaned = input.replace(/[^\d:]/g, '');

    // Auto-insert colon after 2 digits if not present
    if (cleaned.length === 2 && !cleaned.includes(':')) {
      cleaned = `${cleaned}:`;
    }

    // Limit to HH:MM format
    if (cleaned.length > 5) {
      cleaned = cleaned.slice(0, 5);
    }

    // Validate hours and minutes
    const [hours, minutes] = cleaned.split(':');
    if (hours && parseInt(hours, 10) > 23) {
      cleaned = `23${minutes ? `:${minutes}` : ''}`;
    }
    if (minutes && parseInt(minutes, 10) > 59) {
      cleaned = `${hours}:59`;
    }

    onChange?.(cleaned);
  };

  return (
    <div className={cn('relative', className)}>
      <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        id={id}
        type="text"
        value={value || ''}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className="pl-10"
        maxLength={5}
      />
    </div>
  );
}
