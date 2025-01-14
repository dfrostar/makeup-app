import { useState } from 'react';
import { MapPin, Star, Calendar } from 'lucide-react';
import { ProfessionalCard } from '../professionals/ProfessionalCard';
import { LocationFilter } from '../filters/LocationFilter';
import { SpecialtyFilter } from '../filters/SpecialtyFilter';

export const DirectoryView = () => {
  const [location, setLocation] = useState('');
  const [specialty, setSpecialty] = useState('all');

  // Example professionals data
  const exampleProfessionals = [
    {
      id: '1',
      name: 'Sarah Johnson',
      title: 'Makeup Artist',
      specialty: 'Bridal & Special Events',
      location: 'New York, NY',
      rating: 4.9,
      reviews: 128,
      image: '/images/professionals/sarah.jpg',
      availability: '3 slots this week',
      price: '$150/session'
    },
    {
      id: '2',
      name: 'Michael Chen',
      title: 'Beauty Expert',
      specialty: 'Editorial & Fashion',
      location: 'Los Angeles, CA',
      rating: 4.8,
      reviews: 95,
      image: '/images/professionals/michael.jpg',
      availability: 'Available next week',
      price: '$200/session'
    },
    // More professionals...
  ];

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <LocationFilter
              value={location}
              onChange={setLocation}
            />
          </div>

          {/* Specialty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specialty
            </label>
            <SpecialtyFilter
              value={specialty}
              onChange={setSpecialty}
              options={[
                { id: 'all', name: 'All Specialties' },
                { id: 'bridal', name: 'Bridal' },
                { id: 'editorial', name: 'Editorial' },
                { id: 'sfx', name: 'Special Effects' },
                { id: 'beauty', name: 'Beauty' }
              ]}
            />
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Available Date
            </label>
            <input
              type="date"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exampleProfessionals.map((professional) => (
          <ProfessionalCard
            key={professional.id}
            professional={professional}
          />
        ))}
      </div>
    </div>
  );
};
