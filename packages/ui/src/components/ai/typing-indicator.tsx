import { cn } from '@acme/ui/lib/utils';
import type { HTMLAttributes } from 'react';

export type TypingIndicatorProps = HTMLAttributes<HTMLDivElement> & {
  label?: string;
};

export const TypingIndicator = ({
  className,
  label = 'AI is typing',
  ...props
}: TypingIndicatorProps) => (
  <div className={cn('flex items-center gap-3 px-4 py-2', className)} {...props}>
    <div className="flex items-center gap-2">
      <div className="size-8 rounded-full bg-muted flex items-center justify-center">
        <span className="text-xs font-semibold">AI</span>
      </div>
      <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-muted/50 border border-border/50">
        <span className="sr-only">{label}</span>
        <span className="size-2 rounded-full bg-muted-foreground/40 animate-pulse [animation-delay:0ms]" />
        <span className="size-2 rounded-full bg-muted-foreground/40 animate-pulse [animation-delay:150ms]" />
        <span className="size-2 rounded-full bg-muted-foreground/40 animate-pulse [animation-delay:300ms]" />
      </div>
    </div>
  </div>
);

export type TypingIndicatorDotsProps = HTMLAttributes<HTMLDivElement>;

export const TypingIndicatorDots = ({ className, ...props }: TypingIndicatorDotsProps) => (
  <div className={cn('inline-flex items-center gap-1', className)} {...props}>
    <span className="size-1.5 rounded-full bg-current opacity-40 animate-pulse [animation-delay:0ms]" />
    <span className="size-1.5 rounded-full bg-current opacity-40 animate-pulse [animation-delay:150ms]" />
    <span className="size-1.5 rounded-full bg-current opacity-40 animate-pulse [animation-delay:300ms]" />
  </div>
);
