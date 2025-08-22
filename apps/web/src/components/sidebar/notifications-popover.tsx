'use client';

import type { notifications } from '@acme/db/src/schema/notifications';
import { Badge } from '@acme/ui/components/badge';
import { Button } from '@acme/ui/components/button';
import { Popover, PopoverContent, PopoverTrigger } from '@acme/ui/components/popover';
import { ScrollArea } from '@acme/ui/components/scroll-area';
import { Separator } from '@acme/ui/components/separator';
import { cn } from '@acme/ui/lib/utils';
import { Bell, Check, Loader2, MessageSquare, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/trpc/react';

type Notification = typeof notifications.$inferSelect & {
  metadata: Record<string, unknown> | null;
};

interface NotificationsPopoverProps {
  className?: string;
  trigger?: (unreadCount: number) => React.ReactNode;
}

export function NotificationsPopover({ className, trigger }: NotificationsPopoverProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications
  const {
    data: notifications,
    isLoading,
    refetch
  } = api.notifications.list.all.useQuery(
    { isRead: false, limit: 10 },
    {
      refetchInterval: 30000, // Refetch every 30 seconds
      refetchOnWindowFocus: true
    }
  );

  // Mark notifications as read mutation
  const markReadMutation = api.notifications.markRead.batch.useMutation({
    onSuccess: () => {
      refetch();
      toast.success('Notifications marked as read');
    },
    onError: (error) => {
      toast.error(`Failed to mark notifications as read: ${error.message}`);
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

  const getSeverityColor = (severity?: string | null) => {
    switch (severity?.toLowerCase()) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'secondary';
      case 'success':
        return 'default';
      default:
        return 'outline';
    }
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

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
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
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 pb-2">
          <h4 className="font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              disabled={markReadMutation.isPending}
              className="h-auto p-1 text-xs"
            >
              {markReadMutation.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Check className="h-3 w-3" />
              )}
              Mark all read
            </Button>
          )}
        </div>
        <Separator />
        <ScrollArea className="h-80">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : notifications && notifications.length > 0 ? (
            <div className="p-2">
              {notifications.map((notification: Notification) => (
                <button
                  type="button"
                  key={notification.id}
                  className={cn(
                    'group relative cursor-pointer rounded-lg p-3 transition-colors hover:bg-accent',
                    !notification.isRead && 'bg-accent/50'
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium leading-tight">{notification.title}</p>
                        <Badge
                          variant={getSeverityColor(notification.severity) as any}
                          className="flex-shrink-0 text-xs"
                        >
                          {notification.severity || 'info'}
                        </Badge>
                      </div>
                      {notification.body && (
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                          {notification.body}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-muted-foreground">
                        {formatTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                  {!notification.isRead && (
                    <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No notifications</p>
              <p className="text-xs text-muted-foreground mt-1">You're all caught up!</p>
            </div>
          )}
        </ScrollArea>
        <Separator />
        <div className="p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-xs"
            onClick={() => {
              setOpen(false);
              router.push('/settings/notifications');
            }}
          >
            <Settings className="mr-2 h-3 w-3" />
            Notification settings
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
