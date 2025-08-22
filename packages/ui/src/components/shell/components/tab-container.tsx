'use client';

import { cn } from '@acme/ui/lib/utils';
import React from 'react';

import type { TabPosition } from '../types';
import Tab from './tab'; // <- per riconoscere il tipo Tab

/**
 * Visualizza le tab registrate per la posizione indicata.
 * - `side`: orizzontale su mobile, verticale su desktop
 * - `top` : sempre orizzontale
 */
const TabContainer: React.FC<{
  children?: React.ReactNode;
  position?: TabPosition;
  className?: string;
}> = ({ children, position = 'top', className }) => {
  /* --------------------------------------------------------------------- */
  /* 1.  Cloniamo i children <Shell.Tab> aggiungendo la prop `position`     */
  /*     se non è già presente.                                             */
  /* --------------------------------------------------------------------- */
  const mountedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === Tab) {
      // Se il Tab non specifica una posizione, usiamo quella del container
      //@ts-expect-error
      if (child.props.position === undefined) {
        //@ts-expect-error
        return React.cloneElement(child, { position });
      }
    }
    return child;
  });

  return (
    <div
      className={cn(
        'w-full gap-2 overflow-x-auto px-2 sm:px-4 md:px-4',
        {
          'flex md:flex-col md:overflow-y-auto': position === 'side',
          flex: position === 'top'
        },
        className
      )}
    >
      {mountedChildren}
    </div>
  );
};

export default TabContainer;
