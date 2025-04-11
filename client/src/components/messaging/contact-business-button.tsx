import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ContactBusinessButtonProps {
  business: {
    id: number;
    ownerId: number;
    name: string;
  };
  currentUser?: {
    id: number;
  } | null;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function ContactBusinessButton({
  business,
  currentUser,
  variant = 'default',
  size = 'default',
  className,
}: ContactBusinessButtonProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => {
      return apiRequest('POST', '/api/messages', {
        receiverId: business.ownerId,
        businessId: business.id,
        content,
      });
    },
    onSuccess: () => {
      setIsOpen(false);
      toast({
        title: 'Message Sent',
        description: `Your message has been sent to ${business.name}.`,
      });
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessageMutation.mutate(message);
    }
  };

  const handleOpen = () => {
    if (!currentUser) {
      toast({
        title: 'Login Required',
        description: 'Please log in to send messages to businesses.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }
    setIsOpen(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={className}
          onClick={handleOpen}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Contact Business
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Message to {business.name}</DialogTitle>
          <DialogDescription>
            Send a message to inquire about services, bookings, or ask questions. The business owner will respond to your message.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSendMessage}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[120px]"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={sendMessageMutation.isPending || !message.trim()}
            >
              {sendMessageMutation.isPending ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                  Sending...
                </>
              ) : 'Send Message'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}