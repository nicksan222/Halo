import { cn } from '@acme/ui/lib/utils';
import type React from 'react';

export type FooterProps = {
  children: React.ReactNode;
  className?: string;
};

/* Shell.Footer ─ rendered sticky at the very bottom by Shell */
const Footer: React.FC<FooterProps> = ({ children, className = '' }) => (
  <div className={cn('w-full', className)}>{children}</div>
);

export default Footer;
