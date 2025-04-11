// Business search API endpoint for Vercel
import { app } from '../_app.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  return new Promise((resolve, reject) => {
    app(req, res, (err) => {
      if (err) {
        console.error('Business search API error:', err);
        return reject(err);
      }
      resolve();
    });
  });
}