# Derra - World of Business

A multi-vendor marketplace platform connecting businesses and users through an interactive, user-friendly web interface.

## Features

- Business listings with $5/month subscription model
- Social engagement features (likes, comments, sharing)
- Category-based business exploration
- User profiles with owned and favorite businesses
- Real-time messaging between users and businesses
- Notification system
- Advanced search functionality
- PayPal payment integration

## Deployment with Vercel

This project has been configured for seamless deployment on Vercel.

### Environment Variables

The following environment variables need to be set in your Vercel project:

- `DATABASE_URL`: PostgreSQL database connection string
- `SESSION_SECRET`: Secret key for session encryption
- `PAYPAL_CLIENT_ID`: PayPal API client ID
- `PAYPAL_CLIENT_SECRET`: PayPal API client secret

### Steps to Deploy

1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy
4. Enjoy your new Derra marketplace!

## Local Development

```bash
# Install dependencies
npm install

# Start the application
npm run dev
```

The application will run on port 5000.

## Demo Credentials

For testing purposes, you can use:
- Username: demo_user
- Password: password123

## Technology Stack

- React frontend with modern UI components
- Express.js backend
- PostgreSQL database with Drizzle ORM
- PayPal payment integration
- Shadcn UI components
- Tailwind CSS for styling