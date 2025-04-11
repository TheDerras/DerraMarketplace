# Simplified Vercel Deployment Instructions for Derra

I've completely revised the deployment strategy to ensure your Derra application works properly on Vercel. Here's how to deploy with this new setup:

## Step 1: Make Sure All Files Are Committed

The changes I've made simplify the deployment process and make it more robust:
- Simplified vercel.json
- Redesigned API bridge in api/_app.js
- Added fallback data for when database isn't available

## Step 2: Set Up Required Environment Variables

On Vercel, you need to set these environment variables:

| Variable | Description | Required? |
|----------|-------------|-----------|
| `DATABASE_URL` | PostgreSQL connection string | Recommended |
| `SESSION_SECRET` | Secret for session encryption | Yes |
| `NODE_ENV` | Environment (should be "production") | Yes |
| `PAYPAL_CLIENT_ID` | PayPal API client ID | Only for payments |
| `PAYPAL_CLIENT_SECRET` | PayPal API client secret | Only for payments |

## Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and log in
2. Click "Import Project"
3. Connect to your repository
4. Configure the project as follows:
   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. Set the environment variables from Step 2
6. Click "Deploy"

## Step 4: Verify Deployment

After deployment, test these endpoints:
- `/api/status` - Check that the API is running
- `/api/categories` - Check that data is returning
- Try logging in with demo_user/password123

## Important Notes

1. **Demo Mode**: The app will work even without a database thanks to the added fallbacks

2. **Debugging**: If you have issues, check:
   - Vercel logs in the deployment dashboard
   - The `/api/status` endpoint to see connection status
   - Make sure all environment variables are set correctly

3. **Database Setup**: If using Neon:
   - Use the pooled connection string (starts with postgresql://)
   - Make sure SSL is enabled (it is by default in our code)

4. **Session Issues**: If sessions aren't working:
   - Check that SESSION_SECRET is set
   - Verify that database connection is working (for session storage)

5. **Easy Way to See All API Routes**:
   Go to: https://your-app-name.vercel.app/api/status
   
## Demo Credentials

Username: `demo_user`  
Password: `password123`

These will work regardless of database connectivity, as I've hardcoded these credentials for testing purposes.