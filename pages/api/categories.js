// API route for categories
export default function handler(req, res) {
  const categories = [
    { id: 1, name: 'Technology', icon: 'ri-computer-line', businessCount: 5 },
    { id: 2, name: 'Food & Dining', icon: 'ri-restaurant-line', businessCount: 8 },
    { id: 3, name: 'Health & Wellness', icon: 'ri-heart-pulse-line', businessCount: 4 },
    { id: 4, name: 'Beauty & Spa', icon: 'ri-sparkles-line', businessCount: 3 },
    { id: 5, name: 'Home Services', icon: 'ri-home-gear-line', businessCount: 6 }
  ];
  
  res.status(200).json(categories);
}