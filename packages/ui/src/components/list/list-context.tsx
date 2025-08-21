'use client';

import { createContext, useContext } from 'react';

import type { SelectionKey } from './use-row-selection';

export interface RowSelectionContextProps {
  isSelectionMode: boolean;
  selectedKeys: SelectionKey[];
  toggleSelection: (key: SelectionKey) => void;
  selectAll: (keys: SelectionKey[]) => void;
  clearSelection: () => void;
  isSelected: (key: SelectionKey) => boolean;
  selectionActions?: React.ReactNode;
}

export const RowSelectionContext = createContext<RowSelectionContextProps | undefined>(undefined);

export const useRowSelectionContext = () => {
  const context = useContext(RowSelectionContext);
  if (!context) {
    throw new Error(
      'useRowSelectionContext must be used within a ListContainer with isSelectionMode enabled'
    );
  }
  return context;
};
