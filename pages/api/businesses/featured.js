// API route for featured businesses
export default function handler(req, res) {
  const featuredBusinesses = [
    { id: 1, name: 'Tech Solutions', category: 'Technology', image: '', featured: true, description: 'IT services and support' },
    { id: 2, name: 'Gourmet Delights', category: 'Food & Dining', image: '', featured: true, description: 'Fine dining experience' },
    { id: 3, name: 'Zen Spa', category: 'Beauty & Spa', image: '', featured: true, description: 'Relaxation and wellness' },
    { id: 4, name: 'Fitness First', category: 'Health & Wellness', image: '', featured: true, description: 'Personal training and fitness' }
  ];
  
  res.status(200).json(featuredBusinesses);
}