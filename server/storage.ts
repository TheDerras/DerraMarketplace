import { 
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  businesses, type Business, type InsertBusiness,
  businessLikes, type BusinessLike, type InsertBusinessLike,
  businessComments, type BusinessComment, type InsertBusinessComment,
  subscriptions, type Subscription, type InsertSubscription,
  messages, type Message, type InsertMessage,
  notifications, type Notification, type InsertNotification
} from "@shared/schema";
import { DatabaseStorage } from "./dbStorage";
import { IStorage } from "./storageInterface";

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private businesses: Map<number, Business>;
  private businessLikes: Map<number, BusinessLike>;
  private businessComments: Map<number, BusinessComment>;
  private subscriptions: Map<number, Subscription>;
  private messages: Map<number, Message>;
  private notifications: Map<number, Notification>;
  
  private userId: number = 1;
  private categoryId: number = 1;
  private businessId: number = 1;
  private likeId: number = 1;
  private commentId: number = 1;
  private subscriptionId: number = 1;
  private messageId: number = 1;
  private notificationId: number = 1;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.businesses = new Map();
    this.businessLikes = new Map();
    this.businessComments = new Map();
    this.subscriptions = new Map();
    this.messages = new Map();
    this.notifications = new Map();
    
    // Initialize with some categories
    this.initializeCategories();
    
    // Initialize with demo user
    this.initializeDemoUser();
    
    // Initialize with real businesses
    this.initializeBusinesses();
  }

  private initializeCategories(): void {
    const defaultCategories = [
      { name: "Retail", icon: "ri-store-2-line" },
      { name: "Food & Dining", icon: "ri-restaurant-line" },
      { name: "Professional", icon: "ri-briefcase-4-line" },
      { name: "Healthcare", icon: "ri-heart-pulse-line" },
      { name: "Home Services", icon: "ri-home-4-line" },
      { name: "Education", icon: "ri-graduation-cap-line" }
    ];

    defaultCategories.forEach(cat => {
      this.createCategory({ name: cat.name, icon: cat.icon });
    });
  }
  
  private initializeDemoUser(): void {
    const demoUser = {
      username: "demo_user",
      password: "password123",
      email: "demo@derraplatform.com",
      name: "Demo User",
      avatar: null
    };
    
    this.createUser(demoUser);
  }
  
  private initializeBusinesses(): void {
    // Get category IDs
    const categories = Array.from(this.categories.values());
    const retailCategoryId = categories.find(c => c.name === "Retail")?.id || 1;
    const foodCategoryId = categories.find(c => c.name === "Food & Dining")?.id || 2;
    const professionalCategoryId = categories.find(c => c.name === "Professional")?.id || 3;
    const healthcareCategoryId = categories.find(c => c.name === "Healthcare")?.id || 4;
    const homeServicesCategoryId = categories.find(c => c.name === "Home Services")?.id || 5;
    const educationCategoryId = categories.find(c => c.name === "Education")?.id || 6;
    
    // Demo user ID
    const userId = 1;
    
    // Retail businesses
    this.addBusiness({
      name: "Target",
      description: "Target Corporation is an American retail corporation. It is the 8th-largest retailer in the United States, operating over 1,900 stores throughout the country.",
      ownerId: userId,
      categoryId: retailCategoryId,
      city: "Minneapolis",
      state: "Minnesota",
      address: "1000 Nicollet Mall",
      zipCode: "55403",
      phone: "+1-800-440-0680",
      email: "guest.relations@target.com",
      website: "https://www.target.com",
      image: "https://corporate.target.com/_media/TargetCorp/Press/B-roll%20and%20Press%20Materials/Logos/Target_Bullseye-Logo_Red.jpg",
      likeCount: 45,
      commentCount: 12,
      rating: 4,
      isVerified: true,
      isActive: true,
      isPaid: true,
      featured: true
    });
    
    this.addBusiness({
      name: "Walmart",
      description: "Walmart Inc. is an American multinational retail corporation that operates a chain of supercenters, discount department stores, and grocery stores across the United States.",
      ownerId: userId,
      categoryId: retailCategoryId,
      city: "Bentonville",
      state: "Arkansas",
      address: "702 SW 8th St",
      zipCode: "72716",
      phone: "+1-800-925-6278",
      email: "help@walmart.com",
      website: "https://www.walmart.com",
      image: "https://cdn.corporate.walmart.com/dims4/default/31d582d/2147483647/strip/true/crop/2389x930+0+0/resize/980x381!/quality/90/?url=https%3A%2F%2Fcdn.corporate.walmart.com%2Fd6%2Fe7%2F48e91bac4a7cb31680831d677de5%2Fwalmart-logos-lockupwtag-horiz-blu-rgb.png",
      likeCount: 32,
      commentCount: 8,
      rating: 3,
      isVerified: true,
      isActive: true,
      isPaid: false
    });
    
    // Food & Dining businesses
    this.addBusiness({
      name: "Starbucks",
      description: "Starbucks Corporation is an American multinational chain of coffeehouses and roastery reserves. It is the world's largest coffeehouse chain.",
      ownerId: userId,
      categoryId: foodCategoryId,
      city: "Seattle",
      state: "Washington",
      address: "2401 Utah Ave S",
      zipCode: "98134",
      phone: "+1-800-782-7282",
      email: "info@starbucks.com",
      website: "https://www.starbucks.com",
      image: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png",
      likeCount: 87,
      commentCount: 32,
      rating: 4,
      isVerified: true,
      isActive: true,
      isPaid: true,
      featured: true
    });
    
    this.addBusiness({
      name: "Chipotle Mexican Grill",
      description: "Chipotle Mexican Grill, Inc. is an American chain of fast casual restaurants specializing in bowls, tacos and Mission burritos made to order in front of the customer.",
      ownerId: userId,
      categoryId: foodCategoryId,
      city: "Newport Beach",
      state: "California",
      address: "610 Newport Center Drive",
      zipCode: "92660",
      phone: "+1-949-524-4000",
      email: "customerservice@chipotle.com",
      website: "https://www.chipotle.com",
      image: "https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/Chipotle_Mexican_Grill_logo.svg/1200px-Chipotle_Mexican_Grill_logo.svg.png",
      likeCount: 56,
      commentCount: 18,
      rating: 4,
      isVerified: true,
      isActive: true,
      isPaid: false
    });
    
    // Professional services
    this.addBusiness({
      name: "H&R Block",
      description: "H&R Block, Inc. is an American tax preparation company operating in North America, Australia, and India. The company was founded in 1955 and has prepared more than 800 million tax returns.",
      ownerId: userId,
      categoryId: professionalCategoryId,
      city: "Kansas City",
      state: "Missouri",
      address: "One H&R Block Way",
      zipCode: "64105",
      phone: "+1-816-854-3000",
      email: "customer.service@hrblock.com",
      website: "https://www.hrblock.com",
      image: "https://upload.wikimedia.org/wikipedia/commons/8/8f/H%26R_Block_logo.svg",
      likeCount: 22,
      commentCount: 9,
      rating: 4,
      isVerified: true,
      isActive: true,
      isPaid: true,
      featured: true
    });
    
    // Healthcare businesses
    this.addBusiness({
      name: "Mayo Clinic",
      description: "Mayo Clinic is a nonprofit American academic medical center focused on integrated health care, education, and research. It employs over 4,500 physicians and scientists, along with 58,400 administrative and allied health staff.",
      ownerId: userId,
      categoryId: healthcareCategoryId,
      city: "Rochester",
      state: "Minnesota",
      address: "200 First St SW",
      zipCode: "55905",
      phone: "+1-507-284-2511",
      email: "info@mayoclinic.org",
      website: "https://www.mayoclinic.org",
      image: "https://www.mayoclinic.org/-/media/web/gbs/shared/images/socialmedia/mc-opengraph.jpg",
      likeCount: 104,
      commentCount: 45,
      rating: 5,
      isVerified: true,
      isActive: true,
      isPaid: true,
      featured: true
    });
    
    this.addBusiness({
      name: "Cleveland Clinic",
      description: "Cleveland Clinic is a nonprofit multispecialty academic medical center that integrates clinical and hospital care with research and education.",
      ownerId: userId,
      categoryId: healthcareCategoryId,
      city: "Cleveland",
      state: "Ohio",
      address: "9500 Euclid Avenue",
      zipCode: "44195",
      phone: "+1-800-223-2273",
      email: "appointments@ccf.org",
      website: "https://my.clevelandclinic.org",
      image: "https://my.clevelandclinic.org/-/scassets/images/org/brand/cleveland-clinic-logo.svg",
      likeCount: 89,
      commentCount: 37,
      rating: 5,
      isVerified: true,
      isActive: true,
      isPaid: false
    });
    
    // Home Services
    this.addBusiness({
      name: "Angi (formerly Angie's List)",
      description: "Angi is a US-based website and mobile app that allows users to research, hire, rate, and review local service professionals such as contractors, plumbers, and more.",
      ownerId: userId,
      categoryId: homeServicesCategoryId,
      city: "Indianapolis",
      state: "Indiana",
      address: "130 E Washington St",
      zipCode: "46204",
      phone: "+1-877-944-2644",
      email: "memberservices@angi.com",
      website: "https://www.angi.com",
      image: "https://static.angi.com/assets/img/redesign/angi-media-card.png",
      likeCount: 48,
      commentCount: 14,
      rating: 4,
      isVerified: true,
      isActive: true,
      isPaid: true,
      featured: true
    });
    
    // Education
    this.addBusiness({
      name: "Khan Academy",
      description: "Khan Academy is an American non-profit educational organization created in 2008 by Sal Khan, with the goal of creating a set of online tools that help educate students.",
      ownerId: userId,
      categoryId: educationCategoryId,
      city: "Mountain View",
      state: "California",
      address: "PO Box 1630",
      zipCode: "94042",
      phone: "+1-650-429-3939",
      email: "support@khanacademy.org",
      website: "https://www.khanacademy.org",
      image: "https://cdn.kastatic.org/images/khan-logo-dark-background.new.png",
      likeCount: 156,
      commentCount: 68,
      rating: 5,
      isVerified: true,
      isActive: true,
      isPaid: false
    });
    
    this.addBusiness({
      name: "Coursera",
      description: "Coursera Inc. is a U.S.-based massive open online course provider founded in 2012 by Stanford University computer science professors Andrew Ng and Daphne Koller.",
      ownerId: userId,
      categoryId: educationCategoryId,
      city: "Mountain View",
      state: "California",
      address: "381 E. Evelyn Avenue",
      zipCode: "94041",
      phone: "+1-650-963-9884",
      email: "support@coursera.org",
      website: "https://www.coursera.org",
      image: "https://about.coursera.org/images/logos/coursera-logo-full-rgb.png",
      likeCount: 132,
      commentCount: 54,
      rating: 4,
      isVerified: true,
      isActive: true,
      isPaid: false
    });
  }
  
  private addBusiness(data: {
    name: string;
    description: string;
    ownerId: number;
    categoryId: number;
    city: string;
    state: string;
    address: string;
    zipCode: string;
    phone: string;
    email: string;
    website: string;
    image: string;
    likeCount: number;
    commentCount: number;
    rating: number;
    isVerified: boolean;
    isActive: boolean;
    isPaid: boolean;
    featured?: boolean;
  }): void {
    const { featured, ...businessData } = data;
    const id = this.businessId++;
    const now = new Date();
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(now.getMonth() + 1);
    
    // Create the business
    const business: Business = {
      ...businessData,
      id,
      status: "active",
      createdAt: now,
      updatedAt: now,
      subscriptionId: null,
      subscriptionExpiresAt: data.isPaid ? oneMonthLater : null,
      metaData: null
    };
    
    this.businesses.set(id, business);
    
    // Update category business count
    const category = this.categories.get(business.categoryId);
    if (category) {
      this.updateCategoryCount(category.id, (category.businessCount || 0) + 1);
    }
    
    // If business is paid, create a subscription
    if (data.isPaid) {
      const subscriptionId = this.subscriptionId++;
      const subscription: Subscription = {
        id: subscriptionId,
        businessId: id,
        userId: data.ownerId,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        paypalOrderId: null,
        status: "active",
        priceId: "derra_monthly_listing",
        currentPeriodStart: now,
        currentPeriodEnd: oneMonthLater,
        createdAt: now
      };
      
      this.subscriptions.set(subscriptionId, subscription);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { 
      ...insertUser, 
      id, 
      name: insertUser.name || null,
      avatar: insertUser.avatar || null,
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const category: Category = { ...insertCategory, id, businessCount: 0 };
    this.categories.set(id, category);
    return category;
  }

  async updateCategoryCount(id: number, count: number): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    
    const updatedCategory = { ...category, businessCount: count };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  // Business methods
  async getBusinesses(filters?: Partial<Business>): Promise<Business[]> {
    let businesses = Array.from(this.businesses.values());
    
    if (filters) {
      businesses = businesses.filter(business => {
        return Object.keys(filters).every(key => {
          // @ts-ignore
          return filters[key] === business[key];
        });
      });
    }
    
    return businesses;
  }

  async getBusinessById(id: number): Promise<Business | undefined> {
    return this.businesses.get(id);
  }

  async getBusinessesByOwnerId(ownerId: number): Promise<Business[]> {
    return Array.from(this.businesses.values()).filter(
      (business) => business.ownerId === ownerId
    );
  }

  async getFeaturedBusinesses(limit: number = 4): Promise<Business[]> {
    return Array.from(this.businesses.values())
      .filter(business => business.isPaid && business.isActive)
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);
  }

  async getTrendingBusinesses(limit: number = 4): Promise<Business[]> {
    return Array.from(this.businesses.values())
      .filter(business => business.isActive)
      .sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
      .slice(0, limit);
  }

  async getRecentBusinesses(limit: number = 4): Promise<Business[]> {
    return Array.from(this.businesses.values())
      .filter(business => business.isActive)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async getBusinessesByCategory(categoryId: number): Promise<Business[]> {
    return Array.from(this.businesses.values()).filter(
      (business) => business.categoryId === categoryId && business.isActive
    );
  }

  async createBusiness(insertBusiness: InsertBusiness): Promise<Business> {
    const id = this.businessId++;
    const now = new Date();
    const business: Business = { 
      ...insertBusiness, 
      id, 
      likeCount: 0, 
      commentCount: 0, 
      rating: 0,
      isVerified: false,
      isActive: true,
      isPaid: false,
      status: "pending",
      createdAt: now,
      updatedAt: now
    };
    
    this.businesses.set(id, business);
    
    // Update category business count
    const category = this.categories.get(business.categoryId);
    if (category) {
      this.updateCategoryCount(category.id, (category.businessCount || 0) + 1);
    }
    
    return business;
  }

  async updateBusiness(id: number, businessData: Partial<Business>): Promise<Business | undefined> {
    const business = this.businesses.get(id);
    if (!business) return undefined;
    
    const updatedBusiness = { 
      ...business, 
      ...businessData,
      updatedAt: new Date()
    };
    
    this.businesses.set(id, updatedBusiness);
    return updatedBusiness;
  }

  async deleteBusiness(id: number): Promise<boolean> {
    const business = this.businesses.get(id);
    if (!business) return false;
    
    // Instead of deleting, mark as inactive
    business.isActive = false;
    this.businesses.set(id, business);
    
    // Update category business count
    const category = this.categories.get(business.categoryId);
    if (category) {
      this.updateCategoryCount(category.id, Math.max(0, (category.businessCount || 0) - 1));
    }
    
    return true;
  }

  async searchBusinesses(query: string): Promise<Business[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.businesses.values()).filter(business => 
      business.isActive && (
        business.name.toLowerCase().includes(lowerQuery) ||
        business.description.toLowerCase().includes(lowerQuery) ||
        business.city.toLowerCase().includes(lowerQuery) ||
        business.state.toLowerCase().includes(lowerQuery)
      )
    );
  }

  // Business Likes methods
  async getLikesByBusinessId(businessId: number): Promise<BusinessLike[]> {
    return Array.from(this.businessLikes.values()).filter(
      (like) => like.businessId === businessId
    );
  }
  
  async getLikesByUserId(userId: number): Promise<BusinessLike[]> {
    return Array.from(this.businessLikes.values()).filter(
      (like) => like.userId === userId
    );
  }

  async getLikeByUserAndBusiness(userId: number, businessId: number): Promise<BusinessLike | undefined> {
    return Array.from(this.businessLikes.values()).find(
      (like) => like.userId === userId && like.businessId === businessId
    );
  }

  async createBusinessLike(insertLike: InsertBusinessLike): Promise<BusinessLike> {
    const id = this.likeId++;
    const like: BusinessLike = { ...insertLike, id, createdAt: new Date() };
    this.businessLikes.set(id, like);
    
    // Update business like count
    const business = this.businesses.get(like.businessId);
    if (business) {
      business.likeCount = (business.likeCount || 0) + 1;
      this.businesses.set(business.id, business);
    }
    
    return like;
  }

  async deleteBusinessLike(userId: number, businessId: number): Promise<boolean> {
    const like = Array.from(this.businessLikes.values()).find(
      (like) => like.userId === userId && like.businessId === businessId
    );
    
    if (!like) return false;
    
    this.businessLikes.delete(like.id);
    
    // Update business like count
    const business = this.businesses.get(businessId);
    if (business) {
      business.likeCount = Math.max(0, (business.likeCount || 0) - 1);
      this.businesses.set(business.id, business);
    }
    
    return true;
  }

  // Business Comments methods
  async getCommentsByBusinessId(businessId: number): Promise<BusinessComment[]> {
    return Array.from(this.businessComments.values())
      .filter((comment) => comment.businessId === businessId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createBusinessComment(insertComment: InsertBusinessComment): Promise<BusinessComment> {
    const id = this.commentId++;
    const comment: BusinessComment = { 
      ...insertComment, 
      id, 
      rating: insertComment.rating || null,
      createdAt: new Date() 
    };
    this.businessComments.set(id, comment);
    
    // Update business comment count
    const business = this.businesses.get(comment.businessId);
    if (business) {
      business.commentCount = (business.commentCount || 0) + 1;
      
      // Update rating if provided
      if (comment.rating) {
        const comments = await this.getCommentsByBusinessId(business.id);
        const totalRating = comments.reduce((total, c) => total + (c.rating || 0), 0);
        const avgRating = Math.round(totalRating / comments.length);
        business.rating = avgRating;
      }
      
      this.businesses.set(business.id, business);
    }
    
    return comment;
  }

  // Subscription methods
  async getSubscriptionByBusinessId(businessId: number): Promise<Subscription | undefined> {
    return Array.from(this.subscriptions.values()).find(
      (sub) => sub.businessId === businessId
    );
  }
  
  async getSubscriptionsByPayPalOrderId(paypalOrderId: string): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values()).filter(
      (sub) => sub.paypalOrderId === paypalOrderId
    );
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const id = this.subscriptionId++;
    const subscription: Subscription = { 
      ...insertSubscription, 
      id, 
      stripeCustomerId: insertSubscription.stripeCustomerId || null,
      stripeSubscriptionId: insertSubscription.stripeSubscriptionId || null,
      paypalOrderId: insertSubscription.paypalOrderId || null,
      currentPeriodStart: insertSubscription.currentPeriodStart || null,
      currentPeriodEnd: insertSubscription.currentPeriodEnd || null,
      createdAt: new Date() 
    };
    this.subscriptions.set(id, subscription);
    
    // Update business isPaid status
    const business = this.businesses.get(subscription.businessId);
    if (business) {
      business.isPaid = true;
      business.subscriptionId = subscription.stripeSubscriptionId;
      business.subscriptionExpiresAt = subscription.currentPeriodEnd;
      business.status = "active";
      this.businesses.set(business.id, business);
    }
    
    return subscription;
  }

  async updateSubscription(id: number, subscriptionData: Partial<Subscription>): Promise<Subscription | undefined> {
    const subscription = this.subscriptions.get(id);
    if (!subscription) return undefined;
    
    const updatedSubscription = { ...subscription, ...subscriptionData };
    this.subscriptions.set(id, updatedSubscription);
    
    // Update business subscription info if needed
    if (
      subscriptionData.status === 'canceled' || 
      subscriptionData.currentPeriodEnd
    ) {
      const business = this.businesses.get(subscription.businessId);
      if (business) {
        if (subscriptionData.status === 'canceled') {
          business.isPaid = false;
          business.status = "inactive";
        }
        if (subscriptionData.currentPeriodEnd) {
          business.subscriptionExpiresAt = subscriptionData.currentPeriodEnd;
        }
        this.businesses.set(business.id, business);
      }
    }
    
    return updatedSubscription;
  }
  
  // Message methods
  async getMessageById(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getMessagesByBusinessId(businessId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => message.businessId === businessId
    );
  }

  async getMessagesByUserId(userId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => message.senderId === userId || message.receiverId === userId
    );
  }

  async getMessagesBetweenUsers(senderId: number, receiverId: number, businessId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => (
        (message.senderId === senderId && message.receiverId === receiverId) ||
        (message.senderId === receiverId && message.receiverId === senderId)
      ) && message.businessId === businessId
    ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageId++;
    const message: Message = {
      ...insertMessage,
      id,
      isRead: false,
      createdAt: new Date()
    };
    
    this.messages.set(id, message);
    
    // Create notification for the receiver
    this.createNotification({
      userId: message.receiverId,
      type: "message",
      content: `You have a new message regarding a business`,
      relatedId: id
    });
    
    return message;
  }

  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const message = this.messages.get(id);
    if (!message) return undefined;
    
    const updatedMessage = { ...message, isRead: true };
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }

  // Notification methods
  async getNotificationById(id: number): Promise<Notification | undefined> {
    return this.notifications.get(id);
  }

  async getNotificationsByUserId(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getUnreadNotificationsCount(userId: number): Promise<number> {
    return Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId && !notification.isRead)
      .length;
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.notificationId++;
    const notification: Notification = {
      ...insertNotification,
      id,
      isRead: false,
      createdAt: new Date()
    };
    
    this.notifications.set(id, notification);
    return notification;
  }

  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    if (!notification) return undefined;
    
    const updatedNotification = { ...notification, isRead: true };
    this.notifications.set(id, updatedNotification);
    return updatedNotification;
  }

  async markAllNotificationsAsRead(userId: number): Promise<boolean> {
    const userNotifications = Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId && !notification.isRead);
    
    userNotifications.forEach(notification => {
      this.notifications.set(notification.id, { ...notification, isRead: true });
    });
    
    return true;
  }
}

import { createStorage } from "./storageFactory";

// Use the factory to create the storage implementation
export const storage = createStorage();
