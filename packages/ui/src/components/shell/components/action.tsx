'use client';

import { useEffect, useId, useRef } from 'react';
import { useShellStore } from '../context';
import type { ActionProps } from '../types';

const ActionComponent: React.FC<ActionProps> = (props) => {
  const addAction = useShellStore((s) => s.addAction);
  const removeAction = useShellStore((s) => s.removeAction);
  const localId = useId();

  // Keep the latest onClick in a ref so the header button always calls the newest handler
  const onClickRef = useRef<ActionProps['onClick']>(props.onClick);
  useEffect(() => {
    onClickRef.current = props.onClick;
  }, [props.onClick]);

  useEffect(() => {
    const id = localId;
    // Only update the store when stable, meaningful props change.
    // Wrap onClick to always use the latest handler from the ref without causing re-renders.
    addAction(id, {
      ...props,
      onClick: props.onClick ? () => onClickRef.current?.() : undefined
    });
    return () => {
      removeAction(id);
    };
    // Intentionally exclude the full props object to avoid re-adding on every parent render.
    // Depend only on stable props that affect rendering/behavior.
  }, [
    addAction,
    removeAction,
    localId,
    props.text,
    props.isDisabled,
    props.href,
    props.className,
    props.variant,
    props.forceMobile,
    props.position,
    props.order
  ]);

  return null; // The action is rendered by the Header, so this component renders nothing
};

ActionComponent.displayName = 'Action';

export default ActionComponent;
