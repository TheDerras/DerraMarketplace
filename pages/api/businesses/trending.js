// API route for trending businesses
export default function handler(req, res) {
  const trendingBusinesses = [
    { id: 5, name: 'Web Masters', category: 'Technology', image: '', trending: true, description: 'Web development and design' },
    { id: 6, name: 'Sushi Express', category: 'Food & Dining', image: '', trending: true, description: 'Authentic Japanese cuisine' },
    { id: 7, name: 'Clean & Clear', category: 'Home Services', image: '', trending: true, description: 'Professional cleaning services' },
    { id: 8, name: 'Dental Care', category: 'Health & Wellness', image: '', trending: true, description: 'Family dental services' }
  ];
  
  res.status(200).json(trendingBusinesses);
}