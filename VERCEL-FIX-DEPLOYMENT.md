# How to Fix Vite Build Error on Vercel

This guide addresses the specific build error you're seeing with Vercel:
```
sh: line 1: vite: command not found
Error: Command "vite build" exited with 127
```

## The Solution

I've created a custom deployment configuration that fixes this issue:

1. `vercel.json` - Uses a custom build script instead of relying on Vercel's framework detection
2. `package.vercel.json` - Contains all necessary dependencies including Vite
3. `vercel-setup.sh` - Setup script that runs before the build
4. `vercel.js` - Custom server file for Vercel to serve both the frontend and API

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard

1. Push your latest code to GitHub with these new files
2. Create a new project in Vercel
3. When configuring the project:
   - **Framework Preset**: Select "Other" (not Vite)
   - **Build Command**: The one in vercel.json will be used automatically
   - **Output Directory**: Leave as is, it's set in vercel.json
   - **Install Command**: Leave as is, it's set in vercel.json
4. Click Deploy

### Option 2: Quick Test Deploy

If you want to test if this configuration works before pushing to your repository:

1. Create a ZIP file of your project
2. Upload it to Vercel as a new project
3. Use the same settings as Option 1

## Troubleshooting

### Still Getting Build Errors?

1. Check the build logs for specific errors
2. Make sure `vercel-setup.sh` has executable permissions:
   ```bash
   git update-index --chmod=+x vercel-setup.sh
   git commit -m "Make vercel-setup.sh executable"
   git push
   ```

3. Try manually selecting "Other" as the framework in Vercel instead of "Vite"

### "Cannot find module" Errors

If you see module not found errors:
- Check that all dependencies are correctly listed in `package.vercel.json`
- Make sure the build script is being executed correctly

### API Routes Not Working

If frontend loads but API doesn't work:
- Check that `vercel.js` is correctly handling the API routes
- Verify the routes in `vercel.json` are directing to `vercel.js`

## How This Works

1. When deployed to Vercel, the custom build script (`vercel-setup.sh`) runs
2. This script replaces `package.json` with our Vercel-specific version
3. The build runs with all necessary dependencies including Vite
4. Vercel then serves the app using our custom server file

This approach bypasses Vercel's framework detection which was causing the error.