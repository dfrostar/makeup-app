import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeartIcon, ShoppingBagIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Toast } from '@/components/common/Toast';

interface ProductQuickViewProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    brand: string;
    price: number;
    rating: number;
    reviewCount: number;
    description: string;
    images: string[];
    features: string[];
    shades?: { name: string; color: string }[];
    sizes?: string[];
    variants?: { name: string; price: number }[];
  };
}

export function ProductQuickView({ isOpen, onClose, product }: ProductQuickViewProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedShade, setSelectedShade] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedVariant, setSelectedVariant] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    setShowToast(true);
    setTimeout(onClose, 2000);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square overflow-hidden rounded-md ${
                    selectedImage === index ? 'ring-2 ring-pink-500' : ''
                  }`}
                >
                  <Image src={image} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="mb-2 text-sm text-gray-500">{product.brand}</div>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">{product.name}</h2>

            {/* Price */}
            <div className="mb-4 text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</div>

            {/* Rating */}
            <div className="mb-6 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`h-5 w-5 ${
                    i < product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
              <Link href="#reviews" className="ml-2 text-sm text-gray-500">
                ({product.reviewCount} reviews)
              </Link>
            </div>

            {/* Description */}
            <p className="mb-6 text-gray-600">{product.description}</p>

            {/* Features */}
            <ul className="mb-6 space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600">
                  <span className="mr-2 h-1.5 w-1.5 rounded-full bg-pink-500" />
                  {feature}
                </li>
              ))}
            </ul>

            {/* Shades */}
            {product.shades && (
              <div className="mb-6">
                <h3 className="mb-2 text-sm font-medium text-gray-900">Shade</h3>
                <div className="flex flex-wrap gap-2">
                  {product.shades.map((shade) => (
                    <button
                      key={shade.name}
                      onClick={() => setSelectedShade(shade.name)}
                      className={`h-8 w-8 rounded-full border-2 ${
                        selectedShade === shade.name
                          ? 'border-pink-500'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: shade.color }}
                      title={shade.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && (
              <div className="mb-6">
                <h3 className="mb-2 text-sm font-medium text-gray-900">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-md border px-3 py-1 text-sm ${
                        selectedSize === size
                          ? 'border-pink-500 bg-pink-50 text-pink-600'
                          : 'border-gray-200 text-gray-900 hover:border-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Variants */}
            {product.variants && (
              <div className="mb-6">
                <h3 className="mb-2 text-sm font-medium text-gray-900">Variant</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.name}
                      onClick={() => setSelectedVariant(variant.name)}
                      className={`rounded-md border px-3 py-1 text-sm ${
                        selectedVariant === variant.name
                          ? 'border-pink-500 bg-pink-50 text-pink-600'
                          : 'border-gray-200 text-gray-900 hover:border-gray-300'
                      }`}
                    >
                      {variant.name} - ${variant.price.toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="mb-2 text-sm font-medium text-gray-900">Quantity</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="rounded-md border border-gray-200 p-2 text-gray-600 hover:border-gray-300"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                  className="w-16 rounded-md border border-gray-200 px-3 py-2 text-center"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="rounded-md border border-gray-200 p-2 text-gray-600 hover:border-gray-300"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button onClick={handleAddToCart} className="flex-1">
                <ShoppingBagIcon className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsLiked(!isLiked)}
                className={isLiked ? 'text-pink-600' : ''}
              >
                {isLiked ? (
                  <HeartSolidIcon className="h-5 w-5" />
                ) : (
                  <HeartIcon className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Toast Notification */}
      <Toast
        open={showToast}
        onClose={() => setShowToast(false)}
        title="Added to Cart"
        message={`${product.name} has been added to your cart.`}
        type="success"
        duration={2000}
      />
    </>
  );
}
