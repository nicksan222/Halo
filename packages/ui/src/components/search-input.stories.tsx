import { useState } from 'react';
import SearchInput from './search-input';

export default {
  title: 'Components/SearchInput',
  component: SearchInput,
  parameters: {
    layout: 'centered'
  }
};

export const Default = () => {
  const [value, setValue] = useState('');

  return (
    <div className="w-[350px] space-y-4">
      <SearchInput value={value} onChange={setValue} placeholder="Search..." />
      <p className="text-sm text-muted-foreground">Current value: {value || '(empty)'}</p>
    </div>
  );
};

export const WithCustomPlaceholder = () => {
  const [value, setValue] = useState('');

  return (
    <div className="w-[350px] space-y-4">
      <SearchInput
        value={value}
        onChange={setValue}
        placeholder="Search for users, documents, or projects..."
      />
      <p className="text-sm text-muted-foreground">Current value: {value || '(empty)'}</p>
    </div>
  );
};

export const WithCustomDebounce = () => {
  const [value, setValue] = useState('');

  return (
    <div className="w-[350px] space-y-4">
      <SearchInput
        value={value}
        onChange={setValue}
        placeholder="Search with 500ms debounce..."
        debounceTime={500}
      />
      <p className="text-sm text-muted-foreground">Current value: {value || '(empty)'}</p>
    </div>
  );
};

export const WithInitialValue = () => {
  const [value, setValue] = useState('initial search term');

  return (
    <div className="w-[350px] space-y-4">
      <SearchInput value={value} onChange={setValue} placeholder="Search..." />
      <p className="text-sm text-muted-foreground">Current value: {value}</p>
    </div>
  );
};

export const CustomStyling = () => {
  const [value, setValue] = useState('');

  return (
    <div className="w-[350px] space-y-4">
      <SearchInput
        value={value}
        onChange={setValue}
        placeholder="Search with custom styling..."
        className="border-2 border-blue-300 focus:border-blue-500"
      />
      <p className="text-sm text-muted-foreground">Current value: {value || '(empty)'}</p>
    </div>
  );
};
