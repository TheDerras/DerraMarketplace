// API status endpoint
export default async function handler(req, res) {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    appName: 'Derra - World of Business',
    version: '1.0.0'
  });
}