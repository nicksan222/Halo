'use client';

import { Button } from '@acme/ui/components/button';
import { SidebarTrigger } from '@acme/ui/components/sidebar';
import { cn } from '@acme/ui/lib/utils';
import Link from 'next/link';
import React from 'react';

import { selectOrderedActions, useShellStore } from '../context';
import type { ActionProps, HeaderProps } from '../types';
import Action from './action';
import Back from './back';
import Description from './description';
import Title from './title';

/**
 * Helper to always render Back before Title/Description, regardless of order.
 */
function groupBackTitleDescription(children: React.ReactNode) {
  const childrenArray = React.Children.toArray(children);

  let back: React.ReactNode = null;
  let title: React.ReactNode = null;
  let description: React.ReactNode = null;
  const rest: React.ReactNode[] = [];

  for (const child of childrenArray) {
    if (React.isValidElement(child) && child.type === Back) {
      back = child;
    } else if (React.isValidElement(child) && child.type === Title) {
      title = child;
    } else if (React.isValidElement(child) && child.type === Description) {
      description = child;
    } else {
      rest.push(child);
    }
  }

  const grouped: React.ReactNode[] = [];
  if (back || title || description) {
    grouped.push(
      <div key="back-title-description-group" className="flex items-center gap-2">
        {back}
        <div>
          {title}
          {description}
        </div>
      </div>
    );
  }
  return [...grouped, ...rest];
}

const renderButton = (action: ActionProps, isMobile: boolean, key: number) => {
  const {
    variant = 'default',
    icon,
    text,
    onClick,
    isDisabled,
    href,
    className,
    forceMobile
  } = action;
  const button = (
    <Button
      key={key}
      variant={variant}
      size={isMobile || forceMobile || (icon && !text) ? 'icon' : 'default'}
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        className,
        isMobile || forceMobile ? 'h-12 w-12 rounded-md shadow-md' : 'rounded-md py-5 shadow-md'
      )}
      aria-label={text || 'Action'}
      title={text || 'Action'}
    >
      {isMobile || forceMobile ? (
        icon || <span className="text-xs">{text?.charAt(0) || 'A'}</span>
      ) : icon && text ? (
        <>
          <span className="mr-2">{icon}</span>
          {text}
        </>
      ) : (
        icon || text
      )}
    </Button>
  );
  return href ? <Link href={href}>{button}</Link> : button;
};

/**
 * Shell Header component
 */
const Header: React.FC<HeaderProps> = ({ children, className, showSidebarToggle = false }) => {
  const actions = useShellStore(selectOrderedActions);

  const otherChildren = React.Children.toArray(children).filter((child) => {
    return React.isValidElement(child) && child.type !== Action;
  });

  const groupedChildren = groupBackTitleDescription(otherChildren);
  const orderedActionsForHeader = actions.slice(0, 2);

  return (
    <div
      className={cn(
        'sticky top-0 z-10 flex w-full max-w-full flex-col justify-around overflow-hidden bg-background px-2 py-4 sm:px-4 md:flex-row md:items-center md:px-8',
        className
      )}
    >
      <div className="flex flex-1 flex-wrap items-center overflow-hidden">
        {showSidebarToggle && <SidebarTrigger className="mr-2" />}
        {groupedChildren}
      </div>
      {/* Desktop actions */}
      {orderedActionsForHeader.length > 0 && (
        <div className="hidden md:flex md:items-center md:gap-2">
          {orderedActionsForHeader.map((action, index) => renderButton(action, false, index))}
        </div>
      )}
      {/* Mobile actions */}
      {actions.length > 0 && (
        <div className="fixed bottom-4 right-4 z-20 flex flex-col gap-2 md:hidden">
          {actions.map((action, index) => renderButton(action, true, index))}
        </div>
      )}
    </div>
  );
};

export default Header;
