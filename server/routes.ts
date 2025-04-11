import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertBusinessSchema, 
  insertBusinessLikeSchema,
  insertBusinessCommentSchema,
  insertMessageSchema,
  insertNotificationSchema
} from "@shared/schema";
import { ZodError } from "zod";
import checkoutNodeJssdk from "@paypal/checkout-server-sdk";
import crypto from "crypto";

// Set up PayPal client
function getPayPalClient() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    throw new Error("Missing PayPal credentials. Please ensure PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET environment variables are set.");
  }
  
  console.log("Initializing PayPal client with Client ID:", clientId.substring(0, 5) + "..." + clientId.substring(clientId.length - 4));
  
  try {
    // For sandbox/testing
    const environment = new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
    
    // For live transactions
    // const environment = new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret);
    
    return new checkoutNodeJssdk.core.PayPalHttpClient(environment);
  } catch (error) {
    console.error("Error initializing PayPal client:", error);
    throw new Error("Failed to initialize PayPal client. Please check your credentials.");
  }
}

// Helper to validate request body with Zod schema
function validateRequest(schema: any, data: any) {
  try {
    return { success: true, data: schema.parse(data) };
  } catch (error) {
    if (error instanceof ZodError) {
      return { 
        success: false, 
        error: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      };
    }
    return { success: false, error: 'Invalid request data' };
  }
}

