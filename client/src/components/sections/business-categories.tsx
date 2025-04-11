import { useQuery } from "@tanstack/react-query";
import CategoryCard from "@/components/business/category-card";
import { AlertCircle } from "lucide-react";

export default function BusinessCategories() {
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['/api/categories'],
  });
  
  if (isLoading) {
    return (
      <section className="py-8 bg-neutral-100">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">Explore Business Categories</h2>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </div>
      </section>
    );
  }
  
  if (error || !categories || categories.length === 0) {
    return (
      <section className="py-8 bg-neutral-100">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">Explore Business Categories</h2>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {error ? "Failed to load categories" : "No categories available"}
            </h3>
            <p className="text-neutral-500">
              {error ? "Something went wrong. Please try again later." : "Check back soon for business categories."}
            </p>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-8 bg-neutral-100">
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-bold text-neutral-900 mb-6">Explore Business Categories</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category: any, index: number) => (
            <CategoryCard 
              key={category.id}
              id={category.id}
              name={category.name}
              icon={category.icon}
              businessCount={category.businessCount}
              colorIndex={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
