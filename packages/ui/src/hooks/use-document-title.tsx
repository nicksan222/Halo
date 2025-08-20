"use client";

import * as React from "react";

/**
 * Custom hook to update the document title dynamically
 * @param title The title to set for the document
 */
export function useDocumentTitle(title: string): void {
  React.useEffect(() => {
    document.title = title;
  }, [title]);
}