// Simple auth middleware
function requireAuth(req: Request, res: Response, next: Function) {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // User authentication routes
  app.post('/api/register', async (req, res) => {
    try {
      const validation = validateRequest(insertUserSchema, req.body);
      if (!validation.success) {
        return res.status(400).json({ message: validation.error });
      }
      
      const { username, email, password } = validation.data;
      
      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      
      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      
      // Hash the password before storing
      const hashedPassword = await hashPassword(password);
      
      // Create user with hashed password
      const user = await storage.createUser({
        ...validation.data,
        password: hashedPassword
      });
      
      // Store user ID in session
      req.session.userId = user.id;
      
      // Force save the session before sending the response
      req.session.save((err) => {
        if (err) {
          console.error('Session save error during registration:', err);
          return res.status(500).json({ message: 'Authentication error' });
        }
        
        console.log(`User registered successfully: ${username} (ID: ${user.id}), Session ID: ${req.session.id}`);
        
        // Remove password from response
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Failed to register user' });
    }
  });
  
  // Utility functions for password hashing
  async function hashPassword(password: string): Promise<string> {
    // In a real application, this would use bcrypt with a proper salt
    // For demo purposes, we're using a simple hashing method
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `${hash}.${salt}`;
  }
  
  async function verifyPassword(storedPassword: string, suppliedPassword: string): Promise<boolean> {
    try {
      const [hashedPassword, salt] = storedPassword.split('.');
      
      if (!hashedPassword || !salt) {
        console.warn('Password format is invalid, might be an old plaintext password');
        return storedPassword === suppliedPassword; // Fallback for plaintext passwords
      }
      
      const suppliedHash = crypto.pbkdf2Sync(suppliedPassword, salt, 1000, 64, 'sha512').toString('hex');
      return hashedPassword === suppliedHash;
    } catch (error) {
      console.error('Password verification error:', error);
      return false;
    }
  }

  app.post('/api/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
      
      const user = await storage.getUserByUsername(username);
      
      // For security, always use the same error message to prevent username enumeration
      if (!user) {
        console.log(`Login failed: User not found - ${username}`);
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Verify password using secure comparison
      const passwordValid = await verifyPassword(user.password, password);
      
      if (!passwordValid) {
        console.log(`Login failed: Password mismatch for user ${username}`);
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Store user ID in session
      req.session.userId = user.id;
      
      // Force save the session before sending the response
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          return res.status(500).json({ message: 'Authentication error' });
        }
        
        console.log(`User logged in successfully: ${username} (ID: ${user.id}), Session ID: ${req.session.id}`);
        
        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Failed to log in' });
    }
  });
  
  app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to log out' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  });
  
  app.get('/api/me', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not logged in' });
      }
      
      const user = await storage.getUser(req.session.userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch user data' });
    }
  });
  
  // Category routes
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch categories' });
    }
  });
  
  app.get('/api/categories/:id', async (req, res) => {
    try {
      const category = await storage.getCategoryById(parseInt(req.params.id));
      
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch category' });
    }
  });
  
  // Business routes
  app.get('/api/businesses', async (req, res) => {
    try {
      const businesses = await storage.getBusinesses({ isActive: true });
      res.json(businesses);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch businesses' });
    }
  });
  
  app.get('/api/businesses/featured', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 4;
      const businesses = await storage.getFeaturedBusinesses(limit);
      res.json(businesses);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch featured businesses' });
    }
  });
  
  app.get('/api/businesses/trending', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 4;
      const businesses = await storage.getTrendingBusinesses(limit);
      res.json(businesses);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch trending businesses' });
    }
  });
  
  app.get('/api/businesses/recent', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 4;
      const businesses = await storage.getRecentBusinesses(limit);
      res.json(businesses);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch recent businesses' });
    }
  });
  
  app.get('/api/businesses/search', async (req, res) => {
    try {
      const query = req.query.q as string;
      
      if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
      }
      
      const businesses = await storage.searchBusinesses(query);
      res.json(businesses);
    } catch (error) {
      res.status(500).json({ message: 'Failed to search businesses' });
    }
  });
  
  app.get('/api/businesses/category/:categoryId', async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const businesses = await storage.getBusinessesByCategory(categoryId);
      res.json(businesses);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch businesses by category' });
    }
  });
  
  app.get('/api/businesses/:id', async (req, res) => {
    try {
      const business = await storage.getBusinessById(parseInt(req.params.id));
      
      if (!business) {
        return res.status(404).json({ message: 'Business not found' });
      }
      
      res.json(business);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch business' });
    }
  });
  
  app.get('/api/users/:userId/businesses', requireAuth, async (req, res) => {
    try {
      // Only allow users to view their own businesses unless admin
      if (parseInt(req.params.userId) !== req.session.userId) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      const businesses = await storage.getBusinessesByOwnerId(parseInt(req.params.userId));
      res.json(businesses);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch user businesses' });
    }
  });
  
  app.get('/api/users/:userId/likes', requireAuth, async (req, res) => {
    try {
      // Only allow users to view their own likes unless admin
      if (parseInt(req.params.userId) !== req.session.userId) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      // Get all likes by the user
      const likes = await storage.getLikesByUserId(parseInt(req.params.userId));
      
      // If no likes, return empty array
      if (likes.length === 0) {
        return res.json([]);
      }
      
      // Extract businessIds from likes
      const businessIds = likes.map(like => like.businessId);
      
      // Get all businesses
      const allBusinesses = await storage.getBusinesses();
      
      // Filter businesses that were liked by the user
      const likedBusinesses = allBusinesses.filter(business => 
        businessIds.includes(business.id)
      );
      
      res.json(likedBusinesses);
    } catch (error) {
      console.error('Error fetching user liked businesses:', error);
      res.status(500).json({ message: 'Failed to fetch user liked businesses' });
    }
  });
  
  app.post('/api/businesses', requireAuth, async (req, res) => {
    try {
      const businessData = { 
        ...req.body,
        ownerId: req.session.userId
      };
      
      const validation = validateRequest(insertBusinessSchema, businessData);
      if (!validation.success) {
        return res.status(400).json({ message: validation.error });
      }
      
      const business = await storage.createBusiness(validation.data);
      res.status(201).json(business);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create business' });
    }
  });
  
  app.put('/api/businesses/:id', requireAuth, async (req, res) => {
    try {
      const businessId = parseInt(req.params.id);
      const business = await storage.getBusinessById(businessId);
      
      if (!business) {
        return res.status(404).json({ message: 'Business not found' });
      }
      
      // Only allow owners to update their businesses
      if (business.ownerId !== req.session.userId) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      const updatedBusiness = await storage.updateBusiness(businessId, req.body);
      res.json(updatedBusiness);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update business' });
    }
  });
  
  app.delete('/api/businesses/:id', requireAuth, async (req, res) => {
    try {
      const businessId = parseInt(req.params.id);
      const business = await storage.getBusinessById(businessId);
      
      if (!business) {
        return res.status(404).json({ message: 'Business not found' });
      }
      
      // Only allow owners to delete their businesses
      if (business.ownerId !== req.session.userId) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      await storage.deleteBusiness(businessId);
      res.json({ message: 'Business deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete business' });
    }
  });
  
  // Business likes routes
  app.post('/api/businesses/:businessId/like', requireAuth, async (req, res) => {
    try {
      const businessId = parseInt(req.params.businessId);
      const userId = req.session.userId;
      
      // Check if business exists
      const business = await storage.getBusinessById(businessId);
      if (!business) {
        return res.status(404).json({ message: 'Business not found' });
      }
      
      // Check if already liked
      const existingLike = await storage.getLikeByUserAndBusiness(userId, businessId);
      if (existingLike) {
        return res.status(400).json({ message: 'Business already liked by user' });
      }
      
      const likeData = { businessId, userId };
      const validation = validateRequest(insertBusinessLikeSchema, likeData);
      if (!validation.success) {
        return res.status(400).json({ message: validation.error });
      }
      
      const like = await storage.createBusinessLike(validation.data);
      res.status(201).json(like);
    } catch (error) {
      res.status(500).json({ message: 'Failed to like business' });
    }
  });
  
  app.delete('/api/businesses/:businessId/like', requireAuth, async (req, res) => {
    try {
      const businessId = parseInt(req.params.businessId);
      const userId = req.session.userId;
      
      // Check if business exists
      const business = await storage.getBusinessById(businessId);
      if (!business) {
        return res.status(404).json({ message: 'Business not found' });
      }
      
      const result = await storage.deleteBusinessLike(userId, businessId);
      
      if (!result) {
        return res.status(404).json({ message: 'Like not found' });
      }
      
      res.json({ message: 'Like removed successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to unlike business' });
    }
  });
  
  app.get('/api/businesses/:businessId/likes', async (req, res) => {
    try {
      const businessId = parseInt(req.params.businessId);
      
      // Check if business exists
      const business = await storage.getBusinessById(businessId);
      if (!business) {
        return res.status(404).json({ message: 'Business not found' });
      }
      
      const likes = await storage.getLikesByBusinessId(businessId);
      res.json(likes);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch business likes' });
    }
  });
  
  // Business comments routes
  app.get('/api/businesses/:businessId/comments', async (req, res) => {
    try {
      const businessId = parseInt(req.params.businessId);
      
      // Check if business exists
      const business = await storage.getBusinessById(businessId);
      if (!business) {
        return res.status(404).json({ message: 'Business not found' });
      }
      
      const comments = await storage.getCommentsByBusinessId(businessId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch business comments' });
    }
  });
  
  app.post('/api/businesses/:businessId/comments', requireAuth, async (req, res) => {
    try {
      const businessId = parseInt(req.params.businessId);
      const userId = req.session.userId;
      
      // Check if business exists
      const business = await storage.getBusinessById(businessId);
      if (!business) {
        return res.status(404).json({ message: 'Business not found' });
      }
      
      const commentData = { 
        ...req.body,
        businessId,
        userId
      };
      
      const validation = validateRequest(insertBusinessCommentSchema, commentData);
      if (!validation.success) {
        return res.status(400).json({ message: validation.error });
      }
      
      const comment = await storage.createBusinessComment(validation.data);
      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create comment' });
    }
  });
  
  // PayPal Webhook for payment notifications
  app.post('/api/paypal-webhook', async (req, res) => {
    try {
      const { event_type, resource } = req.body;
      
      console.log('PayPal Webhook received:', event_type);
      
      // Handle payment approval
      if (event_type === 'PAYMENT.CAPTURE.COMPLETED' && resource && resource.id) {
        const orderId = resource.supplementary_data?.related_ids?.order_id || '';
        
        if (orderId) {
          // Update subscription status to active
          const allSubscriptions = await storage.getBusinesses();
          for (const business of allSubscriptions) {
            const subscription = await storage.getSubscriptionByBusinessId(business.id);
            if (subscription && subscription.paypalOrderId === orderId) {
              await storage.updateSubscription(subscription.id, {
                status: 'active'
              });
              
              // Activate the business listing
              await storage.updateBusiness(business.id, {
                isActive: true,
                isPaid: true
              });
              
              console.log(`Updated subscription for business ID ${business.id} to active`);
            }
          }
        }
      }
      
      // Always respond with success to PayPal
      res.status(200).send('OK');
    } catch (error) {
      console.error('Error processing PayPal webhook:', error);
      res.status(500).send('Error processing webhook');
    }
  });
  
  // PayPal Payment and subscription handling
  app.post('/api/create-subscription', requireAuth, async (req, res) => {
    try {
      const { businessId } = req.body;
      const userId = req.session.userId;
      
      if (!businessId) {
        return res.status(400).json({ message: 'Business ID is required' });
      }
      
      // Check if business exists
      const business = await storage.getBusinessById(parseInt(businessId));
      if (!business) {
        return res.status(404).json({ message: 'Business not found' });
      }
      
      // Check if user owns the business
      if (business.ownerId !== userId) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      // Check if business already has an active subscription
      const existingSubscription = await storage.getSubscriptionByBusinessId(parseInt(businessId));
      if (existingSubscription && existingSubscription.status === 'active') {
        return res.status(400).json({ message: 'Business already has an active subscription' });
      }
      
      try {
        // Create a PayPal subscription
        const paypalClient = getPayPalClient();
        
        // Create a subscription request
        const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
          intent: 'CAPTURE',
          purchase_units: [{
            amount: {
              currency_code: 'USD',
              value: '5.00'  // $5 monthly subscription
            },
            description: 'Derra Business Listing Subscription'
          }],
          application_context: {
            return_url: 'https://derra-marketplace.app/subscription/success',
            cancel_url: 'https://derra-marketplace.app/subscription/cancel'
          }
        });
        
        // Call PayPal to create the order
        const order = await paypalClient.execute(request);
        
        // Type assertion to ensure TypeScript knows the shape
        const orderResult = order.result as {
          id: string;
          links: Array<{
            href: string;
            rel: string;
            method: string;
          }>;
        };
        
        // Find approval URL to redirect user to PayPal
        const approvalLink = orderResult.links.find(link => link.rel === 'approve');
        if (!approvalLink) {
          throw new Error('Could not find approval URL in PayPal order response');
        }
        const approvalUrl = approvalLink.href;
        
        // Create a record in our database
        const now = new Date();
        const oneMonthLater = new Date();
        oneMonthLater.setMonth(now.getMonth() + 1);
        
        const subscriptionData = {
          businessId: parseInt(businessId),
          userId,
          paypalOrderId: orderResult.id,
          status: 'pending',
          priceId: 'derra_monthly_listing',
          currentPeriodStart: now,
          currentPeriodEnd: oneMonthLater
        };
        
        const subscription = await storage.createSubscription(subscriptionData);
        
        // Send back the approval URL and subscription info
        res.json({ 
          subscription,
          approvalUrl,
          orderId: orderResult.id
        });
      } catch (paypalError: any) {
        console.error('PayPal API error:', paypalError);
        return res.status(500).json({ 
          message: 'Failed to create PayPal order', 
          error: paypalError.message 
        });
      }
    } catch (error) {
      console.error('Subscription creation error:', error);
      res.status(500).json({ message: 'Failed to create subscription' });
    }
  });

  // Manual activation endpoint for demo purposes
  app.post('/api/subscription/activate-demo', requireAuth, async (req, res) => {
    try {
      const { businessId } = req.body;
      const userId = req.session.userId;
      
      if (!businessId) {
        return res.status(400).json({ message: 'Business ID is required' });
      }
      
      // Check if business exists
      const business = await storage.getBusinessById(parseInt(businessId));
      if (!business) {
        return res.status(404).json({ message: 'Business not found' });
      }
      
      // Check if user owns the business
      if (business.ownerId !== userId) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      // Create a demo subscription
      const now = new Date();
      const oneMonthLater = new Date();
      oneMonthLater.setMonth(now.getMonth() + 1);
      
      const subscriptionData = {
        businessId: parseInt(businessId),
        userId,
        paypalOrderId: `demo-${Date.now()}`,
        status: 'active',
        priceId: 'derra_monthly_listing',
        currentPeriodStart: now,
        currentPeriodEnd: oneMonthLater
      };
      
      // Create or update subscription
      let subscription = await storage.getSubscriptionByBusinessId(parseInt(businessId));
      if (subscription) {
        subscription = await storage.updateSubscription(subscription.id, {
          status: 'active',
          currentPeriodStart: now,
          currentPeriodEnd: oneMonthLater,
          paypalOrderId: subscriptionData.paypalOrderId
        });
      } else {
        subscription = await storage.createSubscription(subscriptionData);
      }
      
      // Activate the business listing
      await storage.updateBusiness(parseInt(businessId), {
        isActive: true,
        isPaid: true
      });
      
      res.json({ 
        subscription,
        success: true,
        message: 'Business activated in demo mode'
      });
    } catch (error) {
      console.error('Demo activation error:', error);
      res.status(500).json({ message: 'Failed to activate business in demo mode' });
    }
  });

  // Verify PayPal payment after successful redirect
  app.post('/api/subscription/verify', requireAuth, async (req, res) => {
    try {
      const { orderId } = req.body;
      const userId = req.session.userId;
      
      if (!orderId) {
        return res.status(400).json({ message: 'Order ID is required' });
      }
      
      try {
        // Verify with PayPal
        const paypalClient = getPayPalClient();
        const request = new checkoutNodeJssdk.orders.OrdersGetRequest(orderId);
        const orderDetails = await paypalClient.execute(request);
        
        // Type assertion for PayPal response
        const orderResult = orderDetails.result as {
          id: string;
          status: string;
          purchase_units: Array<{
            reference_id: string;
            amount: {
              value: string;
              currency_code: string;
            }
          }>;
        };
        
        // Get order details from PayPal
        if (orderResult.status !== 'COMPLETED' && orderResult.status !== 'APPROVED') {
          return res.status(400).json({ 
            message: `Payment not completed. Status: ${orderResult.status}`
          });
        }
        
        // Find the subscription in our database
        // First find by PayPal order ID
        let subscriptions = await storage.getSubscriptionsByPayPalOrderId(orderId);
        
        // If not found, might be a user trying to fake it, check they own any subscriptions
        if (!subscriptions || subscriptions.length === 0) {
          return res.status(404).json({ message: 'Subscription not found' });
        }
        
        // Verify the subscription belongs to the logged-in user
        const subscription = subscriptions.find(sub => sub.userId === userId);
        if (!subscription) {
          return res.status(403).json({ message: 'Unauthorized access to subscription' });
        }
        
        // If payment is APPROVED but not yet COMPLETED, capture it now
        if (orderResult.status === 'APPROVED') {
          const captureRequest = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
          // Add empty body for the capture request
          (captureRequest as any).requestBody = () => captureRequest;
          
          const captureResponse = await paypalClient.execute(captureRequest);
          const captureResult = captureResponse.result as { status: string };
          
          if (captureResult.status !== 'COMPLETED') {
            return res.status(400).json({ 
              message: `Failed to capture payment. Status: ${captureResult.status}`
            });
          }
        }
        
        // Update the subscription status to active
        const updatedSubscription = await storage.updateSubscription(subscription.id, {
          status: 'active'
        });
        
        // Also mark the business as paid
        const business = await storage.getBusinessById(subscription.businessId);
        if (business) {
          await storage.updateBusiness(business.id, {
            isPaid: true
          });
        }
        
        res.json({ 
          message: 'Payment verified and subscription activated',
          businessId: subscription.businessId
        });
      } catch (paypalError: any) {
        console.error('PayPal verification error:', paypalError);
        return res.status(500).json({ 
          message: 'Failed to verify payment with PayPal', 
          error: paypalError.message 
        });
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      res.status(500).json({ message: 'Failed to verify payment' });
    }
  });

  // Message routes
  app.get('/api/messages', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const messages = await storage.getMessagesByUserId(userId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch messages' });
    }
  });

  app.get('/api/businesses/:businessId/messages', requireAuth, async (req, res) => {
    try {
      const businessId = parseInt(req.params.businessId);
      
      // Check if business exists
      const business = await storage.getBusinessById(businessId);
      if (!business) {
        return res.status(404).json({ message: 'Business not found' });
      }
      
      // Only allow business owner to get all messages
      if (business.ownerId !== req.session.userId) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      const messages = await storage.getMessagesByBusinessId(businessId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch business messages' });
    }
  });

  app.get('/api/messages/:businessId/:otherUserId', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const businessId = parseInt(req.params.businessId);
      const otherUserId = parseInt(req.params.otherUserId);
      
      // Check if business exists
      const business = await storage.getBusinessById(businessId);
      if (!business) {
        return res.status(404).json({ message: 'Business not found' });
      }
      
      // Ensure user is either the business owner or the other party in the conversation
      if (business.ownerId !== userId && otherUserId !== userId) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      const messages = await storage.getMessagesBetweenUsers(userId, otherUserId, businessId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch conversation' });
    }
  });

  app.post('/api/messages', requireAuth, async (req, res) => {
    try {
      const senderId = req.session.userId;
      const { receiverId, businessId, content } = req.body;
      
      if (!receiverId || !businessId || !content) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      
      // Check if business exists
      const business = await storage.getBusinessById(parseInt(businessId));
      if (!business) {
        return res.status(404).json({ message: 'Business not found' });
      }
      
      // Ensure user is allowed to message (either business owner or customer)
      const isBusinessOwner = business.ownerId === senderId;
      const isCustomer = !isBusinessOwner;
      
      if (!isBusinessOwner && !isCustomer) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      // If customer is messaging, ensure the recipient is the business owner
      if (isCustomer && parseInt(receiverId) !== business.ownerId) {
        return res.status(400).json({ message: 'Invalid recipient' });
      }
      
      const messageData = { 
        senderId, 
        receiverId: parseInt(receiverId), 
        businessId: parseInt(businessId), 
        content 
      };
      
      const validation = validateRequest(insertMessageSchema, messageData);
      if (!validation.success) {
        return res.status(400).json({ message: validation.error });
      }
      
      const message = await storage.createMessage(validation.data);
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ message: 'Failed to send message' });
    }
  });

  app.patch('/api/messages/:id/read', requireAuth, async (req, res) => {
    try {
      const messageId = parseInt(req.params.id);
      const userId = req.session.userId;
      
      // Check if message exists
      const message = await storage.getMessageById(messageId);
      if (!message) {
        return res.status(404).json({ message: 'Message not found' });
      }
      
      // Ensure user is the recipient of the message
      if (message.receiverId !== userId) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      const updatedMessage = await storage.markMessageAsRead(messageId);
      res.json(updatedMessage);
    } catch (error) {
      res.status(500).json({ message: 'Failed to mark message as read' });
    }
  });

  // Notification routes
  app.get('/api/notifications', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const notifications = await storage.getNotificationsByUserId(userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch notifications' });
    }
  });

  app.get('/api/notifications/unread-count', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const count = await storage.getUnreadNotificationsCount(userId);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch unread notification count' });
    }
  });

  app.patch('/api/notifications/:id/read', requireAuth, async (req, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      const userId = req.session.userId;
      
      // Check if notification exists
      const notification = await storage.getNotificationById(notificationId);
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }
      
      // Ensure user is the recipient of the notification
      if (notification.userId !== userId) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      const updatedNotification = await storage.markNotificationAsRead(notificationId);
      res.json(updatedNotification);
    } catch (error) {
      res.status(500).json({ message: 'Failed to mark notification as read' });
    }
  });

  app.patch('/api/notifications/mark-all-read', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      await storage.markAllNotificationsAsRead(userId);
      res.json({ message: 'All notifications marked as read' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to mark all notifications as read' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
