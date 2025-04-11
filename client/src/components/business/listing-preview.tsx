import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Star, Heart, Globe, Phone, Calendar, Check } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { formatCurrency } from "@/lib/utils";

interface ListingPreviewProps {
  formData: any;
  onBack: () => void;
  onSubmit: (businessId: number) => void;
}

export default function ListingPreview({
  formData,
  onBack,
  onSubmit,
}: ListingPreviewProps) {
  const { toast } = useToast();
  const auth = useAuth();
  
  // Fetch category information
  const { data: category } = useQuery({
    queryKey: [`/api/categories/${formData.categoryId}`],
    enabled: !!formData.categoryId,
  });
  
  const handleSubmit = async () => {
    try {
      // Add owner ID to the form data
      const submissionData = {
        ...formData,
        ownerId: auth?.user?.id,
      };
      
      // Submit the form data to create a new business
      const response = await apiRequest("POST", "/api/businesses", submissionData);
      const business = await response.json();
      
      // Invalidate the businesses query to refresh the data
      queryClient.invalidateQueries({ queryKey: [`/api/users/${auth?.user?.id}/businesses`] });
      queryClient.invalidateQueries({ queryKey: ['/api/businesses'] });
      
      toast({
        title: "Business created",
        description: "Your business has been created successfully.",
      });
      
      // Notify parent component of successful submission
      onSubmit(business.id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create business. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Tax calculation
  const monthlyFee = 5.00;
  const taxRate = 0.09; // 9% tax
  const tax = monthlyFee * taxRate;
  const total = monthlyFee + tax;
  
  return (
    <div>
      <h2 className="text-xl font-bold text-neutral-900 mb-6">Review Your Business Listing</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preview */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Preview Your Listing</h3>
          
          <Card className="rounded-xl overflow-hidden">
            <div className="relative">
              {formData.image ? (
                <img 
                  src={formData.image} 
                  alt={formData.name} 
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-neutral-400">No Image</span>
                </div>
              )}
              <div className="absolute top-3 right-3 bg-white p-1.5 rounded-full">
                <Heart className="h-5 w-5 text-neutral-400" />
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-neutral-900">{formData.name || "Business Name"}</h3>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium ml-1">New</span>
                </div>
              </div>
              <p className="text-neutral-500 text-sm mt-1 line-clamp-2">
                {formData.description || "Your business description will appear here"}
              </p>
              <div className="flex items-center mt-2 text-xs text-neutral-500">
                <MapPin className="h-3 w-3 mr-1" />
                <span>
                  {formData.city && formData.state 
                    ? `${formData.city}, ${formData.state}` 
                    : "City, State"}
                </span>
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between">
                {formData.website && (
                  <button className="text-primary hover:text-blue-700 transition-all text-sm flex items-center">
                    <Globe className="h-4 w-4 mr-1" />
                    Website
                  </button>
                )}
                
                {formData.phone && (
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
          </Card>
          
          {/* Additional Information */}
          <div className="mt-6">
            <h4 className="font-medium text-neutral-900 mb-2">Category</h4>
            <p className="text-neutral-500 mb-4">
              {category?.name || "Loading category..."}
            </p>
            
            {formData.tags && formData.tags.length > 0 && (
              <>
                <h4 className="font-medium text-neutral-900 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.tags.map((tag: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}
            
            <h4 className="font-medium text-neutral-900 mb-2">Contact Information</h4>
            <div className="space-y-2 text-neutral-500 mb-4">
              {formData.email && <p>{formData.email}</p>}
              {formData.phone && <p>{formData.phone}</p>}
              {formData.website && <p>{formData.website}</p>}
            </div>
          </div>
        </div>
        
        {/* Subscription Details */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Subscription Details</h3>
          
          <Card>
            <div className="p-6">
              <h4 className="font-bold text-neutral-900 mb-3">Listing Subscription</h4>
              <p className="text-neutral-500 text-sm">
                List your business on Derra for just $5/month and reach thousands of potential customers.
              </p>
              
              <ul className="mt-6 space-y-3">
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-green-500/10 flex items-center justify-center mt-0.5">
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                  <span className="ml-3 text-neutral-500">Reach thousands of potential customers</span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-green-500/10 flex items-center justify-center mt-0.5">
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                  <span className="ml-3 text-neutral-500">Featured placement in search results</span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-green-500/10 flex items-center justify-center mt-0.5">
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                  <span className="ml-3 text-neutral-500">Detailed business analytics</span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-green-500/10 flex items-center justify-center mt-0.5">
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                  <span className="ml-3 text-neutral-500">Premium customer support</span>
                </li>
              </ul>
              
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex justify-between mb-2">
                  <span className="text-neutral-500">Monthly listing fee</span>
                  <span className="font-medium">{formatCurrency(monthlyFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Tax</span>
                  <span className="font-medium">{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between mt-2 pt-2 border-t border-gray-100">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">{formatCurrency(total)}/month</span>
                </div>
              </div>
              
              <div className="mt-6 text-sm text-neutral-400">
                <p>
                  By clicking "Create Listing & Pay", you agree to our <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and 
                  authorize Derra to charge your payment method for the amount listed above
                  on a monthly basis until you cancel.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      <div className="flex justify-between mt-8 pt-6 border-t">
        <Button variant="outline" onClick={onBack}>
          Back to Edit
        </Button>
        <Button onClick={handleSubmit}>
          Create Listing & Pay
        </Button>
      </div>
    </div>
  );
}
