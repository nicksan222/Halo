import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@acme/ui/components/command';
import { Popover, PopoverContent, PopoverTrigger } from '@acme/ui/components/popover';
import { Separator } from '@acme/ui/components/separator';
import { cn } from '@acme/ui/lib/utils';
import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import { CheckIcon, ChevronDown, XIcon } from 'lucide-react';
import * as React from 'react';

/**
 * Variants for the multi-select component to handle different styles.
 * Uses class-variance-authority (cva) to define different styles based on "variant" prop.
 */
const multiSelectVariants = cva(
  'm-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300',
  {
    variants: {
      variant: {
        default: 'border-foreground/10 text-foreground bg-card hover:bg-card/80',
        secondary:
          'border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        inverted: 'inverted'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

/**
 * Props for MultiSelect component
 */
interface MultiSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  /**
   * An array of option objects to be displayed in the multi-select component.
   * Each option object has a label, value, and an optional icon.
   */
  options: {
    /** The text to display for the option. */
    label: string;
    /** The unique value associated with the option. */
    value: string;
    /** Optional icon component to display alongside the option. */
    icon?: React.ComponentType<{ className?: string }>;
  }[];

  /**
   * Callback function triggered when the selected values change.
   * Receives an array of the new selected values.
   */
  onValueChange: (value: string[]) => void;

  /**
   * Currently selected values (controlled component mode)
   */
  value?: string[];

  /** The default selected values when the component mounts. */
  defaultValue?: string[];

  /**
   * Placeholder text to be displayed when no values are selected.
   * Optional, defaults to "Select options".
   */
  placeholder?: string;

  /**
   * Animation duration in seconds for the visual effects (e.g., bouncing badges).
   * Optional, defaults to 0 (no animation).
   */
  animation?: number;

  /**
   * Maximum number of items to display. Extra selected items will be summarized.
   * Optional, defaults to 3.
   */
  maxCount?: number;

  /**
   * The modality of the popover. When set to true, interaction with outside elements
   * will be disabled and only popover content will be visible to screen readers.
   * Optional, defaults to false.
   */
  modalPopover?: boolean;

  /**
   * If true, renders the multi-select component as a child of another component.
   * Optional, defaults to false.
   */
  asChild?: boolean;

  /**
   * Maximum number of options that can be selected.
   * Optional, defaults to unlimited.
   */
  maxSelectable?: number;

  /**
   * If true, disables the "Select All" option.
   * Optional, defaults to false.
   */
  disableSelectAll?: boolean;

  /**
   * Additional class names to apply custom styles to the multi-select component.
   * Optional, can be used to add custom styles.
   */
  className?: string;
}

export const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  (
    {
      options,
      onValueChange,
      variant,
      defaultValue = [],
      value,
      placeholder = 'Seleziona opzioni',
      animation = 0, // Keep param for compatibility but ignore it
      maxCount = 3,
      maxSelectable = Number.POSITIVE_INFINITY,
      disableSelectAll = false,
      modalPopover = false,
      asChild = false,
      className,
      ...props
    },
    ref
  ) => {
    // Initialize from value if provided, otherwise use defaultValue
    const [selectedValues, setSelectedValues] = React.useState<string[]>(value || defaultValue);
    const [isOpen, setIsOpen] = React.useState(false);

    // Update internal state when the value prop changes (controlled component behavior)
    React.useEffect(() => {
      if (value !== undefined) {
        setSelectedValues(value);
      }
    }, [value]);

    const toggleOption = (option: string) => {
      if (selectedValues.includes(option)) {
        // Always allow removing options
        const newSelectedValues = selectedValues.filter((value) => value !== option);
        setSelectedValues(newSelectedValues);
        onValueChange(newSelectedValues);
      } else if (selectedValues.length < maxSelectable) {
        // Only add if we're under the limit
        const newSelectedValues = [...selectedValues, option];
        setSelectedValues(newSelectedValues);
        onValueChange(newSelectedValues);
      }
      // If we've hit the limit, silently ignore additional selections
    };

    const handleClear = (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setSelectedValues([]);
      onValueChange([]);
    };

    const _clearExtraOptions = (e: React.MouseEvent) => {
      e.stopPropagation();
      const newSelectedValues = selectedValues.slice(0, maxCount);
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    const toggleAll = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (selectedValues.length === options.length) {
        handleClear();
      } else {
        const allValues = options.map((option) => option.value);
        // Only select up to the maximum allowed
        const limitedValues = allValues.slice(0, maxSelectable);
        setSelectedValues(limitedValues);
        onValueChange(limitedValues);
      }
    };

    // Find selected option labels for display
    const selectedLabels = selectedValues
      .map((val) => options.find((opt) => opt.value === val)?.label)
      .filter(Boolean) as string[];

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen} modal={modalPopover}>
        <PopoverTrigger asChild>
          <button
            ref={ref}
            type="button"
            {...props}
            className={cn(
              // Use the same style as Input/Textarea
              'border-foreground-75 flex w-full rounded-lg border bg-none',
              'px-3 py-2 text-sm ring-offset-background file:border-0 disabled:opacity-50',
              'focus-visible:-ring-offset-1 focus-visible:ring-ring disabled:cursor-not-allowed',
              'file:bg-transparent file:text-sm file:font-medium',
              'placeholder:text-muted-foreground/30 focus-visible:outline-none focus-visible:ring-1',
              'h-10 items-center justify-between',
              'transition-colors',
              'hover:bg-background',
              className
            )}
          >
            <span
              className={cn(
                'flex-1 truncate text-left',
                selectedLabels.length === 0 && 'text-muted-foreground/30'
              )}
            >
              {selectedLabels.length > 0
                ? selectedLabels.slice(0, maxCount).join(', ') +
                  (selectedLabels.length > maxCount
                    ? `, +${selectedLabels.length - maxCount} altro${selectedLabels.length - maxCount > 1 ? 'i' : ''}`
                    : '')
                : placeholder}
            </span>
            <div className="ml-2 flex items-center gap-1">
              {selectedLabels.length > 0 && (
                <XIcon
                  className="h-4 w-4 cursor-pointer text-muted-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear(e);
                  }}
                />
              )}
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="max-h-[300px] w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command className="w-full" shouldFilter={false}>
            <CommandInput
              placeholder="Cerca..."
              className="border-none focus:ring-0"
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  e.preventDefault();
                  setIsOpen(false);
                }
              }}
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {!disableSelectAll && (
                  <CommandItem
                    onSelect={() =>
                      toggleAll({
                        stopPropagation: () => {}
                      } as React.MouseEvent)
                    }
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        selectedValues.length === options.length
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <CheckIcon className="h-4 w-4" />
                    </div>
                    <span>(Seleziona tutti)</span>
                  </CommandItem>
                )}

                {options.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  const isDisabled = !isSelected && selectedValues.length >= maxSelectable;

                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => toggleOption(option.value)}
                      disabled={isDisabled}
                      className={isDisabled ? 'cursor-not-allowed opacity-50' : ''}
                    >
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50 [&_svg]:invisible'
                        )}
                      >
                        <CheckIcon className="h-4 w-4" />
                      </div>
                      {option.icon && (
                        <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      )}
                      <span>{option.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <div className="flex items-center justify-between">
                  {selectedValues.length > 0 && (
                    <>
                      <CommandItem onSelect={() => handleClear()} className="flex-1 justify-center">
                        Rimuovi tutti
                      </CommandItem>
                      <Separator orientation="vertical" className="flex h-full min-h-6" />
                    </>
                  )}
                  <CommandItem onSelect={() => setIsOpen(false)} className="flex-1 justify-center">
                    Chiudi
                  </CommandItem>
                </div>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

MultiSelect.displayName = 'MultiSelect';
