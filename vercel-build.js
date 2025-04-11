// This file is used by Vercel to build the frontend correctly
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if we're in a Vercel environment
const isVercel = process.env.VERCEL === '1';

if (isVercel) {
  console.log('🚀 Running in Vercel environment, starting build process...');
  
  // Make sure we have the right package.json for Vercel deployment
  if (fs.existsSync('vercel-package.json')) {
    console.log('📋 Using Vercel-specific package.json');
    fs.copyFileSync('vercel-package.json', 'package.json');
  }
  
  // Check if we need to use the Next.js structure
  if (fs.existsSync('pages') && fs.existsSync('pages/index.js')) {
    console.log('📦 Detected Next.js project structure, using Next.js build');
    // Run Next.js build
    execSync('npm run build', { stdio: 'inherit' });
  } else {
    console.error('❌ Could not find necessary Next.js structure');
    console.log('🔍 Creating minimum required structure');
    
    // Ensure pages directory exists
    if (!fs.existsSync('pages')) {
      fs.mkdirSync('pages', { recursive: true });
    }
    
    // Ensure pages/api directory exists
    if (!fs.existsSync('pages/api')) {
      fs.mkdirSync('pages/api', { recursive: true });
    }
    
    // Create a minimal Next.js app if it doesn't exist
    if (!fs.existsSync('pages/index.js')) {
      fs.writeFileSync('pages/index.js', `
export default function Home() {
  return (
    <div>
      <h1>Derra API</h1>
      <p>API is running. Please check /api/status for more information.</p>
    </div>
  );
}
      `);
    }
    
    // Create a minimal API route if none exists
    if (!fs.existsSync('pages/api/status.js')) {
      fs.writeFileSync('pages/api/status.js', `
export default function handler(req, res) {
  res.json({ status: 'online', timestamp: new Date().toISOString() });
}
      `);
    }
    
    // Run Next.js build
    execSync('npm run build', { stdio: 'inherit' });
  }
  
  console.log('✅ Build process completed successfully');
} else {
  console.log('ℹ️ Not running in Vercel environment, skipping special build steps');
}