import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { Check, AlertCircle } from "lucide-react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface CreatePaymentProps {
  businessId: number;
  onSuccess: () => void;
}

export default function CreatePayment({ businessId, onSuccess }: CreatePaymentProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paypalOrderData, setPaypalOrderData] = useState<{
    approvalUrl?: string;
    orderId?: string;
  } | null>(null);
  
  // Create a PayPal order when the component loads
  const createPayPalOrder = async () => {
    setIsProcessing(true);
    
    try {
      const response = await apiRequest("POST", "/api/create-subscription", { businessId });
      const data = await response.json();
      
      setPaypalOrderData(data);
      return data;
    } catch (error: any) {
      toast({
        title: "Payment initialization failed",
        description: error.message || "There was an error setting up the payment. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
      return null;
    }
  };
  
  // Handle demo mode activation
  const handleDemoActivation = async () => {
    setIsProcessing(true);
    
    try {
      const response = await apiRequest("POST", "/api/subscription/activate-demo", { businessId });
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Listing activated",
          description: "Your business listing is now active in demo mode!",
        });
        
        onSuccess();
      } else {
        toast({
          title: "Activation failed",
          description: data.message || "There was an error activating your listing. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Activation failed",
        description: error.message || "There was an error activating your listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle PayPal approval
  const handlePaypalApproval = () => {
    toast({
      title: "Payment successful",
      description: "Your business listing is now active!",
    });
    
    onSuccess();
    setIsProcessing(false);
  };
  
  // Handle PayPal error
  const handlePaypalError = (error: any) => {
    toast({
      title: "Payment failed",
      description: error.message || "There was an error processing your payment. Please try again.",
      variant: "destructive",
    });
    setIsProcessing(false);
  };
  
  // Tax calculation
  const monthlyFee = 5.00;
  const taxRate = 0.09; // 9% tax
  const tax = monthlyFee * taxRate;
  const total = monthlyFee + tax;
  
  useEffect(() => {
    // Initialize PayPal order when component mounts
    createPayPalOrder();
  }, [businessId]);
  
  const initialOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || "test", // Fallback to a placeholder if not set
    currency: "USD",
    intent: "capture",
  };
  
  return (
    <div>
      <h2 className="text-xl font-bold text-neutral-900 mb-6">Payment Information</h2>
      
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>PayPal integration is currently being updated</AlertTitle>
        <AlertDescription>
          While we're updating our PayPal integration, you can use the temporary bypass option below.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Payment Options</h3>
              
              {/* Temporary bypass option */}
              <div className="mb-6 border-b pb-6">
                <h4 className="font-medium text-base mb-2">Temporary Demo Mode</h4>
                <p className="text-sm text-gray-600 mb-4">
                  While PayPal integration is being updated, you can use this option to complete your listing.
                </p>
                <Button 
                  onClick={handleDemoActivation}
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Complete Listing (Demo Mode)"}
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Note: This is a temporary option for demonstration purposes.
                </p>
              </div>
              
              <h4 className="font-medium text-base mb-4">Pay with PayPal</h4>
              {isProcessing && !paypalOrderData && (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-sm text-gray-500">Setting up your payment...</p>
                </div>
              )}
              
              {paypalOrderData?.approvalUrl ? (
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-4">
                      Click below to securely complete your payment with PayPal:
                    </p>
                    <PayPalScriptProvider options={initialOptions}>
                      <PayPalButtons
                        style={{ 
                          layout: "vertical",
                          color: "blue",
                          shape: "rect",
                          label: "pay" 
                        }}
                        forceReRender={[businessId, total]}
                        createOrder={(data, actions) => {
                          // We already created the order on the server
                          return Promise.resolve(paypalOrderData.orderId || "");
                        }}
                        onApprove={(data, actions) => {
                          handlePaypalApproval();
                          return Promise.resolve();
                        }}
                        onError={handlePaypalError}
                      />
                    </PayPalScriptProvider>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mt-4">
                      You can also complete your payment by visiting:
                    </p>
                    <a 
                      href={paypalOrderData.approvalUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm font-medium"
                    >
                      Complete Payment on PayPal
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  {!isProcessing && (
                    <Button 
                      onClick={() => createPayPalOrder()}
                      className="w-full"
                      variant="outline"
                    >
                      Try PayPal Payment Setup
                    </Button>
                  )}
                </div>
              )}
              
              <div className="flex items-center justify-center mt-6 text-sm text-neutral-500">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-4 w-4 mr-2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                All payments are secure and encrypted
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-lg mb-4">Order Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Monthly Subscription</h4>
                    <p className="text-sm text-neutral-500">Business listing on Derra</p>
                  </div>
                  <span>{formatCurrency(monthlyFee)}/month</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">Tax</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(total)}/month</span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    You will be charged {formatCurrency(total)} today and then monthly
                  </p>
                </div>
                
                <div className="pt-4 space-y-3">
                  <div className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-green-500/10 flex items-center justify-center mt-0.5">
                      <Check className="h-3 w-3 text-green-500" />
                    </div>
                    <span className="ml-2 text-sm text-neutral-500">Cancel anytime</span>
                  </div>
                  <div className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-green-500/10 flex items-center justify-center mt-0.5">
                      <Check className="h-3 w-3 text-green-500" />
                    </div>
                    <span className="ml-2 text-sm text-neutral-500">No setup fees</span>
                  </div>
                  <div className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-green-500/10 flex items-center justify-center mt-0.5">
                      <Check className="h-3 w-3 text-green-500" />
                    </div>
                    <span className="ml-2 text-sm text-neutral-500">30-day satisfaction guarantee</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
