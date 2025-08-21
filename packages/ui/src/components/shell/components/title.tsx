import { cn } from '@acme/ui/lib/utils';
import type React from 'react';

import type { TitleProps } from '../types';

/**
 * Shell Title component
 */
const Title: React.FC<TitleProps> = ({
  children,
  className,
  smallHeading = false,
  hideOnMobile = false
}) => {
  return (
    <h1
      className={cn(
        'm-0 p-0 font-semibold text-foreground', // Remove default padding/margin
        smallHeading ? 'text-xl' : 'text-xl',
        hideOnMobile && 'hidden md:block',
        className
      )}
    >
      {children}
    </h1>
  );
};

export default Title;
