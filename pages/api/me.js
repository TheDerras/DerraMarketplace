// API route for user info
export default async function handler(req, res) {
  // This is a demo endpoint - in a real app, we would check authentication
  if (req.headers.authorization === 'Bearer demo_token') {
    return res.status(200).json({
      id: 1,
      username: 'demo_user',
      email: 'demo@example.com',
      name: 'Demo User'
    });
  }
  
  return res.status(401).json({ message: 'Not logged in' });
}