'use client';

import { Button } from '@acme/ui/components/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useTransitionRouter } from 'next-view-transitions';
import type React from 'react';

import type { BackProps } from '../types';

type BackExtendedProps = BackProps & {
  goBack?: boolean;
};

/**
 * Shell Back button component
 */
const Back: React.FC<BackExtendedProps> = ({ onClick, href, goBack = true }) => {
  const router = useTransitionRouter();

  const handleClick = (_e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick();
    } else if (goBack) {
      router.back();
    }
    // else do nothing (default)
  };

  const content = (
    <Button
      variant="ghost"
      size="sm"
      className="mb-2 p-2 text-muted-foreground hover:text-foreground md:mb-0"
      onClick={handleClick}
    >
      <ChevronLeft className="h-4 w-4" />
    </Button>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};

export default Back;
