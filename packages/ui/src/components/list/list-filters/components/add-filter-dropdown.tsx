import { Button } from '@acme/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@acme/ui/components/dropdown-menu';
import { Input } from '@acme/ui/components/input';
import { cn } from '@acme/ui/lib/utils';
import { PlusIcon, Search, SlidersHorizontal } from 'lucide-react';
import React from 'react';
import type { FieldValues } from 'react-hook-form';

import type { FilterDef } from '../types';

interface AddFilterDropdownProps<TFormValues extends FieldValues> {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  available: FilterDef<TFormValues>[];
  onAdd: (filter: FilterDef<TFormValues>) => void;
  filterSearch: string;
  onFilterSearchChange: (value: string) => void;
  showFullButton: boolean;
  activeFilterKeys?: string[]; // New prop to track already selected filter keys
}

export function AddFilterDropdown<TFormValues extends FieldValues>({
  isOpen,
  onOpenChange,
  available,
  onAdd,
  filterSearch,
  onFilterSearchChange,
  showFullButton,
  activeFilterKeys = []
}: AddFilterDropdownProps<TFormValues>) {
  // First filter out any already selected filters (if not already done by parent)
  const availableFilters = React.useMemo(() => {
    return available.filter((filter) => !activeFilterKeys.includes(filter.key as string));
  }, [available, activeFilterKeys]);

  // Then apply the search filter
  const filteredFilters = filterSearch
    ? availableFilters.filter((f) => f.label.toLowerCase().includes(filterSearch.toLowerCase()))
    : availableFilters;

  return (
    <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        {showFullButton ? (
          <Button
            size="sm"
            variant="default"
            className="shrink-0 rounded-md bg-background/10 px-3 text-foreground/90 hover:bg-background/20"
            suppressHydrationWarning
          >
            <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" />
            <span className="whitespace-nowrap">Filtra</span>
          </Button>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 shrink-0 rounded-md p-0 hover:*:bg-accent/20"
            suppressHydrationWarning
          >
            <PlusIcon className="h-3.5 w-3.5" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="max-h-[280px] min-w-[200px] overflow-y-auto rounded-lg p-0 shadow-md"
      >
        {/* bg-background → bg-popover per uniformare lo sfondo */}
        <div className="sticky top-0 z-10 bg-popover px-1.5 pt-1.5">
          <div className="relative">
            <Search className="absolute left-1.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/70" />
            <Input
              type="text"
              placeholder="Cerca"
              value={filterSearch}
              onChange={(e) => onFilterSearchChange(e.target.value)}
              className={cn(
                'w-full pl-6 text-xs outline-none',
                'h-8 border-0 bg-transparent shadow-none focus:ring-0'
              )}
            />
          </div>
        </div>
        <div className="">
          {filteredFilters.length === 0 ? (
            <DropdownMenuItem disabled className="text-xs text-muted-foreground">
              Nessun filtro disponibile
            </DropdownMenuItem>
          ) : (
            filteredFilters.map((filter) => (
              <DropdownMenuItem
                key={String(filter.key)}
                onClick={(e) => {
                  e.preventDefault();
                  onAdd(filter);
                  onFilterSearchChange('');
                }}
                className="cursor-pointer px-3 py-2 transition hover:bg-accent/60"
              >
                {filter.label}
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
