import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import derraLogo from "../../assets/derra-logo.png";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center mb-4">
              <img 
                src={derraLogo} 
                alt="Derra Logo" 
                className="h-10 w-auto bg-white p-1 rounded-lg"
              />
              <span className="text-white font-bold text-xl ml-2">Derra</span>
            </div>
            <p className="text-neutral-400 text-sm max-w-xs">
              The world's premier marketplace for discovering and connecting with local businesses.
            </p>
            <div className="flex mt-6 space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white transition-all">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-all">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-all">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">For Businesses</h3>
            <ul className="space-y-3">
              <li><Link href="/create-listing" className="text-neutral-400 hover:text-white text-sm transition-all">List Your Business</Link></li>
              <li><Link href="/resources" className="text-neutral-400 hover:text-white text-sm transition-all">Business Resources</Link></li>
              <li><Link href="/success-stories" className="text-neutral-400 hover:text-white text-sm transition-all">Success Stories</Link></li>
              <li><Link href="/pricing" className="text-neutral-400 hover:text-white text-sm transition-all">Pricing</Link></li>
              <li><Link href="/marketing-tools" className="text-neutral-400 hover:text-white text-sm transition-all">Marketing Tools</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">For Users</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-neutral-400 hover:text-white text-sm transition-all">Discover Businesses</Link></li>
              <li><Link href="/reviews" className="text-neutral-400 hover:text-white text-sm transition-all">Write Reviews</Link></li>
              <li><Link href="/mobile-app" className="text-neutral-400 hover:text-white text-sm transition-all">Mobile App</Link></li>
              <li><Link href="/user-guide" className="text-neutral-400 hover:text-white text-sm transition-all">User Guide</Link></li>
              <li><Link href="/community" className="text-neutral-400 hover:text-white text-sm transition-all">Community</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-neutral-400 hover:text-white text-sm transition-all">About Us</Link></li>
              <li><Link href="/careers" className="text-neutral-400 hover:text-white text-sm transition-all">Careers</Link></li>
              <li><Link href="/press" className="text-neutral-400 hover:text-white text-sm transition-all">Press</Link></li>
              <li><Link href="/contact" className="text-neutral-400 hover:text-white text-sm transition-all">Contact</Link></li>
              <li><Link href="/blog" className="text-neutral-400 hover:text-white text-sm transition-all">Blog</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-400 text-sm">&copy; {new Date().getFullYear()} Derra - World of Business. All rights reserved.</p>
            <div className="flex mt-4 md:mt-0 space-x-6">
              <Link href="/privacy" className="text-neutral-400 hover:text-white text-sm transition-all">Privacy Policy</Link>
              <Link href="/terms" className="text-neutral-400 hover:text-white text-sm transition-all">Terms of Service</Link>
              <Link href="/cookies" className="text-neutral-400 hover:text-white text-sm transition-all">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
