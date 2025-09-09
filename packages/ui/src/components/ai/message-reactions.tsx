import { Button } from '@acme/ui/components/button';
import { cn } from '@acme/ui/lib/utils';
import { PlusIcon } from 'lucide-react';
import type { ComponentProps, HTMLAttributes } from 'react';

export type Reaction = {
  emoji: string;
  count: number;
  isActive?: boolean;
  users?: string[];
};

export type MessageReactionsProps = HTMLAttributes<HTMLDivElement> & {
  reactions?: Reaction[];
  onReactionClick?: (emoji: string) => void;
  onAddReaction?: () => void;
};

export const MessageReactions = ({
  reactions = [],
  onReactionClick,
  onAddReaction,
  className,
  ...props
}: MessageReactionsProps) => {
  if (reactions.length === 0 && !onAddReaction) return null;

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-1 mt-1',
        'group-[.is-user]:justify-end',
        className
      )}
      {...props}
    >
      {reactions.map((reaction, index) => (
        <ReactionButton
          key={`${reaction.emoji}-${index}`}
          reaction={reaction}
          onClick={() => onReactionClick?.(reaction.emoji)}
        />
      ))}
      {onAddReaction && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddReaction}
          className={cn(
            'h-6 px-2 py-0.5 rounded-full',
            'text-muted-foreground hover:text-foreground',
            'hover:bg-muted/50 border border-transparent',
            'hover:border-border/50'
          )}
        >
          <PlusIcon className="size-3" />
        </Button>
      )}
    </div>
  );
};

export type ReactionButtonProps = ComponentProps<typeof Button> & {
  reaction: Reaction;
};

export const ReactionButton = ({ reaction, className, ...props }: ReactionButtonProps) => (
  <Button
    variant="ghost"
    size="sm"
    className={cn(
      'h-6 px-2 py-0.5 rounded-full gap-1',
      'text-xs font-medium',
      'hover:bg-muted/50 border',
      reaction.isActive
        ? 'bg-primary/10 border-primary/50 text-primary hover:bg-primary/20'
        : 'bg-muted/30 border-border/50 hover:border-border',
      className
    )}
    {...props}
  >
    <span className="text-sm">{reaction.emoji}</span>
    <span>{reaction.count}</span>
  </Button>
);

export type QuickReactionsProps = HTMLAttributes<HTMLDivElement> & {
  emojis?: string[];
  onEmojiClick?: (emoji: string) => void;
};

export const QuickReactions = ({
  emojis = ['👍', '❤️', '😊', '🎉', '🤔', '👀'],
  onEmojiClick,
  className,
  ...props
}: QuickReactionsProps) => (
  <div
    className={cn(
      'absolute -top-8 right-0',
      'flex items-center gap-0.5 px-1 py-0.5',
      'bg-background/95 backdrop-blur-sm',
      'rounded-lg shadow-lg border',
      'opacity-0 group-hover:opacity-100',
      'transition-opacity duration-200',
      'pointer-events-none group-hover:pointer-events-auto',
      className
    )}
    {...props}
  >
    {emojis.map((emoji) => (
      <Button
        key={emoji}
        variant="ghost"
        size="sm"
        onClick={() => onEmojiClick?.(emoji)}
        className="size-7 p-0 hover:bg-muted/50 rounded"
      >
        <span className="text-base">{emoji}</span>
      </Button>
    ))}
  </div>
);
