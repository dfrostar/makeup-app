import Image from 'next/image';
import { MapPin, Star, Calendar } from 'lucide-react';

interface ProfessionalCardProps {
  professional: {
    id: string;
    name: string;
    title: string;
    specialty: string;
    location: string;
    rating: number;
    reviews: number;
    image: string;
    availability: string;
    price: string;
  };
}

export const ProfessionalCard = ({ professional }: ProfessionalCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Header Image */}
      <div className="relative h-48">
        <Image
          src={professional.image}
          alt={professional.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Basic Info */}
        <div>
          <h3 className="text-lg font-semibold">{professional.name}</h3>
          <p className="text-gray-600">{professional.title}</p>
          <p className="text-purple-600 font-medium">{professional.specialty}</p>
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-500">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{professional.location}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center text-yellow-400">
            <Star className="w-4 h-4 fill-current" />
            <span className="ml-1 text-sm font-medium">{professional.rating}</span>
          </div>
          <span className="text-sm text-gray-500">
            ({professional.reviews} reviews)
          </span>
        </div>

        {/* Availability & Price */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center text-green-600">
            <Calendar className="w-4 h-4 mr-1" />
            <span className="text-sm">{professional.availability}</span>
          </div>
          <span className="text-sm font-medium">{professional.price}</span>
        </div>

        {/* Book Button */}
        <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors">
          Book Appointment
        </button>
      </div>
    </div>
  );
};
