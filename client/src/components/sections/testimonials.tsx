import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "James Wilson",
    business: "The Coffee Corner",
    content: "Since listing my coffee shop on Derra, I've seen a 40% increase in new customers. The platform is incredibly easy to use and the support team is fantastic!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    business: "Serenity Spa & Wellness",
    content: "The real-time preview feature when creating my listing was a game-changer. I could perfect my business profile before publishing. Well worth the $5/month investment!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    business: "Precision Auto Care",
    content: "The booking feature alone has saved me countless hours managing appointments. Derra has streamlined my business operations and helped me reach new clients.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
  },
];

export default function Testimonials() {
  return (
    <section className="py-12 bg-neutral-100">
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-bold text-neutral-900 text-center mb-2">
          Business Owners Love Derra
        </h2>
        <p className="text-neutral-500 text-center max-w-2xl mx-auto mb-10">
          Join thousands of successful business owners who've transformed their online presence through our platform.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="text-amber-500 flex">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-neutral-500 mb-4">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <p className="font-bold text-neutral-900">{testimonial.name}</p>
                    <p className="text-sm text-neutral-500">{testimonial.business}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
