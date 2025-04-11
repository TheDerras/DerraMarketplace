# Simplified Vercel Deployment for Derra

This document provides a streamlined approach to deploying the Derra application on Vercel.

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. The Derra codebase from GitHub or as a ZIP file

## Deployment Steps

### 1. Prepare for Deployment

Before deploying to Vercel, ensure you're using the correct package.json file:

```bash
# Rename the Vercel-specific package.json
cp package.json.vercel package.json
```

### 2. Deploy to Vercel

#### Option 1: Deploy via Vercel Dashboard

1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your repository from GitHub, GitLab, or BitBucket
   - Or upload your project as a ZIP file
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: .next
5. Set environment variables:
   - NEXT_PUBLIC_API_URL: The URL where your API is hosted (if separate)
   - SESSION_SECRET: A random string for session security
6. Click "Deploy"

#### Option 2: Deploy via Vercel CLI

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Log in to Vercel:
   ```bash
   vercel login
   ```

3. Deploy the project:
   ```bash
   vercel
   ```

4. Follow the CLI prompts to complete the deployment.

### 3. Verify Deployment

After deployment completes:

1. Visit your deployed site at the provided Vercel URL
2. Test the basic endpoints:
   - /api/status
   - /api/categories
   - /api/businesses/featured

## Troubleshooting

If you encounter "No Framework Detected" issues:

1. Ensure `vercel.json` is correctly configured
2. Check that `next.config.js` exists and is properly set up
3. Verify that `/pages/index.js` and `/pages/api/*` files exist

## Connection to Main Application

To connect your main client application to this API deployment:

1. Update your client's API base URL to point to your Vercel deployment URL
2. Ensure CORS headers are correctly set (already configured in this deployment)

## Demo Mode

This deployment includes a demo mode that provides sample data without requiring a database connection. To authenticate in demo mode:

- Username: `demo_user`
- Password: `password123`