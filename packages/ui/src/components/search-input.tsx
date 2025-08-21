import { Input } from '@acme/ui/components/input';
import { cn } from '@acme/ui/lib/utils';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  debounceTime?: number;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder,
  debounceTime = 300,
  className
}) => {
  // Local state for immediate visual feedback
  const [inputValue, setInputValue] = useState(value);

  // Create debounced version of the input value
  const [debouncedValue] = useDebounce(inputValue, debounceTime);

  // Update internal value when external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Call onChange when debounced value changes
  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, onChange, value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update internal value immediately for visual feedback
    setInputValue(e.target.value);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted" />
      <Input
        placeholder={placeholder}
        value={inputValue}
        id="search_input_list"
        name="search_input_list"
        onChange={handleInputChange}
        className={cn('py-1 pl-10 focus-visible:ring-0 md:max-w-96', className)}
      />
    </div>
  );
};

export default SearchInput;
