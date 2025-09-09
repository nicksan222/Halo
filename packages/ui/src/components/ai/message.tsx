import { Avatar, AvatarFallback, AvatarImage } from '@acme/ui/components/avatar';
import { cn } from '@acme/ui/lib/utils';
import type { UIMessage } from 'ai';
import { CheckCheckIcon, CheckIcon, ClockIcon } from 'lucide-react';
import type { ComponentProps, HTMLAttributes, ReactNode } from 'react';

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  from: UIMessage['role'];
  timestamp?: Date | string;
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'error';
  isGrouped?: boolean;
  showAvatar?: boolean;
};

export const Message = ({
  className,
  from,
  timestamp,
  status = 'sent',
  isGrouped = false,
  showAvatar = true,
  ...props
}: MessageProps) => (
  <div
    className={cn(
      'group relative flex w-full items-start gap-3 px-4',
      from === 'user' ? 'is-user flex-row-reverse' : 'is-assistant',
      '[&>div]:max-w-[70%]',
      isGrouped ? 'py-0.5' : 'py-3',
      !showAvatar && from === 'assistant' && 'pl-14',
      !showAvatar && from === 'user' && 'pr-14',
      className
    )}
    {...props}
  />
);

export type MessageContentProps = HTMLAttributes<HTMLDivElement>;

export const MessageContent = ({ children, className, ...props }: MessageContentProps) => (
  <div
    className={cn(
      'relative px-4 py-2.5 text-sm leading-relaxed break-words',
      'group-[.is-user]:rounded-l-2xl group-[.is-user]:rounded-tr-2xl group-[.is-user]:rounded-br-sm',
      'group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground',
      'group-[.is-assistant]:rounded-r-2xl group-[.is-assistant]:rounded-tl-2xl group-[.is-assistant]:rounded-bl-sm',
      'group-[.is-assistant]:bg-muted/50 group-[.is-assistant]:text-foreground',
      'group-[.is-assistant]:border group-[.is-assistant]:border-border/50',
      'shadow-sm',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export type MessageAvatarProps = ComponentProps<typeof Avatar> & {
  src: string;
  name?: string;
};

export const MessageAvatar = ({ src, name, className, ...props }: MessageAvatarProps) => (
  <Avatar className={cn('size-8 shrink-0 ring-2 ring-background', className)} {...props}>
    <AvatarImage alt="" className="mt-0 mb-0" src={src} />
    <AvatarFallback className="bg-muted text-xs font-semibold">
      {name?.slice(0, 2)?.toUpperCase() || 'AI'}
    </AvatarFallback>
  </Avatar>
);

export type MessageTimestampProps = HTMLAttributes<HTMLSpanElement> & {
  timestamp: Date | string;
};

export const MessageTimestamp = ({ timestamp, className, ...props }: MessageTimestampProps) => {
  const time = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const formatted = time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return (
    <span
      className={cn(
        'text-xs text-muted-foreground select-none',
        'group-[.is-user]:text-primary-foreground/70',
        className
      )}
      {...props}
    >
      {formatted}
    </span>
  );
};

export type MessageStatusProps = HTMLAttributes<HTMLSpanElement> & {
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'error';
};

export const MessageStatus = ({ status, className, ...props }: MessageStatusProps) => {
  let Icon: ReactNode;

  switch (status) {
    case 'sending':
      Icon = <ClockIcon className="size-3" />;
      break;
    case 'sent':
      Icon = <CheckIcon className="size-3" />;
      break;
    case 'delivered':
      Icon = <CheckCheckIcon className="size-3" />;
      break;
    case 'read':
      Icon = <CheckCheckIcon className="size-3 text-primary" />;
      break;
    case 'error':
      Icon = <span className="text-destructive">!</span>;
      break;
    default:
      Icon = null;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center text-muted-foreground',
        'group-[.is-user]:text-primary-foreground/70',
        className
      )}
      {...props}
    >
      {Icon}
    </span>
  );
};

export type MessageMetadataProps = HTMLAttributes<HTMLDivElement>;

export const MessageMetadata = ({ className, children, ...props }: MessageMetadataProps) => (
  <div
    className={cn('flex items-center gap-2 mt-1 px-4', 'group-[.is-user]:justify-end', className)}
    {...props}
  >
    {children}
  </div>
);
