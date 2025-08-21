import { List } from 'lucide-react';
import type React from 'react';
import type { ReactNode } from 'react';
import { cn } from '../lib/utils';
import { Button } from './button';

export interface EmptyScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ElementType;
  customIcon?: React.ReactElement;
  avatar?: React.ReactElement;
  headline: string | React.ReactElement;
  description?: string | React.ReactElement;
  buttonText?: string;
  buttonOnClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  buttonRaw?: ReactNode;
  border?: boolean;
  dashedBorder?: boolean;
  iconWrapperClassName?: string;
  iconClassName?: string;
  limitWidth?: boolean;
}

export function EmptyScreen({
  icon: Icon,
  customIcon,
  avatar,
  headline,
  description,
  buttonText,
  buttonOnClick,
  buttonRaw,
  border = true,
  dashedBorder = true,
  className,
  iconClassName,
  iconWrapperClassName,
  limitWidth = true,
  ...props
}: EmptyScreenProps) {
  const renderIcon = () => {
    return (
      <div className={cn('', iconWrapperClassName)}>
        {(Icon && (
          <Icon size={24} strokeWidth={2} className={cn('h-10 w-10', iconClassName)} />
        )) ?? <List size={24} strokeWidth={2} className="h-10 w-10" />}
      </div>
    );
  };

  return (
    <div
      data-testid="empty-screen"
      className={cn(
        'flex h-80 w-full select-none flex-col items-center justify-center gap-4 rounded-2xl p-4 lg:p-12',
        'border border-dashed', // always show dotted border
        className
      )}
      {...props}
    >
      {avatar && <div className="">{avatar}</div>}

      {renderIcon()}
      {customIcon}

      <div className="flex flex-col">
        <h2 className={cn('text-center text-lg font-bold')}>{headline}</h2>
        {description && <p className="text-center text-xs font-light">{description}</p>}
        {buttonOnClick && buttonText && <Button onClick={buttonOnClick}>{buttonText}</Button>}
        {buttonRaw}
      </div>
    </div>
  );
}
