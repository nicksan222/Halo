'use client';

import { authClient } from '@acme/auth/client';
import type { notifications } from '@acme/db/src/schema/notifications';
import { Badge } from '@acme/ui/components/badge';
import { Button } from '@acme/ui/components/button';
import { Popover, PopoverContent, PopoverTrigger } from '@acme/ui/components/popover';
import { ScrollArea } from '@acme/ui/components/scroll-area';
import { Separator } from '@acme/ui/components/separator';
import { Skeleton } from '@acme/ui/components/skeleton';
import { cn } from '@acme/ui/lib/utils';
import { Bell, Check, Loader2, MessageSquare, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/trpc/react';

type Notification = typeof notifications.$inferSelect & {
  metadata: Record<string, unknown> | null;
};

interface NotificationsPopoverLabels {
  markAllRead?: string;
  noNotifications?: string;
  noNotificationsDescription?: string;
  notificationSettings?: string;
  markReadSuccess?: string;
  markReadError?: string;
  justNow?: string;
  minutesAgo?: string;
  hoursAgo?: string;
  daysAgo?: string;
}

interface NotificationsPopoverProps {
  className?: string;
  trigger?: (unreadCount: number) => React.ReactNode;
  labels?: NotificationsPopoverLabels;
}

export function NotificationsPopover({ className, trigger, labels }: NotificationsPopoverProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { data: session } = authClient.useSession();

  // Fetch notifications
  const {
    data: notifications,
    isLoading,
    refetch
  } = api.notifications.list.all.useQuery(
    { isRead: false, limit: 10 },
    {
      refetchOnWindowFocus: true
    }
  );

  // Subscribe to live notifications over SSE and refresh list on new events
  api.notifications.subscribe.onNotification.useSubscription(
    { userId: session?.user.id },
    {
      enabled: !!session?.user.id,
      onData: () => {
        void refetch();
      },
      onError: (error) => {
        console.error('Notification subscription error', error);
      }
    }
  );

  // Mark notifications as read mutation
  const markReadMutation = api.notifications.markRead.batch.useMutation({
    onSuccess: () => {
      refetch();
      toast.success(labels?.markReadSuccess ?? 'Notifications marked as read');
    },
    onError: (error) => {
      toast.error(
        labels?.markReadError ?? `Failed to mark notifications as read: ${error.message}`
      );
    }
  });

  // Update unread count when notifications change
  useEffect(() => {
    if (notifications) {
      setUnreadCount(notifications.length);
    }
  }, [notifications]);

  const handleMarkAllRead = () => {
    if (notifications && notifications.length > 0) {
      const latestId = notifications[0].id; // First notification is the latest due to desc order
      markReadMutation.mutate({ latestReadId: latestId });
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark this specific notification as read
    markReadMutation.mutate({ latestReadId: notification.id });

    // Navigate if specified
    if (notification.navigateTo) {
      router.push(notification.navigateTo);
    }

    setOpen(false);
  };

  const getNotificationIcon = (type?: string | null) => {
    switch (type?.toLowerCase()) {
      case 'message':
        return <MessageSquare className="h-4 w-4" />;
      case 'system':
        return <Settings className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return labels?.justNow ?? 'Just now';
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)}${labels?.minutesAgo ?? 'm ago'}`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}${labels?.hoursAgo ?? 'h ago'}`;
    return `${Math.floor(diffInSeconds / 86400)}${labels?.daysAgo ?? 'd ago'}`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger ? (
          trigger(unreadCount)
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className={cn('relative', className)}
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex min-w-4 items-center justify-center rounded-full bg-primary px-1 h-3 text-[9px] text-primary-foreground">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="end">
        <div className="flex items-center justify-between p-3 pb-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium">Notifications</h4>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-[10px]">
                {unreadCount > 99 ? '99+' : unreadCount} new
              </Badge>
            )}
          </div>
        </div>
        <Separator />
        <ScrollArea className="h-64">
          {isLoading ? (
            <div className="p-2 space-y-2">
              {Array.from({ length: 5 }).map((_, _i) => (
                <div key={Date.now()} className="flex items-start gap-2 rounded-lg border p-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-3 w-5/6" />
                  </div>
                  <Skeleton className="h-3 w-10" />
                </div>
              ))}
            </div>
          ) : notifications && notifications.length > 0 ? (
            <div className="p-2 space-y-2">
              {(notifications ?? []).map((notification: Notification) => (
                <button
                  type="button"
                  key={notification.id}
                  className={cn(
                    'group relative w-full text-left rounded-lg border p-2 transition-colors hover:bg-accent/40',
                    !notification.isRead && 'bg-accent/50'
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={cn(
                        'flex h-6 w-6 items-center justify-center rounded-full',
                        notification.type === 'message'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-medium leading-tight">{notification.title}</p>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                      </div>
                      {notification.body && (
                        <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">
                          {notification.body}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <Bell className="h-6 w-6 text-muted-foreground mb-1.5" />
              <p className="text-xs text-muted-foreground">
                {labels?.noNotifications ?? 'No notifications'}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                {labels?.noNotificationsDescription ??
                  "You're all caught up. We'll let you know when there's something new."}
              </p>
            </div>
          )}
        </ScrollArea>
        {unreadCount > 0 && (
          <>
            <Separator />
            <div className="p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllRead}
                disabled={markReadMutation.isPending}
                className="w-full justify-start text-xs"
              >
                {markReadMutation.isPending ? (
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                ) : (
                  <Check className="mr-2 h-3 w-3" />
                )}
                {labels?.markAllRead ?? 'Mark all read'}
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
