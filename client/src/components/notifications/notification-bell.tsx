import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { apiRequest } from '@/lib/queryClient';
import { cn } from '@/lib/utils';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Notification {
  id: number;
  type: string;
  content: string;
  relatedId: number | null;
  isRead: boolean;
  createdAt: string;
}

export function NotificationBell() {
  const [, navigate] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Query to fetch unread notification count
  const { data: unreadCountData } = useQuery({
    queryKey: ['/api/notifications/unread-count'],
    queryFn: () => apiRequest('GET', '/api/notifications/unread-count'),
    refetchInterval: 60000, // Refetch every minute
  });

  // Query to fetch notifications when dropdown is opened
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['/api/notifications'],
    queryFn: () => apiRequest('GET', '/api/notifications'),
    enabled: isOpen, // Only fetch when dropdown is open
  });

  // Handle marking all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await apiRequest('PATCH', '/api/notifications/mark-all-read');
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  };

  // Handle clicking on a notification
  const handleNotificationClick = async (notification: Notification) => {
    try {
      // Mark notification as read
      if (!notification.isRead) {
        await apiRequest('PATCH', `/api/notifications/${notification.id}/read`);
      }

      // Navigate based on notification type
      if (notification.type === 'message' && notification.relatedId) {
        navigate('/messages');
      } else if (notification.type === 'like' && notification.relatedId) {
        navigate(`/business/${notification.relatedId}`);
      } else if (notification.type === 'comment' && notification.relatedId) {
        navigate(`/business/${notification.relatedId}`);
      } else if (notification.type === 'subscription' && notification.relatedId) {
        navigate(`/business/${notification.relatedId}`);
      }

      // Close dropdown
      setIsOpen(false);
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  };

  const unreadCount = unreadCountData?.count || 0;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-[10px]"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 flex justify-center">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <p>No notifications</p>
            </div>
          ) : (
            <DropdownMenuGroup>
              {notifications.map((notification: Notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    "cursor-pointer p-3 hover:bg-accent flex flex-col items-start gap-1",
                    !notification.isRead && "bg-accent/40"
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className={cn("font-medium text-sm", !notification.isRead && "font-semibold")}>
                    {notification.content}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          )}
        </div>

        <DropdownMenuSeparator />
        <div className="text-xs text-center text-muted-foreground p-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-xs" 
            onClick={() => {
              navigate('/profile?tab=preferences');
              setIsOpen(false);
            }}
          >
            Notification Preferences
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}