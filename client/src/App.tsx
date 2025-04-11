import { Switch, Route, Redirect } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import BusinessListing from "@/pages/business-listing";
import BusinessDashboard from "@/pages/business-dashboard";
import CreateListing from "@/pages/create-listing";
import Category from "@/pages/category";
import SearchResults from "@/pages/search-results";
import Profile from "@/pages/profile";
import Messages from "@/pages/messages";
import SubscriptionSuccess from "@/pages/subscription-success";
import SubscriptionCancel from "@/pages/subscription-cancel";
import AuthPage from "@/pages/auth-page";
import { useEffect } from "react";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider, useAuth } from "@/lib/auth-context";

// Protected route component
const ProtectedRoute = ({ component: Component, ...rest }: { component: React.ComponentType, path: string }) => {
  const auth = useAuth();
  
  if (auth.isLoading) {
    return (
      <Route {...rest}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="h-12 w-12 rounded-full border-4 border-t-transparent border-primary animate-spin"></div>
        </div>
      </Route>
    );
  }
  
  return (
    <Route {...rest}>
      {auth.isAuthenticated ? <Component /> : <Redirect to="/auth" />}
    </Route>
  );
};

function Router() {
  const auth = useAuth();
  
  // Log routing info
  useEffect(() => {
    console.log('Router rendering, auth state:', {
      isLoading: auth.isLoading,
      isAuthenticated: auth.isAuthenticated,
      user: auth.user ? `${auth.user.username} (ID: ${auth.user.id})` : 'none'
    });
  }, [auth.isLoading, auth.isAuthenticated, auth.user]);
  
  // Check for login/registration success stored in sessionStorage
  useEffect(() => {
    const loginSuccess = sessionStorage.getItem('login_success');
    const returnPath = sessionStorage.getItem('return_path');
    
    if (loginSuccess === 'true') {
      console.log("Login/registration success detected, refreshing authentication state");
      
      // Clear session storage flags
      sessionStorage.removeItem('login_success');
      sessionStorage.removeItem('return_path');
      
      // Force refresh of user data
      queryClient.invalidateQueries({ queryKey: ['/api/me'] });
      queryClient.refetchQueries({ queryKey: ['/api/me'] });
      
      // Redirect back to original path if it exists and isn't the auth page
      if (returnPath && returnPath !== '/auth') {
        window.location.href = returnPath;
      }
    }
  }, []);
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={() => {
        // If user is already logged in, redirect to home
        if (auth.isAuthenticated) {
          return <Redirect to="/" />;
        }
        // This will be implemented in a separate file
        return <AuthPage />;
      }} />
      <Route path="/business/:id" component={BusinessListing} />
      <ProtectedRoute path="/dashboard" component={BusinessDashboard} />
      <ProtectedRoute path="/create-listing" component={CreateListing} />
      <Route path="/category/:id" component={Category} />
      <Route path="/search" component={SearchResults} />
      <ProtectedRoute path="/profile" component={Profile} />
      <ProtectedRoute path="/messages" component={Messages} />
      <Route path="/subscription/success" component={SubscriptionSuccess} />
      <Route path="/subscription/cancel" component={SubscriptionCancel} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router />
      <Toaster />
    </AuthProvider>
  );
}

export default App;