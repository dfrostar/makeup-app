'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'foundation', name: 'Foundation' },
  { id: 'lipstick', name: 'Lipstick' },
  { id: 'eyeshadow', name: 'Eye Shadow' },
  { id: 'blush', name: 'Blush' },
  { id: 'bronzer', name: 'Bronzer' },
  { id: 'highlighter', name: 'Highlighter' }
];

const products = [
  {
    id: 1,
    name: 'Perfect Match Foundation',
    brand: 'MyLook',
    price: 42.99,
    rating: 4.8,
    reviews: 1234,
    image: '/images/products/foundation.jpg',
    category: 'foundation',
    description: 'AI-powered foundation matching with skincare benefits',
    features: ['SPF 50', 'Hyaluronic Acid', 'Vitamin C'],
    shades: 40
  },
  {
    id: 2,
    name: 'Matte Revolution Lipstick',
    brand: 'MyLook',
    price: 34.99,
    rating: 4.9,
    reviews: 2156,
    image: '/images/products/lipstick.jpg',
    category: 'lipstick',
    description: 'Long-lasting matte lipstick with intense color payoff',
    features: ['Long Wearing', 'Moisturizing', 'Vegan Formula'],
    shades: 24
  },
  // Add more products here
];

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState('popular');

  const filteredProducts = products.filter(
    product =>
      (selectedCategory === 'all' || product.category === selectedCategory) &&
      product.price >= priceRange[0] &&
      product.price <= priceRange[1]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Shop Beauty Products</h1>
          <p className="text-xl opacity-90 mb-8">
            Try before you buy with our virtual try-on technology
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/try-on">
              <Button size="lg" variant="secondary" className="bg-white text-purple-600">
                <Camera className="mr-2 h-5 w-5" />
                Virtual Try-On
              </Button>
            </Link>
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
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border rounded-md bg-white"
          >
            <option value="popular">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Image */}
              <div className="relative aspect-square">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium">
                        {product.rating}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      ({product.reviews} reviews)
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {product.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price and Actions */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">${product.price}</p>
                    <p className="text-sm text-gray-500">
                      {product.shades} shades available
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/try-on?product=${product.id}`}>
                      <Button size="sm" variant="outline">
                        <Camera className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button size="sm">
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
