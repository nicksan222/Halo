'use client';

import { useEffect, useId } from 'react';
import { useShellStore } from '../context';
import type { ActionProps } from '../types';

const ActionComponent: React.FC<ActionProps> = (props) => {
  const addAction = useShellStore((s) => s.addAction);
  const removeAction = useShellStore((s) => s.removeAction);
  const localId = useId();

  useEffect(() => {
    const id = localId;
    addAction(id, props);
    return () => {
      removeAction(id);
    };
  }, [addAction, removeAction, localId, props]);

  return null; // The action is rendered by the Header, so this component renders nothing
};

ActionComponent.displayName = 'Action';

export default ActionComponent;
