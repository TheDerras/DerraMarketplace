import { db } from "./db";
import { 
  users, categories, businesses, businessLikes, businessComments, subscriptions, messages, notifications,
  type User, type InsertUser,
  type Category, type InsertCategory,
  type Business, type InsertBusiness,
  type BusinessLike, type InsertBusinessLike,
  type BusinessComment, type InsertBusinessComment,
  type Subscription, type InsertSubscription,
  type Message, type InsertMessage,
  type Notification, type InsertNotification
} from "@shared/schema";
import { eq, desc, and, like, or, count } from "drizzle-orm";
import { IStorage } from "./storageInterface";

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db.update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return db.select().from(categories);
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }

  async updateCategoryCount(id: number, count: number): Promise<Category | undefined> {
    const [updatedCategory] = await db.update(categories)
      .set({ businessCount: count })
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory;
  }

  // Business methods
  async getBusinesses(filters?: Partial<Business>): Promise<Business[]> {
    if (!filters) {
      return db.select().from(businesses);
    }

    const whereConditions = Object.entries(filters).map(([key, value]) => {
      return eq(businesses[key as keyof typeof businesses], value as any);
    });

    return db.select()
      .from(businesses)
      .where(and(...whereConditions));
  }

  async getBusinessById(id: number): Promise<Business | undefined> {
    const [business] = await db.select().from(businesses).where(eq(businesses.id, id));
    return business;
  }

  async getBusinessesByOwnerId(ownerId: number): Promise<Business[]> {
    return db.select()
      .from(businesses)
      .where(eq(businesses.ownerId, ownerId));
  }

  async getFeaturedBusinesses(limit: number = 4): Promise<Business[]> {
    return db.select()
      .from(businesses)
      .where(and(
        eq(businesses.isPaid, true),
        eq(businesses.isActive, true)
      ))
      .limit(limit);
  }

  async getTrendingBusinesses(limit: number = 4): Promise<Business[]> {
    return db.select()
      .from(businesses)
      .where(eq(businesses.isActive, true))
      .orderBy(desc(businesses.likeCount))
      .limit(limit);
  }

  async getRecentBusinesses(limit: number = 4): Promise<Business[]> {
    return db.select()
      .from(businesses)
      .where(eq(businesses.isActive, true))
      .orderBy(desc(businesses.createdAt))
      .limit(limit);
  }

  async getBusinessesByCategory(categoryId: number): Promise<Business[]> {
    return db.select()
      .from(businesses)
      .where(and(
        eq(businesses.categoryId, categoryId),
        eq(businesses.isActive, true)
      ));
  }

  async createBusiness(insertBusiness: InsertBusiness): Promise<Business> {
    const now = new Date();
    const businessWithDefaults = {
      ...insertBusiness,
      likeCount: 0,
      commentCount: 0,
      rating: 0,
      isVerified: false,
      isActive: true,
      isPaid: false,
      status: "pending",
      createdAt: now,
      updatedAt: now,
      subscriptionId: null,
      subscriptionExpiresAt: null
    };

    const [business] = await db.insert(businesses).values(businessWithDefaults).returning();

    // Update category business count
    const [category] = await db.select().from(categories).where(eq(categories.id, business.categoryId));
    if (category) {
      await this.updateCategoryCount(category.id, (category.businessCount || 0) + 1);
    }

    return business;
  }

  async updateBusiness(id: number, businessData: Partial<Business>): Promise<Business | undefined> {
    const [updatedBusiness] = await db.update(businesses)
      .set({
        ...businessData,
        updatedAt: new Date()
      })
      .where(eq(businesses.id, id))
      .returning();
    return updatedBusiness;
  }

  async deleteBusiness(id: number): Promise<boolean> {
    const [business] = await db.select().from(businesses).where(eq(businesses.id, id));
    if (!business) return false;

    // Instead of deleting, mark as inactive
    await db.update(businesses)
      .set({ isActive: false })
      .where(eq(businesses.id, id));

    // Update category business count
    const [category] = await db.select().from(categories).where(eq(categories.id, business.categoryId));
    if (category) {
      await this.updateCategoryCount(category.id, Math.max(0, (category.businessCount || 0) - 1));
    }

    return true;
  }

  async searchBusinesses(query: string): Promise<Business[]> {
    const searchTerm = `%${query.toLowerCase()}%`;
    
    return db.select()
      .from(businesses)
      .where(and(
        eq(businesses.isActive, true),
        or(
          like(businesses.name, searchTerm),
          like(businesses.description, searchTerm),
          like(businesses.city, searchTerm),
          like(businesses.state, searchTerm)
        )
      ));
  }

  // Business Likes methods
  async getLikesByBusinessId(businessId: number): Promise<BusinessLike[]> {
    return db.select()
      .from(businessLikes)
      .where(eq(businessLikes.businessId, businessId));
  }

  async getLikesByUserId(userId: number): Promise<BusinessLike[]> {
    return db.select()
      .from(businessLikes)
      .where(eq(businessLikes.userId, userId));
  }

  async getLikeByUserAndBusiness(userId: number, businessId: number): Promise<BusinessLike | undefined> {
    const [like] = await db.select()
      .from(businessLikes)
      .where(and(
        eq(businessLikes.userId, userId),
        eq(businessLikes.businessId, businessId)
      ));
    return like;
  }

  async createBusinessLike(insertLike: InsertBusinessLike): Promise<BusinessLike> {
    const [like] = await db.insert(businessLikes)
      .values({ ...insertLike, createdAt: new Date() })
      .returning();

    // Update business like count
    const [business] = await db.select().from(businesses).where(eq(businesses.id, like.businessId));
    if (business) {
      const newLikeCount = (business.likeCount || 0) + 1;
      await db.update(businesses)
        .set({ likeCount: newLikeCount })
        .where(eq(businesses.id, business.id));
    }

    return like;
  }

  async deleteBusinessLike(userId: number, businessId: number): Promise<boolean> {
    const [like] = await db.select()
      .from(businessLikes)
      .where(and(
        eq(businessLikes.userId, userId),
        eq(businessLikes.businessId, businessId)
      ));

    if (!like) return false;

    await db.delete(businessLikes).where(eq(businessLikes.id, like.id));

    // Update business like count
    const [business] = await db.select().from(businesses).where(eq(businesses.id, businessId));
    if (business) {
      const newLikeCount = Math.max(0, (business.likeCount || 0) - 1);
      await db.update(businesses)
        .set({ likeCount: newLikeCount })
        .where(eq(businesses.id, business.id));
    }

    return true;
  }

  // Business Comments methods
  async getCommentsByBusinessId(businessId: number): Promise<BusinessComment[]> {
    return db.select()
      .from(businessComments)
      .where(eq(businessComments.businessId, businessId))
      .orderBy(desc(businessComments.createdAt));
  }

  async createBusinessComment(insertComment: InsertBusinessComment): Promise<BusinessComment> {
    const [comment] = await db.insert(businessComments)
      .values({ 
        ...insertComment, 
        rating: insertComment.rating || null,
        createdAt: new Date() 
      })
      .returning();

    // Update business comment count and rating
    const [business] = await db.select().from(businesses).where(eq(businesses.id, comment.businessId));
    if (business) {
      const newCommentCount = (business.commentCount || 0) + 1;
      const updates: Partial<Business> = { commentCount: newCommentCount };
      
      // Update rating if provided
      if (comment.rating) {
        const comments = await this.getCommentsByBusinessId(business.id);
        const totalRating = comments.reduce((total, c) => total + (c.rating || 0), 0);
        const avgRating = Math.round(totalRating / comments.length);
        updates.rating = avgRating;
      }
      
      await db.update(businesses)
        .set(updates)
        .where(eq(businesses.id, business.id));
    }

    return comment;
  }

  // Subscription methods
  async getSubscriptionByBusinessId(businessId: number): Promise<Subscription | undefined> {
    const [subscription] = await db.select()
      .from(subscriptions)
      .where(eq(subscriptions.businessId, businessId));
    return subscription;
  }
  
  async getSubscriptionsByPayPalOrderId(paypalOrderId: string): Promise<Subscription[]> {
    return db.select()
      .from(subscriptions)
      .where(eq(subscriptions.paypalOrderId, paypalOrderId));
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const [subscription] = await db.insert(subscriptions)
      .values({
        ...insertSubscription,
        stripeCustomerId: insertSubscription.stripeCustomerId || null,
        stripeSubscriptionId: insertSubscription.stripeSubscriptionId || null,
        paypalOrderId: insertSubscription.paypalOrderId || null,
        currentPeriodStart: insertSubscription.currentPeriodStart || null,
        currentPeriodEnd: insertSubscription.currentPeriodEnd || null,
        createdAt: new Date()
      })
      .returning();

    // Update business isPaid status
    const [business] = await db.select().from(businesses).where(eq(businesses.id, subscription.businessId));
    if (business) {
      await db.update(businesses)
        .set({
          isPaid: true,
          subscriptionId: subscription.stripeSubscriptionId,
          subscriptionExpiresAt: subscription.currentPeriodEnd,
          status: "active"
        })
        .where(eq(businesses.id, business.id));
    }

    return subscription;
  }

  async updateSubscription(id: number, subscriptionData: Partial<Subscription>): Promise<Subscription | undefined> {
    const [updatedSubscription] = await db.update(subscriptions)
      .set(subscriptionData)
      .where(eq(subscriptions.id, id))
      .returning();
    
    if (!updatedSubscription) return undefined;

    // Update business subscription info if needed
    if (
      subscriptionData.status === 'canceled' || 
      subscriptionData.currentPeriodEnd
    ) {
      const updates: Partial<Business> = {};
      
      if (subscriptionData.status === 'canceled') {
        updates.isPaid = false;
        updates.status = "inactive";
      }
      
      if (subscriptionData.currentPeriodEnd) {
        updates.subscriptionExpiresAt = subscriptionData.currentPeriodEnd;
      }
      
      if (Object.keys(updates).length > 0) {
        await db.update(businesses)
          .set(updates)
          .where(eq(businesses.id, updatedSubscription.businessId));
      }
    }

    return updatedSubscription;
  }

  // Message methods
  async getMessageById(id: number): Promise<Message | undefined> {
    const [message] = await db.select()
      .from(messages)
      .where(eq(messages.id, id));
    return message;
  }

  async getMessagesByBusinessId(businessId: number): Promise<Message[]> {
    return db.select()
      .from(messages)
      .where(eq(messages.businessId, businessId));
  }

  async getMessagesByUserId(userId: number): Promise<Message[]> {
    return db.select()
      .from(messages)
      .where(or(
        eq(messages.senderId, userId),
        eq(messages.receiverId, userId)
      ));
  }

  async getMessagesBetweenUsers(senderId: number, receiverId: number, businessId: number): Promise<Message[]> {
    return db.select()
      .from(messages)
      .where(and(
        eq(messages.businessId, businessId),
        or(
          and(
            eq(messages.senderId, senderId),
            eq(messages.receiverId, receiverId)
          ),
          and(
            eq(messages.senderId, receiverId),
            eq(messages.receiverId, senderId)
          )
        )
      ))
      .orderBy(messages.createdAt);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages)
      .values({
        ...insertMessage,
        isRead: false,
        createdAt: new Date()
      })
      .returning();
    
    // Create notification for the receiver
    await this.createNotification({
      userId: message.receiverId,
      type: "message",
      content: `You have a new message regarding a business`,
      relatedId: message.id
    });
    
    return message;
  }

  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const [updatedMessage] = await db.update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, id))
      .returning();
    return updatedMessage;
  }

  // Notification methods
  async getNotificationById(id: number): Promise<Notification | undefined> {
    const [notification] = await db.select()
      .from(notifications)
      .where(eq(notifications.id, id));
    return notification;
  }

  async getNotificationsByUserId(userId: number): Promise<Notification[]> {
    return db.select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async getUnreadNotificationsCount(userId: number): Promise<number> {
    const result = await db.select({ count: count() })
      .from(notifications)
      .where(and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, false)
      ));
    
    return result[0]?.count || 0;
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const [notification] = await db.insert(notifications)
      .values({
        ...insertNotification,
        isRead: false,
        createdAt: new Date()
      })
      .returning();
    
    return notification;
  }

  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const [updatedNotification] = await db.update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id))
      .returning();
    return updatedNotification;
  }

  async markAllNotificationsAsRead(userId: number): Promise<boolean> {
    await db.update(notifications)
      .set({ isRead: true })
      .where(and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, false)
      ));
    
    return true;
  }
}