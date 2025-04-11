import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Search, User, Menu, X, Heart, Building, LogOut } from "lucide-react";
import { NotificationBell } from "@/components/notifications/notification-bell";
import derraLogo from "../../assets/derra-logo.png";

const loginSchema = z.object({
  username: z.string().min(1, {
    message: "Username is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

const registerSchema = z.object({
  username: z.string().min(1, {
    message: "Username is required",
  }),
  email: z.string().min(1, { 
    message: "Email is required" 
  }).email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
  confirmPassword: z.string().min(1, {
    message: "Please confirm your password",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function Header() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  
  // Get auth using the hook from auth-context
  const auth = useAuth();
  const [authChecked, setAuthChecked] = useState(false);
  
  // Use effect to log auth state for debugging
  useEffect(() => {
    console.log("Header component - Auth state:", 
      auth ? { 
        isAuthenticated: auth.isAuthenticated, 
        user: auth.user ? `${auth.user.username} (ID: ${auth.user.id})` : 'none' 
      } : 'AuthContext not available');
    
    if (auth) {
      setAuthChecked(true);
    }
  }, [auth?.isAuthenticated, auth?.user]);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Handle dialog open/close and reset forms
  const handleAuthDialogChange = (open: boolean) => {
    if (!open) {
      // Reset both forms when dialog is closed
      loginForm.reset();
      registerForm.reset();
    }
    setAuthDialogOpen(open);
  };
  
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  
  const onLoginSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      // Add better validation
      if (!data.username || !data.password) {
        toast({
          title: "Login failed",
          description: "Username and password are required",
          variant: "destructive",
        });
        return;
      }
      
      if (!auth) {
        toast({
          title: "System error",
          description: "Authentication system is not available",
          variant: "destructive",
        });
        return;
      }
      
      console.log("Starting login attempt with username:", data.username);
      
      // Attempt login
      const user = await auth.login(data.username, data.password);
      
      // Only show success message and close dialog if we get a valid user back
      if (user && user.id) {
        console.log("Login successful for user:", user.username);
        setAuthDialogOpen(false);
        toast({
          title: "Logged in",
          description: `Welcome back, ${user.username}!`,
        });
        loginForm.reset();
      } else {
        // This should not happen but handle it just in case
        console.error('Login returned invalid user object:', user);
        toast({
          title: "Login error",
          description: "Unable to retrieve user information",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Login error in header component:', error);
      // Don't close the dialog on error
      toast({
        title: "Login failed",
        description: error.message || "Failed to log in. Please check your credentials.",
        variant: "destructive",
      });
      // Don't reset the form on error so the user can try again
    }
  };
  
  const onRegisterSubmit = async (data: z.infer<typeof registerSchema>) => {
    try {
      const { confirmPassword, ...userData } = data;
      await auth?.register(userData);
      setAuthDialogOpen(false);
      toast({
        title: "Registered",
        description: "Your account has been created successfully",
      });
      registerForm.reset();
    } catch (error: any) {
      console.error('Registration error:', error);
      // Don't close the dialog on error
      toast({
        title: "Registration failed",
        description: error.message || "Failed to register. Please try again.",
        variant: "destructive",
      });
      // Don't reset the form on error so the user can try again
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowMobileSearch(false);
    }
  };
  
  const toggleAuthMode = () => {
    // Reset form errors when switching modes
    if (authMode === 'login') {
      // Switch to register mode
      setAuthMode('register');
      
      // Clear fields and errors
      registerForm.reset();
      
      // Reset server errors
      registerForm.clearErrors();
    } else {
      // Switch to login mode
      setAuthMode('login');
      
      // Clear fields and errors  
      loginForm.reset();
      
      // Reset server errors
      loginForm.clearErrors();
    }
  };
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img 
                src={derraLogo} 
                alt="Derra Logo" 
                className="h-10 w-auto"
              />
              <span className="text-neutral-900 font-bold text-xl ml-2 hidden sm:block">Derra</span>
            </Link>
            <span className="hidden md:block text-sm text-neutral-500 ml-2 border-l pl-2">World of Business</span>
          </div>

          {/* Desktop Search */}
          <div className="max-w-md w-full mx-4 hidden md:block">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for businesses..."
                  className="rounded-full pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 h-4 w-4" />
              </div>
            </form>
          </div>

          {/* Navigation */}
          <div className="flex items-center">
            <Link href="/" className="text-neutral-500 hover:text-primary mx-2 hidden md:block">
              <span>Explore</span>
            </Link>
            <Link href="/categories" className="text-neutral-500 hover:text-primary mx-2 hidden md:block">
              <span>Categories</span>
            </Link>
            
            {auth?.isAuthenticated ? (
              <>
                <Link href="/create-listing">
                  <Button size="sm" className="mx-2 hidden sm:block">
                    List Your Business
                  </Button>
                </Link>
                <div className="mx-2">
                  <NotificationBell />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden">
                      <div className="h-full w-full rounded-full bg-primary flex items-center justify-center text-white hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all">
                        <span className="font-medium">{auth.user?.username?.substring(0, 1).toUpperCase()}</span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center justify-start p-2">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white overflow-hidden">
                          <span className="font-medium">{auth.user?.username?.substring(0, 1).toUpperCase()}</span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{auth.user?.username}</p>
                          <p className="text-xs leading-none text-muted-foreground">{auth.user?.email}</p>
                        </div>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <div className="flex items-center">
                        <Building className="mr-2 h-4 w-4" />
                        <span>Your Businesses</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      navigate("/profile");
                      // Delay to ensure rendering before selecting the tab
                      setTimeout(() => {
                        const favoritesTab = document.querySelector('[value="favorites"]') as HTMLElement;
                        if (favoritesTab) favoritesTab.click();
                      }, 100);
                    }}>
                      <div className="flex items-center">
                        <Heart className="mr-2 h-4 w-4" />
                        <span>Favorites</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/create-listing">
                  <Button size="sm" className="mx-2 hidden sm:block">
                    List Your Business
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate("/auth")}
                >
                  Log in
                </Button>
              </>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Search - Only visible on small screens */}
        <div className="block md:hidden border-t mt-2 pt-2">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for businesses..."
                className="rounded-full pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 h-4 w-4" />
            </div>
          </form>
        </div>
        
        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t mt-2 pt-2">
            <div className="flex flex-col space-y-2">
              <Link href="/" className="px-4 py-2 hover:bg-neutral-100 rounded-md">
                Explore
              </Link>
              <Link href="/categories" className="px-4 py-2 hover:bg-neutral-100 rounded-md">
                Categories
              </Link>
              <Link href="/create-listing" className="px-4 py-2 hover:bg-neutral-100 rounded-md">
                List Your Business
              </Link>
              {auth?.isAuthenticated ? (
                <>
                  <div className="px-4 py-2 hover:bg-neutral-100 rounded-md">
                    <div className="flex items-center">
                      <NotificationBell />
                      <span className="ml-2">Notifications</span>
                    </div>
                  </div>
                  <div className="px-4 py-2 hover:bg-neutral-100 rounded-md" onClick={() => {
                    navigate("/profile");
                    setShowMobileMenu(false);
                  }}>
                    <div className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white overflow-hidden">
                        <span className="font-medium text-xs">{auth.user?.username?.substring(0, 1).toUpperCase()}</span>
                      </div>
                      <span className="ml-2">Profile</span>
                    </div>
                  </div>
                  <div className="px-4 py-2 hover:bg-neutral-100 rounded-md" onClick={() => {
                    navigate("/profile");
                    setShowMobileMenu(false);
                  }}>
                    <div className="flex items-center">
                      <Building className="h-4 w-4 text-neutral-500" />
                      <span className="ml-2">Your Businesses</span>
                    </div>
                  </div>
                  <div className="px-4 py-2 hover:bg-neutral-100 rounded-md" onClick={() => {
                    navigate("/profile");
                    setTimeout(() => {
                      const favoritesTab = document.querySelector('[value="favorites"]') as HTMLElement;
                      if (favoritesTab) favoritesTab.click();
                    }, 100);
                    setShowMobileMenu(false);
                  }}>
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 text-neutral-500" />
                      <span className="ml-2">Favorites</span>
                    </div>
                  </div>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  className="justify-start w-full text-left" 
                  onClick={() => {
                    navigate("/auth");
                    setShowMobileMenu(false);
                  }}
                >
                  Log in
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Auth Dialog */}
      <Dialog open={authDialogOpen} onOpenChange={handleAuthDialogChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {authMode === 'login' ? 'Log in to your account' : 'Create an account'}
            </DialogTitle>
            <DialogDescription>
              {authMode === 'login' 
                ? 'Enter your username and password to log in.' 
                : 'Fill out the form below to create a new account.'}
            </DialogDescription>
          </DialogHeader>
          
          {authMode === 'login' ? (
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-between items-center pt-2">
                  <Button type="button" variant="link" onClick={toggleAuthMode} className="px-0">
                    Create an account
                  </Button>
                  <Button type="submit">Log in</Button>
                </div>
              </form>
            </Form>
          ) : (
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                <FormField
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-between items-center pt-2">
                  <Button type="button" variant="link" onClick={toggleAuthMode} className="px-0">
                    Already have an account?
                  </Button>
                  <Button type="submit">Register</Button>
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </header>
  );
}
