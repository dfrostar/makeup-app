'use client';

import { useState } from 'react';
import { VirtualMirror } from '@/components/ar/VirtualMirror';
import { testProducts } from '@/data/test-products';
import type { ProductData } from '@/types/ar';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  Camera,
  Sliders,
  Download,
  Share2,
  Undo,
  Palette,
  SunMedium,
  Sparkles
} from 'lucide-react';

export default function TestAR() {
  const [selectedProduct, setSelectedProduct] = useState<ProductData>(testProducts[0]);
  const [intensity, setIntensity] = useState(1.0);
  const [showControls, setShowControls] = useState(true);
  const [selectedTab, setSelectedTab] = useState('products');

  const handleProductChange = (product: ProductData) => {
    setSelectedProduct(product);
  };

  const handleColorChange = (color: string) => {
    console.log('Color changed:', color);
  };

  const handleError = (error: any) => {
    console.error('AR Error:', error);
  };

  const handleIntensityChange = (value: number) => {
    setIntensity(value);
  };

  const handleSnapshot = () => {
    // Implement snapshot functionality
  };

  const handleShare = () => {
    // Implement share functionality
  };

  const handleReset = () => {
    setIntensity(1.0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Virtual Makeup Studio
            </h1>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowControls(!showControls)}
              >
                <Sliders className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleSnapshot}>
                <Camera className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* AR View */}
          <div className="flex-1">
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
              <VirtualMirror
                product={selectedProduct}
                onColorChange={handleColorChange}
                onError={handleError}
                intensity={intensity}
              />
            </div>
          </div>

          {/* Controls */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                className="w-80 bg-white rounded-xl shadow-lg p-6"
              >
                <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                  <TabsList className="mb-6">
                    <TabsTrigger value="products">Products</TabsTrigger>
                    <TabsTrigger value="adjustments">Adjustments</TabsTrigger>
                    <TabsTrigger value="effects">Effects</TabsTrigger>
                  </TabsList>

                  {/* Products Tab */}
                  {selectedTab === 'products' && (
                    <div className="space-y-4">
                      {testProducts.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleProductChange(product)}
                          className={`w-full p-4 rounded-lg border-2 transition-all ${
                            selectedProduct.id === product.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-start">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">
                                {product.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {product.description}
                              </p>
                            </div>
                            <div className="ml-4">
                              <div
                                className="w-6 h-6 rounded-full border-2 border-white shadow"
                                style={{ backgroundColor: product.defaultColor }}
                              />
                            </div>
                          </div>
                          {/* Product Features */}
                          <div className="mt-2 flex flex-wrap gap-1">
                            {product.features?.map((feature) => (
                              <span
                                key={feature}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Adjustments Tab */}
                  {selectedTab === 'adjustments' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Intensity
                        </label>
                        <div className="flex items-center gap-4">
                          <Slider
                            value={intensity}
                            onChange={handleIntensityChange}
                            min={0}
                            max={1}
                            step={0.01}
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={handleReset}
                          >
                            <Undo className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Color
                        </label>
                        <div className="grid grid-cols-6 gap-2">
                          {selectedProduct.colors.map((color) => (
                            <button
                              key={color}
                              className="w-8 h-8 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform"
                              style={{ backgroundColor: color }}
                              onClick={() => handleColorChange(color)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Effects Tab */}
                  {selectedTab === 'effects' && (
                    <div className="space-y-4">
                      <Button className="w-full justify-start" variant="outline">
                        <Palette className="h-4 w-4 mr-2" />
                        Color Correction
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <SunMedium className="h-4 w-4 mr-2" />
                        Lighting Adjustment
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Add Sparkle Effect
                      </Button>
                    </div>
                  )}
                </Tabs>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
