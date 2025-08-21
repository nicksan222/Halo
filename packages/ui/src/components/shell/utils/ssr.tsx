import React from 'react';

/**
 * Extracts all children of a specific type from a ReactNode.
 *
 * @param children - The ReactNode to search through.
 * @param type - The component type to extract.
 * @returns An array of React.ReactElement of the specified type.
 */
export function extractChildrenOfType<T>(
  children: React.ReactNode,
  type: React.ComponentType<T>
): React.ReactElement<T>[] {
  const matched: React.ReactElement<T>[] = [];
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === type) {
      matched.push(child as React.ReactElement<T>);
    }
  });
  return matched;
}

/**
 * Extracts all children that are NOT of a specific type.
 *
 * @param children - The ReactNode to search through.
 * @param type - The component type to exclude.
 * @returns An array of ReactNode containing all other children.
 */
export function extractChildrenNotOfType<T>(
  children: React.ReactNode,
  type: React.ComponentType<T>
): React.ReactNode[] {
  const unmatched: React.ReactNode[] = [];
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child) || child.type !== type) {
      unmatched.push(child);
    }
  });
  return unmatched;
}
