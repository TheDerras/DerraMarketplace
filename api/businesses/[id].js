// Business detail API endpoint for Vercel
import { app } from '../_app.js';

export default async function handler(req, res) {
  // Handles GET, PUT, DELETE for specific business by ID
  if (!['GET', 'PUT', 'DELETE'].includes(req.method)) {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  return new Promise((resolve, reject) => {
    app(req, res, (err) => {
      if (err) {
        console.error('Business detail API error:', err);
        return reject(err);
      }
      resolve();
    });
  });
}