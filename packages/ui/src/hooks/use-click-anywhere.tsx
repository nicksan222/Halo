"use client";

import * as React from "react";

// Simple event listener hook for document click events
function useEventListener(eventName: string, handler: (event: MouseEvent) => void) {
  const savedHandler = React.useRef(handler);
  
  React.useEffect(() => { savedHandler.current = handler; }, [handler]);
  
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    
    const eventListener = (event: Event) => savedHandler.current(event as MouseEvent);
    document.addEventListener(eventName, eventListener);
    return () => document.removeEventListener(eventName, eventListener);
  }, [eventName]);
}

/**
 * Custom hook that handles click events anywhere on the document
 * @param handler The function to be called when a click event is detected anywhere on the document
 */
export function useClickAnyWhere(handler: (event: MouseEvent) => void): void {
  useEventListener('click', event => {
    handler(event);
  });
}