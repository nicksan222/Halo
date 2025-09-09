import classNames from 'classnames';
import React from 'react';

import {
  Action,
  Back,
  Content,
  Description,
  Footer,
  Header,
  Layout,
  Tab,
  TabContainer,
  Title
} from './components';
import type { ShellProps } from './types';
import { extractChildrenNotOfType, extractChildrenOfType } from './utils/ssr';

/* -------------------------------------------------------------------------- */
/*                              Shell component                               */
/* -------------------------------------------------------------------------- */

type ShellComponent = React.FC<ShellProps> & {
  Header: typeof Header;
  Back: typeof Back;
  Title: typeof Title;
  Description: typeof Description;
  Action: typeof Action;
  Tab: typeof Tab;
  TabContainer: typeof TabContainer;
  Content: typeof Content;
  Footer: typeof Footer;
  Layout: typeof Layout;
};

/* ------------------------------ componente base --------------------------- */
const ShellBase: React.FC<ShellProps> = ({ children, className, autoLayout = true }) => {
  return (
    <div className={classNames('relative w-full min-h-[100dvh] flex flex-col', className)}>
      {autoLayout ? (
        // Auto-detect layout and apply grid if needed
        <AutoLayoutWrapper>{children}</AutoLayoutWrapper>
      ) : (
        // Render children as-is
        children
      )}
    </div>
  );
};

/**
 * AutoLayoutWrapper automatically detects if the Shell contains:
 * - A Header
 * - A TabContainer with position="side"
 * - A Content component
 * And if so, applies the proper grid layout automatically
 */
const AutoLayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const headers = extractChildrenOfType(children, Header);
  const tabContainers = extractChildrenOfType(children, TabContainer);
  const contents = extractChildrenOfType(children, Content);
  const footers = extractChildrenOfType(children, Footer);
  const otherChildren = extractChildrenNotOfType(children, Header);
  const remainingChildren = extractChildrenNotOfType(otherChildren, TabContainer);
  const remainingChildren2 = extractChildrenNotOfType(remainingChildren, Content);
  const finalChildren = extractChildrenNotOfType(remainingChildren2, Footer);

  // Find side positioned TabContainer
  const sideTabContainer = tabContainers.find(
    (tab) => React.isValidElement(tab) && tab.props.position === 'side'
  );

  const topTabContainers = tabContainers.filter(
    (tab) => React.isValidElement(tab) && (!tab.props.position || tab.props.position === 'top')
  );

  const content = contents[0]; // Use first content component
  const header = headers[0]; // Use first header component

  // If we have header, side tabs, and content, use automatic layout
  if (header && sideTabContainer && content) {
    return (
      <>
        {header}
        {/* Render any other top-level children */}
        {finalChildren}
        {topTabContainers}

        {/* Grid layout for side tabs and content */}
        <div className="md:grid md:grid-cols-4 flex-1 min-h-0">
          <div className="md:col-span-1">{sideTabContainer}</div>
          <div className="md:col-span-3">{content}</div>
        </div>
        {footers}
      </>
    );
  }

  // If no auto-layout pattern detected, render children normally
  return <>{children}</>;
};

/* -------------------------------------------------------------------------- */
/*                     crea l'oggetto con le sotto-componenti                 */
/* -------------------------------------------------------------------------- */
const Shell = Object.assign(ShellBase, {
  Header,
  Back,
  Title,
  Description,
  Action,
  Tab,
  TabContainer,
  Content,
  Footer,
  Layout
}) as unknown as ShellComponent;

/* -------------------------------------------------------------------------- */
/*                                   export                                   */
/* -------------------------------------------------------------------------- */

export { Header, Back, Title, Description, Action, Tab, TabContainer, Content, Footer, Layout };

export default Shell;
