import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, AlertCircle } from "lucide-react";
import { formatDate, getRandomOwnerAvatar } from "@/lib/utils";

interface BusinessCommentsProps {
  businessId: number;
}

export default function BusinessComments({ businessId }: BusinessCommentsProps) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const { toast } = useToast();
  const auth = useAuth();
  
  // Fetch comments
  const { data: comments, isLoading, error } = useQuery({
    queryKey: [`/api/businesses/${businessId}/comments`],
  });
  
  // Post comment mutation
  const postComment = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/businesses/${businessId}/comments`, {
        content: comment,
        rating,
      });
      return response.json();
    },
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries({ queryKey: [`/api/businesses/${businessId}/comments`] });
      queryClient.invalidateQueries({ queryKey: [`/api/businesses/${businessId}`] });
      
      toast({
        title: "Comment posted",
        description: "Your review has been posted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to post your review. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Handle comment submission
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auth?.isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to post a review",
        variant: "destructive",
      });
      return;
    }
    
    if (!comment.trim()) {
      toast({
        title: "Review content required",
        description: "Please enter a review before submitting",
        variant: "destructive",
      });
      return;
    }
    
    postComment.mutate();
  };
  
  // Fetch user data for each comment
  const { data: users } = useQuery({
    queryKey: ['/api/users'],
    enabled: !!comments && comments.length > 0,
  });
  
  // Get username for a comment
  const getUsernameById = (userId: number) => {
    if (!users) return "Anonymous";
    const user = users.find((u: any) => u.id === userId);
    return user ? user.username : "Anonymous";
  };
  
  // Get avatar for a user
  const getAvatarForUser = (userId: number) => {
    return getRandomOwnerAvatar(userId);
  };
  
  if (isLoading) {
    return (
      <div className="py-4 flex justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="pt-6 text-center py-8">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to Load Reviews</h3>
          <p className="text-neutral-500">
            There was an error loading the reviews. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div>
      {/* Add review form */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
          <form onSubmit={handleSubmitComment}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star 
                      className={`h-6 w-6 ${star <= rating ? 'text-amber-500 fill-current' : 'text-gray-300'}`} 
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this business..."
              rows={4}
              className="mb-4"
            />
            
            <Button 
              type="submit" 
              disabled={postComment.isPending}
              className="w-full"
            >
              {postComment.isPending ? "Posting..." : "Post Review"}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Reviews list */}
      {comments?.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-8">
            <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
            <p className="text-neutral-500">
              Be the first to review this business!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {comments?.map((comment: any) => (
            <Card key={comment.id}>
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarImage src={getAvatarForUser(comment.userId)} alt={getUsernameById(comment.userId)} />
                    <AvatarFallback>{getUsernameById(comment.userId).substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-semibold">{getUsernameById(comment.userId)}</h4>
                      <span className="text-xs text-neutral-500">{formatDate(comment.createdAt)}</span>
                    </div>
                    
                    {comment.rating && (
                      <div className="flex mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            className={`h-4 w-4 ${star <= comment.rating ? 'text-amber-500 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    )}
                    
                    <p className="text-neutral-700">{comment.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
