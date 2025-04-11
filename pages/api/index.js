// Standalone API route for Vercel (Next.js format)
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

// Create Express instance
const app = express();

// Configure middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple memory session store
app.use(session({
  secret: process.env.SESSION_SECRET || 'derra-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

// Set up Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure local strategy with demo user
passport.use(new LocalStrategy((username, password, done) => {
  if (username === 'demo_user' && password === 'password123') {
    return done(null, { 
      id: 1, 
      username: 'demo_user',
      email: 'demo@example.com',
      name: 'Demo User'
    });
  }
  return done(null, false, { message: 'Invalid username or password' });
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  if (id === 1) {
    done(null, { 
      id: 1, 
      username: 'demo_user',
      email: 'demo@example.com',
      name: 'Demo User'
    });
  } else {
    done(null, null);
  }
});

// Define demo data
const categories = [
  { id: 1, name: 'Technology', icon: 'ri-computer-line', businessCount: 5 },
  { id: 2, name: 'Food & Dining', icon: 'ri-restaurant-line', businessCount: 8 },
  { id: 3, name: 'Health & Wellness', icon: 'ri-heart-pulse-line', businessCount: 4 },
  { id: 4, name: 'Beauty & Spa', icon: 'ri-sparkles-line', businessCount: 3 },
  { id: 5, name: 'Home Services', icon: 'ri-home-gear-line', businessCount: 6 }
];

const featuredBusinesses = [
  { id: 1, name: 'Tech Solutions', category: 'Technology', image: '', featured: true, description: 'IT services and support' },
  { id: 2, name: 'Gourmet Delights', category: 'Food & Dining', image: '', featured: true, description: 'Fine dining experience' },
  { id: 3, name: 'Zen Spa', category: 'Beauty & Spa', image: '', featured: true, description: 'Relaxation and wellness' },
  { id: 4, name: 'Fitness First', category: 'Health & Wellness', image: '', featured: true, description: 'Personal training and fitness' }
];

const trendingBusinesses = [
  { id: 5, name: 'Web Masters', category: 'Technology', image: '', trending: true, description: 'Web development and design' },
  { id: 6, name: 'Sushi Express', category: 'Food & Dining', image: '', trending: true, description: 'Authentic Japanese cuisine' },
  { id: 7, name: 'Clean & Clear', category: 'Home Services', image: '', trending: true, description: 'Professional cleaning services' },
  { id: 8, name: 'Dental Care', category: 'Health & Wellness', image: '', trending: true, description: 'Family dental services' }
];

const recentBusinesses = [
  { id: 9, name: 'Marketing Pro', category: 'Technology', image: '', recent: true, description: 'Digital marketing services' },
  { id: 10, name: 'Pet Paradise', category: 'Pet Services', image: '', recent: true, description: 'Pet grooming and care' },
  { id: 11, name: 'Auto Experts', category: 'Automotive', image: '', recent: true, description: 'Car repair and maintenance' },
  { id: 12, name: 'Learning Center', category: 'Education', image: '', recent: true, description: 'Tutoring and education' }
];

// API Routes
app.get('/api', (req, res) => {
  res.json({ name: 'Derra API', status: 'online', version: '1.0' });
});

app.post('/api/auth/login', passport.authenticate('local'), (req, res) => {
  res.json(req.user);
});

app.post('/api/auth/logout', (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: err.message });
    res.sendStatus(200);
  });
});

app.get('/api/me', (req, res) => {
  if (req.isAuthenticated()) {
    return res.json(req.user);
  }
  res.status(401).json({ message: 'Not logged in' });
});

app.get('/api/categories', (req, res) => {
  res.json(categories);
});

app.get('/api/businesses/featured', (req, res) => {
  res.json(featuredBusinesses);
});

app.get('/api/businesses/trending', (req, res) => {
  res.json(trendingBusinesses);
});

app.get('/api/businesses/recent', (req, res) => {
  res.json(recentBusinesses);
});

// Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    session: req.session ? true : false,
    authenticated: req.isAuthenticated(),
    user: req.user || null
  });
});

// Next.js API handler
export default function handler(req, res) {
  return app(req, res);
}