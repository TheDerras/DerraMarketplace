// Businesses API endpoint for Vercel
import { app } from '../_app.js';

export default async function handler(req, res) {
  // Support both GET (fetch businesses) and POST (create business)
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  return new Promise((resolve, reject) => {
    app(req, res, (err) => {
      if (err) {
        console.error('Businesses API error:', err);
        return reject(err);
      }
      resolve();
    });
  });
}