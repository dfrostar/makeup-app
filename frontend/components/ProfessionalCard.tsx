import { useState } from 'react';
import Image from 'next/image';
import { HeartIcon, StarIcon, MapPinIcon, PhoneIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface ProfessionalCardProps {
  professional: {
    id: string;
    name: string;
    description: string;
    rating: number;
    email: string;
    phone: string;
    location: string;
    imageUrl?: string;
    services: Array<{
      name: string;
      price: number;
      description: string;
    }>;
    reviews: Array<{
      rating: number;
      comment: string;
      author: string;
      date?: string;
    }>;
  };
}

export const ProfessionalCard = ({ professional }: ProfessionalCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Header with Image */}
      <div className="relative h-48 w-full bg-gradient-to-r from-pink-100 to-purple-100">
        {professional.imageUrl ? (
          <Image
            src={professional.imageUrl}
            alt={professional.name}
            layout="fill"
            objectFit="cover"
            className="rounded-t-xl"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl text-pink-300">{professional.name[0]}</span>
          </div>
        )}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors duration-200"
        >
          {isFavorite ? (
            <HeartSolidIcon className="h-6 w-6 text-pink-500" />
          ) : (
            <HeartIcon className="h-6 w-6 text-gray-600" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 hover:text-pink-600 transition-colors duration-200">
              {professional.name}
            </h3>
            <div className="flex items-center mt-2 space-x-1">
              {[...Array(5)].map((_, index) => (
                <StarIcon
                  key={index}
                  className={`h-5 w-5 ${
                    index < Math.floor(professional.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-2 text-sm font-medium text-gray-600">
                {professional.rating.toFixed(1)}
              </span>
            </div>
          </div>
          
          <div className="text-right space-y-2">
            <div className="flex items-center text-gray-600">
              <MapPinIcon className="h-5 w-5 mr-1" />
              <span className="text-sm">{professional.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <PhoneIcon className="h-5 w-5 mr-1" />
              <span className="text-sm">{professional.phone}</span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-gray-600 line-clamp-2 hover:line-clamp-none transition-all duration-200">
          {professional.description}
        </p>

        {/* Services */}
        <div className="mt-6">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-md">Services</span>
          </h4>
          <div className="grid gap-2">
            {professional.services.slice(0, isExpanded ? undefined : 3).map((service, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-pink-50 transition-colors duration-200"
              >
                <div>
                  <span className="font-medium text-gray-900">{service.name}</span>
                  <p className="text-sm text-gray-500">{service.description}</p>
                </div>
                <span className="text-pink-600 font-semibold">${service.price}</span>
              </div>
            ))}
            {professional.services.length > 3 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-pink-600 text-sm font-medium hover:text-pink-700 transition-colors duration-200"
              >
                {isExpanded ? 'Show Less' : `Show ${professional.services.length - 3} More Services`}
              </button>
            )}
          </div>
        </div>

        {/* Reviews */}
        {professional.reviews.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md">Recent Reviews</span>
            </h4>
            <div className="space-y-3">
              {professional.reviews.slice(0, 2).map((review, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded-lg hover:bg-purple-50 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{review.author}</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
                  {review.date && (
                    <p className="mt-1 text-xs text-gray-500">{review.date}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <button className="flex-1 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 active:bg-pink-800 transition-colors duration-200 flex items-center justify-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Book Appointment
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors duration-200">
            Message
          </button>
        </div>
      </div>
    </div>
  );
};
