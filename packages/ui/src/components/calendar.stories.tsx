import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { Calendar } from './calendar';

export default {
  title: 'Components/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered'
  }
};

export const Default = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="w-[350px] space-y-4">
      <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
    </div>
  );
};

export const Multiple = () => {
  const [date, setDate] = useState<Date[] | undefined>();

  return (
    <div className="w-[350px] space-y-4">
      <Calendar mode="multiple" selected={date} onSelect={setDate} className="rounded-md border" />
    </div>
  );
};

export const Range = () => {
  const [date, setDate] = useState<DateRange | undefined>();

  return (
    <div className="w-[350px] space-y-4">
      <Calendar mode="range" selected={date} onSelect={setDate} className="rounded-md border" />
    </div>
  );
};

export const WithDisabledDates = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="w-[350px] space-y-4">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        disabled={(date) => date < new Date()}
        className="rounded-md border"
      />
    </div>
  );
};

export const WithCustomStyling = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="w-[350px] space-y-4">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border shadow-lg"
        classNames={{
          day_selected:
            'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
          day_today: 'bg-accent text-accent-foreground'
        }}
      />
    </div>
  );
};
