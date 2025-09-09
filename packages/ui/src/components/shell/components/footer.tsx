import { cn } from '@acme/ui/lib/utils';
import type React from 'react';

export type FooterProps = {
  children: React.ReactNode;
  className?: string;
};

/* Shell.Footer ─ rendered sticky at the very bottom by Shell */
const Footer: React.FC<FooterProps> = ({ children, className = '' }) => (
  <div
    className={cn(
      'sticky bottom-0 z-10 w-full border-t bg-background px-2 py-3 md:px-4',
      className
    )}
  >
    {children}
  </div>
);

export default Footer;
