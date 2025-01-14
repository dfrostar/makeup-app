'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Calendar, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const categories = [
  'All',
  'Makeup Artist',
  'Hair Stylist',
  'Esthetician',
  'Beauty Consultant'
];

const professionals = [
  {
    id: 1,
    name: 'Sarah Johnson',
    title: 'Celebrity Makeup Artist',
    image: '/images/professionals/sarah.jpg',
    rating: 4.9,
    reviews: 156,
    location: 'New York, NY',
    specialties: ['Bridal', 'Editorial', 'Special Effects'],
    experience: '10+ years',
    price: 150,
    availability: true,
    portfolio: [
      '/images/portfolio/sarah-1.jpg',
      '/images/portfolio/sarah-2.jpg',
      '/images/portfolio/sarah-3.jpg'
    ]
  },
  {
    id: 2,
    name: 'Michael Chen',
    title: 'Fashion Makeup Artist',
    image: '/images/professionals/michael.jpg',
    rating: 4.8,
    reviews: 142,
    location: 'Los Angeles, CA',
    specialties: ['Fashion', 'Runway', 'Commercial'],
    experience: '8 years',
    price: 120,
    availability: true,
    portfolio: [
      '/images/portfolio/michael-1.jpg',
      '/images/portfolio/michael-2.jpg',
      '/images/portfolio/michael-3.jpg'
    ]
  },
  // Add more professionals here
];

export default function Professionals() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [location, setLocation] = useState('');

  const filteredProfessionals = professionals.filter(
    pro =>
      (selectedCategory === 'All' || pro.title.includes(selectedCategory)) &&
      (!location || pro.location.toLowerCase().includes(location.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Find Beauty Professionals</h1>
          <p className="text-xl opacity-90 mb-8">
            Connect with top-rated makeup artists and beauty experts
          </p>
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search by location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 px-6 py-3 rounded-lg text-gray-900"
              />
              <Button size="lg" className="bg-purple-700 hover:bg-purple-800">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border rounded-md bg-white"
          >
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="experience">Most Experienced</option>
          </select>
        </div>

        {/* Professionals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProfessionals.map((pro) => (
            <motion.div
              key={pro.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Header */}
              <div className="relative">
                <img
                  src={pro.image}
                  alt={pro.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <h3 className="text-xl font-semibold text-white">{pro.name}</h3>
                  <p className="text-white/90">{pro.title}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Rating and Location */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-medium">{pro.rating}</span>
                    <span className="text-gray-500 ml-1">
                      ({pro.reviews} reviews)
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {pro.location}
                  </div>
                </div>

                {/* Specialties */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Specialties
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {pro.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience and Price */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-medium">{pro.experience}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Starting at</p>
                    <p className="font-medium">${pro.price}/hr</p>
                  </div>
                </div>

                {/* Portfolio Preview */}
                <div className="mb-4">
                  <div className="flex gap-2">
                    {pro.portfolio.slice(0, 3).map((image, index) => (
                      <div
                        key={index}
                        className="w-20 h-20 rounded-lg overflow-hidden"
                      >
                        <img
                          src={image}
                          alt={`Portfolio ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex-1" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Now
                  </Button>
                  <Button className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
