declare module '@paypal/checkout-server-sdk';

// Declare image file imports
declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

// Add PayPal client-side package declaration
declare module '@paypal/react-paypal-js' {
  import React from 'react';
  
  export interface PayPalButtonsComponentProps {
    style?: {
      layout?: 'vertical' | 'horizontal';
      color?: 'gold' | 'blue' | 'silver' | 'white' | 'black';
      shape?: 'rect' | 'pill';
      label?: 'paypal' | 'checkout' | 'buynow' | 'pay';
      height?: number;
    };
    createOrder?: (data: any, actions: any) => Promise<string>;
    onApprove?: (data: any, actions: any) => Promise<void>;
    onCancel?: (data: any) => void;
    onError?: (error: any) => void;
    onClick?: () => void;
    forceReRender?: any[];
  }
  
  export interface PayPalScriptOptions {
    clientId: string;
    currency?: string;
    intent?: 'capture' | 'authorize';
    'data-client-token'?: string;
    [key: string]: any;
  }
  
  export const PayPalScriptProvider: React.FC<{
    options: PayPalScriptOptions;
    children?: React.ReactNode;
  }>;
  
  export const PayPalButtons: React.FC<PayPalButtonsComponentProps>;
}