declare module '@paypal/checkout-server-sdk' {
  export namespace core {
    class PayPalHttpClient {
      constructor(environment: any, refreshToken?: any);
      execute<T>(request: any): Promise<T>;
    }

    class SandboxEnvironment {
      constructor(clientId: string, clientSecret: string);
    }

    class LiveEnvironment {
      constructor(clientId: string, clientSecret: string);
    }

    class AccessToken {
      token: string;
      constructor();
    }

    class RefreshToken {
      token: string;
      constructor();
    }

    namespace sdkVersion {
      export function Version(): string;
    }
  }

  export namespace orders {
    class OrdersCreateRequest {
      constructor();
      prefer(prefer: string): this;
      requestBody(body: any): this;
    }

    class OrdersCaptureRequest {
      constructor(orderId: string);
    }

    class OrdersGetRequest {
      constructor(orderId: string);
    }
  }

  export namespace payments {
    class CapturesRefundRequest {
      constructor(captureId: string);
      requestBody(body: any): this;
    }
  }
}