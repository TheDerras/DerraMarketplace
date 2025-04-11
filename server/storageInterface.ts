import { 
  type User, type InsertUser,
  type Category, type InsertCategory,
  type Business, type InsertBusiness,
  type BusinessLike, type InsertBusinessLike,
  type BusinessComment, type InsertBusinessComment,
  type Subscription, type InsertSubscription,
  type Message, type InsertMessage,
  type Notification, type InsertNotification
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Category methods
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategoryCount(id: number, count: number): Promise<Category | undefined>;
  
  // Business methods
  getBusinesses(filters?: Partial<Business>): Promise<Business[]>;
  getBusinessById(id: number): Promise<Business | undefined>;
  getBusinessesByOwnerId(ownerId: number): Promise<Business[]>;
  getFeaturedBusinesses(limit?: number): Promise<Business[]>;
  getTrendingBusinesses(limit?: number): Promise<Business[]>;
  getRecentBusinesses(limit?: number): Promise<Business[]>;
  getBusinessesByCategory(categoryId: number): Promise<Business[]>;
  createBusiness(business: InsertBusiness): Promise<Business>;
  updateBusiness(id: number, business: Partial<Business>): Promise<Business | undefined>;
  deleteBusiness(id: number): Promise<boolean>;
  searchBusinesses(query: string): Promise<Business[]>;
  
  // Business Likes methods
  getLikesByBusinessId(businessId: number): Promise<BusinessLike[]>;
  getLikesByUserId(userId: number): Promise<BusinessLike[]>;
  getLikeByUserAndBusiness(userId: number, businessId: number): Promise<BusinessLike | undefined>;
  createBusinessLike(like: InsertBusinessLike): Promise<BusinessLike>;
  deleteBusinessLike(userId: number, businessId: number): Promise<boolean>;
  
  // Business Comments methods
  getCommentsByBusinessId(businessId: number): Promise<BusinessComment[]>;
  createBusinessComment(comment: InsertBusinessComment): Promise<BusinessComment>;
  
  // Subscription methods
  getSubscriptionByBusinessId(businessId: number): Promise<Subscription | undefined>;
  getSubscriptionsByPayPalOrderId(paypalOrderId: string): Promise<Subscription[]>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(id: number, subscription: Partial<Subscription>): Promise<Subscription | undefined>;

  // Message methods
  getMessageById(id: number): Promise<Message | undefined>;
  getMessagesByBusinessId(businessId: number): Promise<Message[]>;
  getMessagesByUserId(userId: number): Promise<Message[]>;
  getMessagesBetweenUsers(senderId: number, receiverId: number, businessId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<Message | undefined>;

  // Notification methods
  getNotificationById(id: number): Promise<Notification | undefined>;
  getNotificationsByUserId(userId: number): Promise<Notification[]>;
  getUnreadNotificationsCount(userId: number): Promise<number>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification | undefined>;
  markAllNotificationsAsRead(userId: number): Promise<boolean>;
}