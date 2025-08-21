'use client';

import type { ReactNode } from 'react';
import { create } from 'zustand';
import type { ActionProps } from '../types';

/* -------------------------------------------------------------------------- */
/*                                  Types                                     */
/* -------------------------------------------------------------------------- */

interface ActionEntry {
  id: string;
  props: ActionProps;
  insertionIndex: number;
}

interface ShellState {
  actions: ActionEntry[];
  addAction: (id: string, props: ActionProps) => void;
  removeAction: (id: string) => void;
  clearActions: () => void;
}

/* -------------------------------------------------------------------------- */
/*                                 Store                                      */
/* -------------------------------------------------------------------------- */

let insertionCounter = 0;

export const useShellStore = create<ShellState>((set) => ({
  actions: [],
  addAction: (id, props) =>
    set((state) => {
      const existingIndex = state.actions.findIndex((a) => a.id === id);
      const entry: ActionEntry = {
        id,
        props,
        insertionIndex:
          existingIndex >= 0 ? state.actions[existingIndex].insertionIndex : insertionCounter++
      };

      if (existingIndex >= 0) {
        const next = state.actions.slice();
        next[existingIndex] = entry;
        return { actions: next };
      }

      return { actions: [...state.actions, entry] };
    }),
  removeAction: (id) => set((state) => ({ actions: state.actions.filter((a) => a.id !== id) })),
  clearActions: () => set({ actions: [] })
}));

/* -------------------------------------------------------------------------- */
/*                              Selectors/Utils                               */
/* -------------------------------------------------------------------------- */

export const selectOrderedActions = (state: ShellState) => {
  const ordered = state.actions
    .slice()
    .sort((a, b) => {
      const posA = a.props.position ?? a.props.order;
      const posB = b.props.position ?? b.props.order;
      if (typeof posA === 'number' && typeof posB === 'number') return posA - posB;
      if (typeof posA === 'number') return -1;
      if (typeof posB === 'number') return 1;
      return a.insertionIndex - b.insertionIndex;
    })
    .map((e) => e.props);
  return ordered;
};

/* -------------------------------------------------------------------------- */
/*                          Compatibility ShellProvider                        */
/* -------------------------------------------------------------------------- */

export const ShellProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};
