'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductQuickView } from '@/components/products/ProductQuickView';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';

interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isSale?: boolean;
  salePrice?: number;
  badges?: string[];
}

const categories: Category[] = [
  {
    id: '1',
    name: 'Makeup',
    image: '/images/looks/natural/natural-1.jpg',
    description: 'Discover the latest trends in cosmetics',
  },
  {
    id: '2',
    name: 'Skincare',
    image: '/images/looks/natural/natural-2.jpg',
    description: 'Achieve your perfect skincare routine',
  },
  {
    id: '3',
    name: 'Hair Care',
    image: '/images/looks/natural/natural-3.jpg',
    description: 'Professional hair care products',
  },
  {
    id: '4',
    name: 'Tools',
    image: '/images/portfolio/work/portfolio-1.jpg',
    description: 'Professional beauty tools and accessories',
  },
];

const featuredProducts: Product[] = [
  {
    id: '1',
    name: 'Luminous Foundation',
    brand: 'Glow Cosmetics',
    price: 39.99,
    image: '/images/products/foundation/foundation-dewy.jpg',
    rating: 4.5,
    reviewCount: 128,
    isNew: true,
    badges: ['Vegan', 'Cruelty-Free'],
  },
  {
    id: '2',
    name: 'Velvet Lipstick',
    brand: 'Beauty Co',
    price: 24.99,
    image: '/images/products/lipstick/lipstick-matte.jpg',
    rating: 4.8,
    reviewCount: 256,
    isSale: true,
    salePrice: 19.99,
  },
  {
    id: '3',
    name: 'Classic Foundation',
    brand: 'Pure Beauty',
    price: 54.99,
    image: '/images/products/foundation/foundation-classic.jpg',
    rating: 4.7,
    reviewCount: 189,
    badges: ['Clean', 'Natural'],
  },
  {
    id: '4',
    name: 'Metallic Lipstick',
    brand: 'Lash Magic',
    price: 19.99,
    image: '/images/products/lipstick/lipstick-metallic.jpg',
    rating: 4.6,
    reviewCount: 312,
    isNew: true,
  },
];

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] bg-gradient-to-r from-pink-100 to-purple-100">
        <div className="container mx-auto flex h-full items-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="mb-6 font-playfair text-5xl font-bold text-gray-900 md:text-6xl">
              Discover Your Perfect
              <span className="text-pink-600"> Beauty</span> Routine
            </h1>
            <p className="mb-8 text-lg text-gray-600">
              Explore our curated collection of premium beauty products, expert tips,
              and personalized recommendations for your unique beauty journey.
            </p>
            <div className="flex gap-4">
              <Button size="lg">Shop Now</Button>
              <Button variant="outline" size="lg">
                Take Beauty Quiz
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute right-0 top-0 h-full w-1/3 bg-[url('/images/hero-pattern.svg')] opacity-10" />
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 font-playfair text-3xl font-bold text-gray-900">
              Shop by Category
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Explore our wide range of beauty categories, from makeup essentials to
              skincare solutions, all carefully curated for your beauty needs.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={`/categories/${category.id}`}>
                  <Card hover="lift" className="group h-full">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="mb-2 text-xl font-semibold text-gray-900">
                        {category.name}
                      </h3>
                      <p className="text-gray-600">{category.description}</p>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 font-playfair text-3xl font-bold text-gray-900">
              Featured Products
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Discover our handpicked selection of premium beauty products, chosen for
              their exceptional quality and amazing results.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: 'Clean Beauty',
                description: 'Carefully curated products that are safe for you and the environment',
                icon: '🌿',
              },
              {
                title: 'Expert Advice',
                description: 'Get personalized recommendations from beauty professionals',
                icon: '👩‍🔬',
              },
              {
                title: 'Free Shipping',
                description: 'Free shipping on orders over $50',
                icon: '🚚',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full text-center">
                  <div className="p-6">
                    <span className="mb-4 inline-block text-4xl">{feature.icon}</span>
                    <h3 className="mb-2 text-xl font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Quick View Modal */}
      {selectedProduct && (
        <ProductQuickView
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          product={{
            ...selectedProduct,
            description: 'A premium product that delivers exceptional results...',
            images: [selectedProduct.image, selectedProduct.image, selectedProduct.image],
            features: [
              'Long-lasting formula',
              'Dermatologist tested',
              'Non-comedogenic',
            ],
            shades: [
              { name: 'Fair', color: '#F5DBD1' },
              { name: 'Light', color: '#E8C1A9' },
              { name: 'Medium', color: '#D4A088' },
            ],
          }}
        />
      )}
    </main>
  );
}
