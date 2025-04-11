import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import BusinessCard from "@/components/business/business-card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function RecentlyAdded() {
  const { data: businesses, isLoading, error } = useQuery({
    queryKey: ['/api/businesses/recent'],
  });
  
  if (isLoading) {
    return (
      <section className="py-6 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-neutral-900">Recently Added</h2>
            <Link href="/recent" className="text-primary font-medium text-sm hover:underline">
              View All
            </Link>
          </div>
          
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </div>
      </section>
    );
  }
  
  if (error || !businesses || businesses.length === 0) {
    return (
      <section className="py-6 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-neutral-900">Recently Added</h2>
            <Link href="/recent" className="text-primary font-medium text-sm hover:underline">
              View All
            </Link>
          </div>
          
          <div className="text-center py-8">
            {error ? (
              <>
                <AlertCircle className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Failed to load recent businesses</h3>
                <p className="text-neutral-500 mb-4">Something went wrong. Please try again later.</p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-2">No recently added businesses</h3>
                <p className="text-neutral-500 mb-4">Be the first to list your business on Derra!</p>
                <Button>List Your Business</Button>
              </>
            )}
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-6 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-neutral-900">Recently Added</h2>
          <Link href="/recent" className="text-primary font-medium text-sm hover:underline">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {businesses.map((business: any) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      </div>
    </section>
  );
}
