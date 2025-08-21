import { useCallback, useState } from 'react';

export type SelectionKey = string | number;

export interface SelectionOptions<T> {
  initialKeys?: SelectionKey[];
  getKey?: (item: T) => SelectionKey;
  onSelectionChange?: (keys: SelectionKey[]) => void;
  maxSelections?: number;
}

export function useRowSelection<T = any>({
  initialKeys = [],
  getKey = (item: T) => item as unknown as SelectionKey,
  onSelectionChange,
  maxSelections
}: SelectionOptions<T>) {
  const [selectedKeys, setSelectedKeys] = useState<SelectionKey[]>(initialKeys);

  const updateSelection = useCallback(
    (newKeys: SelectionKey[]) => {
      const finalKeys = maxSelections ? newKeys.slice(0, maxSelections) : newKeys;
      setSelectedKeys(finalKeys);
      onSelectionChange?.(finalKeys);
    },
    [maxSelections, onSelectionChange]
  );

  const toggleSelection = useCallback(
    (key: SelectionKey) => {
      updateSelection(
        selectedKeys.includes(key) ? selectedKeys.filter((k) => k !== key) : [...selectedKeys, key]
      );
    },
    [selectedKeys, updateSelection]
  );

  const selectAll = useCallback(
    (items: T[]) => {
      const keys = items.map(getKey);
      updateSelection(keys);
    },
    [getKey, updateSelection]
  );

  const clearSelection = useCallback(() => {
    updateSelection([]);
  }, [updateSelection]);

  const isSelected = useCallback((key: SelectionKey) => selectedKeys.includes(key), [selectedKeys]);

  return {
    selectedKeys,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
    hasSelection: selectedKeys.length > 0,
    selectionCount: selectedKeys.length,
    isMaxSelected: maxSelections ? selectedKeys.length >= maxSelections : false
  };
}
