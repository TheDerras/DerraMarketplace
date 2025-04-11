import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-12 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
                Grow your business with Derra
              </h2>
              <p className="mt-4 text-neutral-500">
                Join thousands of successful business owners who've boosted their
                visibility and grown their customer base through Derra's marketplace.
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
                  <span className="ml-3 text-neutral-500">Showcase your services with beautiful listings</span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-green-500/10 flex items-center justify-center mt-0.5">
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                  <span className="ml-3 text-neutral-500">Collect reviews and build your reputation</span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-green-500/10 flex items-center justify-center mt-0.5">
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                  <span className="ml-3 text-neutral-500">Only $5/month per business listing</span>
                </li>
              </ul>
              
              <Link href="/create-listing">
                <Button className="mt-8 px-6" size="lg">
                  List Your Business
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="hidden md:block relative">
              <img 
                src="https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=700&q=80" 
                alt="Business owner smiling" 
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
