# Derra - Vercel Deployment Guide

This comprehensive guide will walk you through the steps to successfully deploy your Derra marketplace on Vercel.

## Prerequisites

1. A Vercel account (create one at [vercel.com](https://vercel.com) if you don't have one)
2. Your project code on GitHub, GitLab, or Bitbucket (or you can deploy directly from your local files)
3. A PostgreSQL database (we recommend using [Neon](https://neon.tech) for serverless Postgres)

## Step 1: Prepare Your Database

1. Create a PostgreSQL database on your preferred provider (Neon, Supabase, etc.)
2. Get your database connection string, which should look like:
   ```
   postgresql://username:password@host:port/database
   ```
3. Keep this connection string handy for the environment variables step

## Step 2: Connect Your Repository to Vercel

1. Log in to your Vercel account
2. Click "Add New" and select "Project"
3. Import your Git repository or upload your project files
4. Select the Derra project

## Step 3: Configure Environment Variables

Set up the following environment variables in the Vercel dashboard:

| Name | Value | Description |
|------|-------|-------------|
| `DATABASE_URL` | `postgresql://...` | Your PostgreSQL connection string |
| `SESSION_SECRET` | `your-secure-random-string` | A random string for session encryption (at least 32 characters) |
| `PAYPAL_CLIENT_ID` | `your-paypal-client-id` | Your PayPal API client ID |
| `PAYPAL_CLIENT_SECRET` | `your-paypal-client-secret` | Your PayPal API client secret |
| `NODE_ENV` | `production` | Set the environment to production |

## Step 4: Deploy Your Project

1. Review your settings
2. Click "Deploy"
3. Wait for the build to complete (this may take a few minutes)

## Step 5: Verify Your Deployment

1. Once deployed, Vercel will provide you with a URL to access your site
2. Visit the URL and ensure:
   - The home page loads correctly
   - You can register and log in
   - Business listings are displayed
   - The search functionality works
   - Business creation and subscription flows are operational

## Troubleshooting Common Issues

### Database Connection Issues

If you see database connection errors:
1. Double-check your `DATABASE_URL` environment variable
2. Ensure your database allows connections from Vercel's IP addresses
3. For Neon databases, make sure you're using the pooled connection string

### API Routes Not Working

If API routes return 404 errors:
1. Check that all files in the `/api` directory are properly formatted
2. Verify that `vercel.json` contains the correct route configurations
3. Deploy again after making any changes

### Authentication Issues

If login/registration doesn't work:
1. Verify the `SESSION_SECRET` is properly set
2. Check that your database tables are properly created
3. Ensure your cookies are being set correctly

### PayPal Integration Problems

If PayPal payments aren't processing:
1. Confirm your PayPal API credentials are correct
2. Make sure you're using the right PayPal environment (sandbox vs. production)
3. Check the browser console for any JavaScript errors

## Next Steps

Once your deployment is successful:
1. Set up a custom domain in the Vercel dashboard
2. Configure SSL for your domain
3. Set up monitoring and analytics

## Getting Help

If you continue to experience issues with your deployment, you can:
1. Check Vercel's deployment logs for specific error messages
2. Review your build output for any build-time errors
3. Contact Vercel support if the issue persists

---

Good luck with your deployment! Your Derra marketplace will be live and accessible to users worldwide once these steps are completed.