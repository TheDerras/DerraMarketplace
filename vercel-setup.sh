#!/bin/bash

# This script prepares the project for Vercel deployment

# Copy the Vercel-specific package.json
cp package.vercel.json package.json

# Run the build
npm run build

echo "✅ Vercel setup complete"