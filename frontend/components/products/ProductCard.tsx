import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HeartIcon, ShoppingBagIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Toast } from '@/components/common/Toast';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    brand: string;
    price: number;
    rating: number;
    reviewCount: number;
    image: string;
    badges?: string[];
    isNew?: boolean;
    isSale?: boolean;
    salePrice?: number;
  };
  onQuickView?: () => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLiked(!isLiked);
    setShowToast(true);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    // TODO: Implement add to cart functionality
    setShowToast(true);
  };

  return (
    <>
      <Card
        className="group relative h-full"
        hover="lift"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/products/${product.id}`} className="block h-full">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden rounded-t-lg">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Badges */}
            <div className="absolute left-2 top-2 flex flex-col gap-1">
              {product.isNew && (
                <span className="rounded-full bg-blue-500 px-2 py-1 text-xs font-medium text-white">
                  New
                </span>
              )}
              {product.isSale && (
                <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-medium text-white">
                  Sale
                </span>
              )}
              {product.badges?.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full bg-gray-900/75 px-2 py-1 text-xs font-medium text-white"
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-[2px]"
            >
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onQuickView}
                  className="!bg-white/90 hover:!bg-white"
                >
                  Quick View
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="mb-1 text-sm text-gray-500">{product.brand}</div>
            <h3 className="mb-2 text-base font-medium text-gray-900">{product.name}</h3>
            
            {/* Price */}
            <div className="mb-2 flex items-center gap-2">
              {product.isSale && product.salePrice && (
                <>
                  <span className="text-lg font-medium text-red-600">
                    ${product.salePrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                </>
              )}
              {(!product.isSale || !product.salePrice) && (
                <span className="text-lg font-medium text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="mb-4 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`h-4 w-4 ${
                    i < product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-1 text-sm text-gray-500">({product.reviewCount})</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleAddToCart}
              >
                <ShoppingBagIcon className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`${isLiked ? 'text-pink-600' : ''}`}
                onClick={handleLike}
              >
                {isLiked ? (
                  <HeartSolidIcon className="h-4 w-4 text-pink-600" />
                ) : (
                  <HeartIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </Link>
      </Card>

      {/* Toast Notifications */}
      <Toast
        open={showToast}
        onClose={() => setShowToast(false)}
        title={isLiked ? 'Added to Wishlist' : 'Added to Cart'}
        type="success"
        duration={2000}
      />
    </>
  );
}
