'use client';

import { cn } from '@acme/ui/lib/utils';
import React from 'react';

import { extractChildrenNotOfType, extractChildrenOfType } from '../utils/ssr';
import Content from './content';
import TabContainer from './tab-container';

export interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Shell Layout component that automatically handles the grid layout
 * when TabContainer with position="side" and Content are present
 */
const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  // Extract TabContainers and Content from children
  const tabContainers = extractChildrenOfType(children, TabContainer);
  const contents = extractChildrenOfType(children, Content);
  const otherChildren = extractChildrenNotOfType(children, TabContainer);
  const finalOtherChildren = extractChildrenNotOfType(otherChildren, Content);

  // Find side positioned TabContainer
  const sideTabContainer = tabContainers.find(
    (tab) => React.isValidElement(tab) && tab.props.position === 'side'
  );

  const topTabContainers = tabContainers.filter(
    (tab) => React.isValidElement(tab) && (!tab.props.position || tab.props.position === 'top')
  );

  const content = contents[0]; // Use first content component

  // If we have a side tab container and content, use grid layout
  if (sideTabContainer && content) {
    return (
      <div className={cn('w-full', className)}>
        {/* Render other children first (like top tabs) */}
        {finalOtherChildren}
        {topTabContainers}

        {/* Grid layout for side tabs and content */}
        <div className="md:grid md:grid-cols-4">
          <div className="md:col-span-1">{sideTabContainer}</div>
          <div className="md:col-span-3">{content}</div>
        </div>
      </div>
    );
  }

  // If no side tabs, render children normally
  return <div className={cn('w-full', className)}>{children}</div>;
};

export default Layout;
