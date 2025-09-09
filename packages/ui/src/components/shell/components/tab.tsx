'use client';

import PulsingDot from '@acme/ui/components/pulsing-dot';
import { cn } from '@acme/ui/lib/utils';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React, { useCallback, useMemo } from 'react';
import type { TabItemProps } from '../types';

/**
 * Shell Tab component
 */
const Tab: React.FC<TabItemProps> = ({
  title,
  description,
  icon,
  onClick,
  href,
  isActive = false,
  position = 'side', // Default position is side
  showIndicator = false,
  indicatorText,
  indicatorColor = 'primary',
  indicatorSize = 'sm'
}) => {
  // Wrapper per l'evento onClick che gestisce sia la navigazione che il callback
  // Utilizziamo useCallback per evitare ricreazioni ad ogni render
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      // Se c'è un handler onClick, lo chiamiamo
      if (onClick) {
        // Preveniamo il comportamento predefinito solo se non c'è un href
        if (!href) {
          e.preventDefault();
        }
        onClick();
      }
    },
    [onClick, href]
  );

  const isTop = position === 'top';

  const tabContent = useMemo(
    () => (
      <button
        type="button"
        className={cn(
          /* ---------- mobile first ---------- */
          'flex cursor-pointer items-center gap-1 rounded-xl border text-sm shadow-sm',
          isTop
            ? 'justify-center px-3 py-2 w-full' // desktop grid gestisce la larghezza
            : 'justify-start min-w-fit px-3 py-1',
          isActive
            ? 'bg-accent text-accent-foreground border-accent'
            : 'bg-muted/20 text-foreground/80 hover:bg-muted/30 border-border',
          'transition-colors duration-150',
          /* ---------- desktop overrides ---------- */
          'md:flex md:items-center md:rounded-xl',
          isTop
            ? 'md:w-full md:px-3 md:py-2 md:justify-center'
            : 'md:w-full md:px-4 md:py-2 md:justify-start',
          isActive
            ? 'md:bg-accent/30 md:text-accent-foreground md:border-accent'
            : 'md:text-foreground md:opacity-70 md:hover:bg-muted/10 md:hover:opacity-90 md:border-border'
        )}
        onClick={handleClick}
        onKeyUp={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleClick(e as any);
        }}
      >
        {/* Icon container */}
        {icon && (
          <div
            className={cn(
              'flex-shrink-0',
              'mr-2 mt-0 md:mr-3 md:mt-0.5',
              isActive ? 'text-primary' : 'text-muted-foreground/90',
              showIndicator && 'hidden md:block'
            )}
          >
            {React.isValidElement(icon)
              ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
                  className: cn('h-5 w-5', isActive ? 'text-foreground' : 'text-muted-foreground')
                })
              : typeof icon === 'function'
                ? React.createElement(icon, {
                    size: 24,
                    className: isActive ? 'text-foreground' : 'text-muted-foreground'
                  })
                : icon}
          </div>
        )}

        {/* Text content with optional indicator */}
        <div className={cn('flex min-w-0 flex-grow flex-col items-start text-left')}>
          <div className="flex w-full items-center gap-2 min-w-0">
            <span
              className={cn(
                'font-medium truncate text-left', // <- troncamento testo lungo
                isActive ? 'text-foreground' : 'text-foreground/80'
              )}
            >
              {title}
            </span>
            {showIndicator && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <PulsingDot size={indicatorSize} color={indicatorColor} />
                {indicatorText && (
                  <span
                    className={cn(
                      'hidden md:inline text-xs',
                      isActive ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {indicatorText}
                  </span>
                )}
              </div>
            )}
          </div>
          {description && (
            <span
              className={cn(
                'mt-0.5 line-clamp-2 hidden break-words pr-2 text-xs md:block text-left',
                isActive ? 'text-muted-foreground' : 'text-muted-foreground/70'
              )}
            >
              {description}
            </span>
          )}
        </div>

        {/* Chevron */}
        {isActive && (
          <div className="ml-auto hidden items-center self-center pl-2 md:flex">
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
      </button>
    ),
    [
      title,
      description,
      icon,
      isActive,
      handleClick,
      isTop,
      showIndicator,
      indicatorText,
      indicatorColor,
      indicatorSize
    ]
  );

  // Crea il contenuto completo della tab, con il Link se necessario
  const finalTabContent = useMemo(() => {
    if (href) {
      return (
        <Link href={href} onClick={handleClick}>
          {tabContent}
        </Link>
      );
    }
    return tabContent;
  }, [href, tabContent, handleClick]);

  return finalTabContent;
};

export default Tab;
