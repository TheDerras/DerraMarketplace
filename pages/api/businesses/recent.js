// API route for recent businesses
export default function handler(req, res) {
  const recentBusinesses = [
    { id: 9, name: 'Marketing Pro', category: 'Technology', image: '', recent: true, description: 'Digital marketing services' },
    { id: 10, name: 'Pet Paradise', category: 'Pet Services', image: '', recent: true, description: 'Pet grooming and care' },
    { id: 11, name: 'Auto Experts', category: 'Automotive', image: '', recent: true, description: 'Car repair and maintenance' },
    { id: 12, name: 'Learning Center', category: 'Education', image: '', recent: true, description: 'Tutoring and education' }
  ];
  
  res.status(200).json(recentBusinesses);
}