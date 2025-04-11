import { db } from "../db";
import { 
  users, categories, businesses, subscriptions
} from "@shared/schema";
import { eq, count } from "drizzle-orm";

async function seedDatabase() {
  console.log("Seeding database...");
  
  try {
    // 1. First add categories
    console.log("Adding categories...");
    const defaultCategories = [
      { name: "Retail", icon: "ri-store-2-line", businessCount: 0 },
      { name: "Food & Dining", icon: "ri-restaurant-line", businessCount: 0 },
      { name: "Professional", icon: "ri-briefcase-4-line", businessCount: 0 },
      { name: "Healthcare", icon: "ri-heart-pulse-line", businessCount: 0 },
      { name: "Home Services", icon: "ri-home-4-line", businessCount: 0 },
      { name: "Education", icon: "ri-graduation-cap-line", businessCount: 0 }
    ];
    
    await db.insert(categories).values(defaultCategories);
    console.log("Categories added successfully");
    
    // 2. Add demo user
    console.log("Adding demo user...");
    const demoUser = {
      username: "demo_user",
      password: "password123",
      email: "demo@derraplatform.com",
      name: "Demo User",
      avatar: null,
      createdAt: new Date()
    };
    
    const [user] = await db.insert(users).values(demoUser).returning();
    console.log("Demo user added with ID:", user.id);
    
    // 3. Get category IDs for reference
    const allCategories = await db.select().from(categories);
    const categoryMap = new Map(allCategories.map(cat => [cat.name, cat.id]));
    
    // 4. Add real businesses
    console.log("Adding businesses...");
    const now = new Date();
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(now.getMonth() + 1);
    
    // Retail - Target (Featured)
    const [target] = await db.insert(businesses).values({
      name: "Target",
      description: "Target Corporation is an American retail corporation. It is the 8th-largest retailer in the United States, operating over 1,900 stores throughout the country.",
      ownerId: user.id,
      categoryId: categoryMap.get("Retail") || 1,
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
      status: "active",
      createdAt: now,
      updatedAt: now,
      subscriptionId: null,
      subscriptionExpiresAt: oneMonthLater,
      metaData: null,
      tags: null
    }).returning();
    
    // Create subscription for Target
    await db.insert(subscriptions).values({
      businessId: target.id,
      userId: user.id,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      paypalOrderId: null,
      status: "active",
      priceId: "derra_monthly_listing",
      currentPeriodStart: now,
      currentPeriodEnd: oneMonthLater,
      createdAt: now
    });
    
    // Retail - Walmart
    await db.insert(businesses).values({
      name: "Walmart",
      description: "Walmart Inc. is an American multinational retail corporation that operates a chain of supercenters, discount department stores, and grocery stores across the United States.",
      ownerId: user.id,
      categoryId: categoryMap.get("Retail") || 1,
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
      isPaid: false,
      status: "active",
      createdAt: now,
      updatedAt: now,
      subscriptionId: null,
      subscriptionExpiresAt: null,
      metaData: null,
      tags: null
    });
    
    // Food & Dining - Starbucks (Featured)
    const [starbucks] = await db.insert(businesses).values({
      name: "Starbucks",
      description: "Starbucks Corporation is an American multinational chain of coffeehouses and roastery reserves. It is the world's largest coffeehouse chain.",
      ownerId: user.id,
      categoryId: categoryMap.get("Food & Dining") || 2,
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
      status: "active",
      createdAt: now,
      updatedAt: now,
      subscriptionId: null,
      subscriptionExpiresAt: oneMonthLater,
      metaData: null,
      tags: null
    }).returning();
    
    // Create subscription for Starbucks
    await db.insert(subscriptions).values({
      businessId: starbucks.id,
      userId: user.id,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      paypalOrderId: null,
      status: "active",
      priceId: "derra_monthly_listing",
      currentPeriodStart: now,
      currentPeriodEnd: oneMonthLater,
      createdAt: now
    });
    
    // Food & Dining - Chipotle
    await db.insert(businesses).values({
      name: "Chipotle Mexican Grill",
      description: "Chipotle Mexican Grill, Inc. is an American chain of fast casual restaurants specializing in bowls, tacos and Mission burritos made to order in front of the customer.",
      ownerId: user.id,
      categoryId: categoryMap.get("Food & Dining") || 2,
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
      isPaid: false,
      status: "active",
      createdAt: now,
      updatedAt: now,
      subscriptionId: null,
      subscriptionExpiresAt: null,
      metaData: null,
      tags: null
    });
    
    // Professional - H&R Block (Featured)
    const [hrBlock] = await db.insert(businesses).values({
      name: "H&R Block",
      description: "H&R Block, Inc. is an American tax preparation company operating in North America, Australia, and India. The company was founded in 1955 and has prepared more than 800 million tax returns.",
      ownerId: user.id,
      categoryId: categoryMap.get("Professional") || 3,
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
      status: "active",
      createdAt: now,
      updatedAt: now,
      subscriptionId: null,
      subscriptionExpiresAt: oneMonthLater,
      metaData: null,
      tags: null
    }).returning();
    
    // Create subscription for H&R Block
    await db.insert(subscriptions).values({
      businessId: hrBlock.id,
      userId: user.id,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      paypalOrderId: null,
      status: "active",
      priceId: "derra_monthly_listing",
      currentPeriodStart: now,
      currentPeriodEnd: oneMonthLater,
      createdAt: now
    });
    
    // Healthcare - Mayo Clinic (Featured)
    const [mayoClinic] = await db.insert(businesses).values({
      name: "Mayo Clinic",
      description: "Mayo Clinic is a nonprofit American academic medical center focused on integrated health care, education, and research. It employs over 4,500 physicians and scientists, along with 58,400 administrative and allied health staff.",
      ownerId: user.id,
      categoryId: categoryMap.get("Healthcare") || 4,
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
      status: "active",
      createdAt: now,
      updatedAt: now,
      subscriptionId: null,
      subscriptionExpiresAt: oneMonthLater,
      metaData: null,
      tags: null
    }).returning();
    
    // Create subscription for Mayo Clinic
    await db.insert(subscriptions).values({
      businessId: mayoClinic.id,
      userId: user.id,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      paypalOrderId: null,
      status: "active",
      priceId: "derra_monthly_listing",
      currentPeriodStart: now,
      currentPeriodEnd: oneMonthLater,
      createdAt: now
    });
    
    // Healthcare - Cleveland Clinic
    await db.insert(businesses).values({
      name: "Cleveland Clinic",
      description: "Cleveland Clinic is a nonprofit multispecialty academic medical center that integrates clinical and hospital care with research and education.",
      ownerId: user.id,
      categoryId: categoryMap.get("Healthcare") || 4,
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
      isPaid: false,
      status: "active",
      createdAt: now,
      updatedAt: now,
      subscriptionId: null,
      subscriptionExpiresAt: null,
      metaData: null,
      tags: null
    });
    
    // Home Services - Angi (Featured)
    const [angi] = await db.insert(businesses).values({
      name: "Angi (formerly Angie's List)",
      description: "Angi is a US-based website and mobile app that allows users to research, hire, rate, and review local service professionals such as contractors, plumbers, and more.",
      ownerId: user.id,
      categoryId: categoryMap.get("Home Services") || 5,
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
      status: "active",
      createdAt: now,
      updatedAt: now,
      subscriptionId: null,
      subscriptionExpiresAt: oneMonthLater,
      metaData: null,
      tags: null
    }).returning();
    
    // Create subscription for Angi
    await db.insert(subscriptions).values({
      businessId: angi.id,
      userId: user.id,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      paypalOrderId: null,
      status: "active",
      priceId: "derra_monthly_listing",
      currentPeriodStart: now,
      currentPeriodEnd: oneMonthLater,
      createdAt: now
    });
    
    // Education - Khan Academy
    await db.insert(businesses).values({
      name: "Khan Academy",
      description: "Khan Academy is an American non-profit educational organization created in 2008 by Sal Khan, with the goal of creating a set of online tools that help educate students.",
      ownerId: user.id,
      categoryId: categoryMap.get("Education") || 6,
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
      isPaid: false,
      status: "active",
      createdAt: now,
      updatedAt: now,
      subscriptionId: null,
      subscriptionExpiresAt: null,
      metaData: null,
      tags: null
    });
    
    // Education - Coursera
    await db.insert(businesses).values({
      name: "Coursera",
      description: "Coursera Inc. is a U.S.-based massive open online course provider founded in 2012 by Stanford University computer science professors Andrew Ng and Daphne Koller.",
      ownerId: user.id,
      categoryId: categoryMap.get("Education") || 6,
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
      isPaid: false,
      status: "active",
      createdAt: now,
      updatedAt: now,
      subscriptionId: null,
      subscriptionExpiresAt: null,
      metaData: null,
      tags: null
    });
    
    // 5. Update category counts
    for (const [name, id] of categoryMap.entries()) {
      const [countResult] = await db.select({ count: count() }).from(businesses).where(eq(businesses.categoryId, id));
      await db.update(categories).set({ businessCount: countResult.count || 0 }).where(eq(categories.id, id));
    }
    
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    process.exit(0);
  }
}

seedDatabase();