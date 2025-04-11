// API status check endpoint for Vercel deployment
import { app } from './_app.js';

export default async function handler(req, res) {
  return new Promise((resolve, reject) => {
    app(req, res, (err) => {
      if (err) {
        console.error('Status check API error:', err);
        return reject(err);
      }
      resolve();
    });
  });
}