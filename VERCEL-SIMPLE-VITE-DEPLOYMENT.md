# Simple Vite Deployment Guide for Vercel

This guide provides a straightforward approach to deploying your Derra Vite application on Vercel.

## What This Does

This deployment method:
1. Uses the standard Vite build process
2. Serves the frontend via a special server file for Vercel
3. Includes simplified API endpoints that work immediately

## Deployment Steps

### 1. Push to GitHub (Recommended)

1. Create a new GitHub repository
2. Push your code to the repository
3. Connect the repository to Vercel

### 2. Deploy Directly to Vercel

1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository OR upload files directly
4. Vercel will automatically detect the project settings
5. Click "Deploy"

## Key Files for Deployment

The deployment relies on two special files:

1. `vercel.json` - Configuration for Vercel deployment:
   ```json
   {
     "version": 2,
     "buildCommand": "npm run build",
     "outputDirectory": "dist/public",
     "installCommand": "npm install",
     "builds": [
       { "src": "vercel.js", "use": "@vercel/node" },
       { "src": "package.json", "use": "@vercel/node" }
     ],
     "routes": [
       { "src": "/api/(.*)", "dest": "/vercel.js" },
       { "src": "/(.*)", "dest": "/vercel.js" }
     ],
     "env": { "NODE_ENV": "production" }
   }
   ```

2. `vercel.js` - Special server file for Vercel that:
   - Serves your built frontend files
   - Provides API endpoints
   - Handles routing

## Testing Your Deployment

After successful deployment:

1. Visit your deployment URL provided by Vercel
2. Verify that the frontend loads correctly
3. Test APIs by accessing:
   - `/api/status`
   - `/api/categories`
   - `/api/businesses/featured`

## Troubleshooting

### 404 Errors or Blank Screen
- Check Vercel build logs to ensure the build completed successfully
- Make sure your `vercel.json` is properly formatted
- Verify that `vercel.js` exists and is set up correctly

### API Endpoints Not Working
- Check that all API routes are directed to `vercel.js`
- Make sure your route patterns match what the frontend expects

### Build Failures
- Check that all dependencies are correctly listed in package.json
- Verify that your build command is correct: `npm run build`