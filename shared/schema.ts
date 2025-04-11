import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name"),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  name: true,
  avatar: true,
});

// Business Categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  businessCount: integer("business_count").default(0),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  icon: true,
});

// Business Listings
export const businesses = pgTable("businesses", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  categoryId: integer("category_id").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  phone: text("phone"),
  website: text("website"),
  email: text("email"),
  image: text("image"),
  likeCount: integer("like_count").default(0),
  commentCount: integer("comment_count").default(0),
  rating: integer("rating").default(0),
  isVerified: boolean("is_verified").default(false),
  isActive: boolean("is_active").default(true),
  isPaid: boolean("is_paid").default(false),
  isRestaurant: boolean("is_restaurant").default(false),
  subscriptionId: text("subscription_id"),
  subscriptionExpiresAt: timestamp("subscription_expires_at"),
  status: text("status").default("pending"),
  tags: text("tags").array(),
  metaData: json("meta_data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBusinessSchema = createInsertSchema(businesses).pick({
  ownerId: true,
  name: true,
  description: true,
  categoryId: true,
  city: true,
  state: true,
  phone: true,
  website: true,
  email: true,
  image: true,
  isRestaurant: true,
  tags: true,
  metaData: true,
});

// Business Likes
export const businessLikes = pgTable("business_likes", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").notNull(),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBusinessLikeSchema = createInsertSchema(businessLikes).pick({
  businessId: true,
  userId: true,
});

// Business Comments/Reviews
export const businessComments = pgTable("business_comments", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").notNull(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  rating: integer("rating"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBusinessCommentSchema = createInsertSchema(businessComments).pick({
  businessId: true,
  userId: true,
  content: true,
  rating: true,
});

// Subscriptions
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").notNull(),
  userId: integer("user_id").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  paypalOrderId: text("paypal_order_id"),
  status: text("status").notNull(),
  priceId: text("price_id").notNull(),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).pick({
  businessId: true,
  userId: true,
  stripeCustomerId: true,
  stripeSubscriptionId: true,
  paypalOrderId: true,
  status: true,
  priceId: true,
  currentPeriodStart: true,
  currentPeriodEnd: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Business = typeof businesses.$inferSelect;
export type InsertBusiness = z.infer<typeof insertBusinessSchema>;

export type BusinessLike = typeof businessLikes.$inferSelect;
export type InsertBusinessLike = z.infer<typeof insertBusinessLikeSchema>;

export type BusinessComment = typeof businessComments.$inferSelect;
export type InsertBusinessComment = z.infer<typeof insertBusinessCommentSchema>;

// Messages for booking system
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull(),
  receiverId: integer("receiver_id").notNull(),
  businessId: integer("business_id").notNull(),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  senderId: true,
  receiverId: true,
  businessId: true,
  content: true,
});

// Notifications
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // "message", "like", "comment", etc.
  content: text("content").notNull(),
  relatedId: integer("related_id"), // ID of the related message/like/comment
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  userId: true,
  type: true,
  content: true,
  relatedId: true,
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
