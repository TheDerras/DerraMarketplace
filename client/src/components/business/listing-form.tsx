import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

const businessFormSchema = z.object({
  name: z.string().min(2, {
    message: "Business name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }).max(500, {
    message: "Description must not exceed 500 characters."
  }),
  categoryId: z.coerce.number().min(1, {
    message: "Please select a category.",
  }),
  city: z.string().min(2, {
    message: "City is required.",
  }),
  state: z.string().min(2, {
    message: "State is required.",
  }),
  isRestaurant: z.boolean().default(false),
  phone: z.string().optional(),
  website: z.string().url({
    message: "Please enter a valid URL.",
  }).optional().or(z.literal("")),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }).optional().or(z.literal("")),
  tags: z.array(z.string()).optional(),
  image: z.string().optional(),
});

interface ListingFormProps {
  formData: any;
  onUpdateFormData: (data: any) => void;
  onNext: () => void;
}

export default function ListingForm({
  formData,
  onUpdateFormData,
  onNext,
}: ListingFormProps) {
  const { toast } = useToast();
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(formData.tags || []);
  
  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<any[]>({
    queryKey: ['/api/categories'],
  });
  
  const form = useForm<z.infer<typeof businessFormSchema>>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      name: formData.name || "",
      description: formData.description || "",
      categoryId: formData.categoryId || undefined,
      city: formData.city || "",
      state: formData.state || "",
      isRestaurant: formData.isRestaurant || false,
      phone: formData.phone || "",
      website: formData.website || "",
      email: formData.email || "",
      tags: formData.tags || [],
      image: formData.image || "",
    },
  });
  
  // Update parent component's formData when form values change
  useEffect(() => {
    const subscription = form.watch((value) => {
      onUpdateFormData({ ...value, tags });
    });
    return () => subscription.unsubscribe();
  }, [form, onUpdateFormData, tags]);
  
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      form.setValue("tags", newTags);
      setTagInput("");
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    form.setValue("tags", newTags);
  };
  
  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };
  
  const onSubmit = (data: z.infer<typeof businessFormSchema>) => {
    onUpdateFormData({ ...data, tags });
    onNext();
  };
  
  // Image upload functionality
  const handleImageUpload = () => {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    
    // Handle file selection
    fileInput.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      
      if (file) {
        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: "Please select an image smaller than 5MB.",
            variant: "destructive"
          });
          return;
        }
        
        // Create object URL
        const imageUrl = URL.createObjectURL(file);
        form.setValue("image", imageUrl);
        onUpdateFormData({ ...form.getValues(), image: imageUrl });
        
        toast({
          title: "Image uploaded",
          description: "Your business image has been uploaded successfully.",
        });
      }
    };
    
    // Trigger the file input click
    fileInput.click();
  };
  
  // Handle file drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive"
        });
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive"
        });
        return;
      }
      
      // Create object URL
      const imageUrl = URL.createObjectURL(file);
      form.setValue("image", imageUrl);
      onUpdateFormData({ ...form.getValues(), image: imageUrl });
      
      toast({
        title: "Image uploaded",
        description: "Your business image has been uploaded successfully.",
      });
    }
  };
  
  return (
    <div>
      <h2 className="text-xl font-bold text-neutral-900 mb-6">Enter Your Business Information</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-neutral-900">Business Information</h3>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Coffee Corner" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoriesLoading ? (
                        <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                      ) : (
                        categories?.map((category: any) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description of your business" 
                      rows={3} 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length || 0}/500 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isRestaurant"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      This is a restaurant or food business
                    </FormLabel>
                    <FormDescription>
                      Check this if your business is a restaurant, café, food truck, or similar business
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., San Francisco" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., CA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <FormLabel>Tags</FormLabel>
              <div className="flex flex-wrap gap-2 mt-2 mb-3">
                {tags.map((tag, i) => (
                  <div key={i} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center">
                    {tag}
                    <button 
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-primary hover:text-primary/70"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="Add tags (press Enter or comma to add)"
                  className="flex-grow"
                />
                <Button 
                  type="button" 
                  onClick={addTag}
                  variant="outline"
                  className="ml-2"
                >
                  Add
                </Button>
              </div>
              <FormDescription className="mt-1">
                Add relevant tags to help customers find your business
              </FormDescription>
            </div>
          </div>
          
          <div className="space-y-6 pt-6 border-t">
            <h3 className="text-lg font-semibold text-neutral-900">Contact Information</h3>
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., (555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., https://www.example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., contact@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-6 pt-6 border-t">
            <h3 className="text-lg font-semibold text-neutral-900">Media</h3>
            
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Photo</FormLabel>
                  <FormControl>
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
                      onClick={handleImageUpload}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      {field.value ? (
                        <div className="relative">
                          <img 
                            src={field.value} 
                            alt="Business preview" 
                            className="max-h-40 mx-auto rounded"
                          />
                          <p className="text-sm text-neutral-500 mt-2">Click to change image</p>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-10 w-10 text-neutral-400 mx-auto mb-2" />
                          <p className="text-neutral-500">
                            Drag and drop an image or <span className="text-primary">browse files</span>
                          </p>
                          <p className="text-xs text-neutral-400 mt-1">
                            Recommended size: 600x400px, Max: 5MB
                          </p>
                        </>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-end pt-6">
            <Button type="submit">Continue to Preview</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
