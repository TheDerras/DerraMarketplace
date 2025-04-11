import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Heart, ExternalLink, Phone, Calendar, MapPin, Star, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { getRandomBusinessImage } from "@/lib/utils";

interface BusinessCardProps {
  business: {
    id: number;
    name: string;
    description: string;
    city: string;
    state: string;
    website?: string;
    phone?: string;
    isVerified?: boolean;
    rating?: number;
    likeCount?: number;
    isPaid?: boolean;
    createdAt: string;
    image?: string;
  };
}

export default function BusinessCard({ business }: BusinessCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();
  const auth = useAuth();
  
  // Handle like/unlike business
  const handleLikeToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!auth?.isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to like businesses",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (isLiked) {
        await apiRequest("DELETE", `/api/businesses/${business.id}/like`);
        setIsLiked(false);
      } else {
        await apiRequest("POST", `/api/businesses/${business.id}/like`);
        setIsLiked(true);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  };
  
  // Calculate time since posting
  const getTimeSince = (dateString: string) => {
    const now = new Date();
    const postedDate = new Date(dateString);
    const diffInDays = Math.floor((now.getTime() - postedDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };
  
  return (
    <Card className="rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all">
      <Link href={`/business/${business.id}`}>
        <div className="relative">
          <img 
            src={business.image || getRandomBusinessImage(business.id)} 
            alt={business.name} 
            className="w-full h-48 object-cover"
          />
          <div 
            className="absolute top-3 right-3 bg-white p-1.5 rounded-full cursor-pointer hover:bg-neutral-100 transition-all"
            onClick={handleLikeToggle}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'text-red-500 fill-current' : 'text-neutral-500'}`} />
          </div>
          
          {business.isPaid && (
            <div className="absolute bottom-3 left-3 bg-amber-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
              Featured
            </div>
          )}
          
          {!business.isPaid && new Date(business.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
            <div className="absolute bottom-3 left-3 bg-primary text-white px-2 py-1 rounded-lg text-xs font-medium">
              New
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-neutral-900">{business.name}</h3>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-amber-500 fill-current" />
              <span className="text-sm font-medium ml-1">{business.rating || 'New'}</span>
            </div>
          </div>
          
          <p className="text-neutral-500 text-sm mt-1 line-clamp-2">{business.description}</p>
          
          <div className="flex items-center mt-2 text-xs text-neutral-500">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{business.city}, {business.state}</span>
            
            {business.isVerified && (
              <span className="ml-3 text-green-600 flex items-center">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Verified
              </span>
            )}
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between">
            {business.website && (
              <button className="text-primary hover:text-blue-700 transition-all text-sm flex items-center">
                <ExternalLink className="h-4 w-4 mr-1" />
                Website
              </button>
            )}
            
            {business.phone && (
              <button className="text-primary hover:text-blue-700 transition-all text-sm flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                Call
              </button>
            )}
            
            <button className="text-primary hover:text-blue-700 transition-all text-sm flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Book
            </button>
          </div>
        </div>
      </Link>
    </Card>
  );
}
