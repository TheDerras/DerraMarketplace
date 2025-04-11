// Vercel specific server file for deployment
import express from 'express';
import { exec } from 'child_process';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files - serve the built client
app.use(express.static(path.join(__dirname, 'dist/public')));

// Simple demo API routes
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    vercel: true
  });
});

app.get('/api/categories', (req, res) => {
  const categories = [
    { id: 1, name: 'Technology', icon: 'ri-computer-line', businessCount: 5 },
    { id: 2, name: 'Food & Dining', icon: 'ri-restaurant-line', businessCount: 8 },
    { id: 3, name: 'Health & Wellness', icon: 'ri-heart-pulse-line', businessCount: 4 },
    { id: 4, name: 'Beauty & Spa', icon: 'ri-sparkles-line', businessCount: 3 },
    { id: 5, name: 'Home Services', icon: 'ri-home-gear-line', businessCount: 6 }
  ];
  
  res.json(categories);
});

app.get('/api/businesses/featured', (req, res) => {
  const businesses = [
    { id: 1, name: 'Tech Solutions', category: 'Technology', image: '', featured: true, description: 'IT services and support' },
    { id: 2, name: 'Gourmet Delights', category: 'Food & Dining', image: '', featured: true, description: 'Fine dining experience' },
    { id: 3, name: 'Zen Spa', category: 'Beauty & Spa', image: '', featured: true, description: 'Relaxation and wellness' },
    { id: 4, name: 'Fitness First', category: 'Health & Wellness', image: '', featured: true, description: 'Personal training and fitness' }
  ];
  
  res.json(businesses);
});

app.get('/api/businesses/trending', (req, res) => {
  const businesses = [
    { id: 5, name: 'Web Masters', category: 'Technology', image: '', trending: true, description: 'Web development and design' },
    { id: 6, name: 'Sushi Express', category: 'Food & Dining', image: '', trending: true, description: 'Authentic Japanese cuisine' },
    { id: 7, name: 'Clean & Clear', category: 'Home Services', image: '', trending: true, description: 'Professional cleaning services' },
    { id: 8, name: 'Dental Care', category: 'Health & Wellness', image: '', trending: true, description: 'Family dental services' }
  ];
  
  res.json(businesses);
});

app.get('/api/businesses/recent', (req, res) => {
  const businesses = [
    { id: 9, name: 'Marketing Pro', category: 'Technology', image: '', recent: true, description: 'Digital marketing services' },
    { id: 10, name: 'Pet Paradise', category: 'Pet Services', image: '', recent: true, description: 'Pet grooming and care' },
    { id: 11, name: 'Auto Experts', category: 'Automotive', image: '', recent: true, description: 'Car repair and maintenance' },
    { id: 12, name: 'Learning Center', category: 'Education', image: '', recent: true, description: 'Tutoring and education' }
  ];
  
  res.json(businesses);
});

// Catch-all route to serve the frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/public', 'index.html'));
});

// Listen
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;