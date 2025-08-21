import { Avatar, AvatarFallback, AvatarImage } from '@acme/ui/components/avatar';
import { cn } from '@acme/ui/lib/utils';

import type { ListAvatarProps } from './list-types';

export function ListAvatar({
  src,
  firstName,
  lastName,
  initials,
  alt,
  className,
  ...props
}: ListAvatarProps & React.HTMLAttributes<HTMLDivElement>) {
  // If initials are directly provided, use them, otherwise generate from firstName/lastName
  const avatarInitials = initials || `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();

  // Usa dimensioni di fallback solo se l’utente non ne ha fornite.
  const sizeClasses = className ? '' : 'h-10 w-10';

  return (
    <Avatar
      // sostituito "h-12 w-12" con classi fluide
      className={cn(sizeClasses, 'rounded-md', className)}
      {...props}
    >
      {src ? <AvatarImage src={src} alt={alt || avatarInitials} /> : null}
      <AvatarFallback className="rounded-md font-semibold text-white">
        {avatarInitials.slice(0, 2) || alt?.[0]?.toUpperCase() || '?'}
      </AvatarFallback>
    </Avatar>
  );
}

ListAvatar.displayName = 'ListAvatar';

export const ItemAvatar = ListAvatar;

// Utility per il type-guard nei React.Children
export function isListAvatar(child: React.ReactElement): boolean {
  return child.type === ListAvatar;
}
