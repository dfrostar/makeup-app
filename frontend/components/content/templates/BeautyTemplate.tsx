import { useState } from 'react';
import { BeautyContentType, BeautyMetadata } from '@/lib/content/domains/types';
import {
  SwatchIcon,
  BeakerIcon,
  SparklesIcon,
  StarIcon,
  ClockIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

interface BeautyTemplateProps {
  type: BeautyContentType;
  onSave: (content: any) => Promise<void>;
}

export default function BeautyTemplate({ type, onSave }: BeautyTemplateProps) {
  const [content, setContent] = useState({
    title: '',
    description: '',
    content: '',
    products: [],
    techniques: [],
    skinTypes: [],
    skinConcerns: [],
    colorPalette: [],
    beforeAfter: null,
  });

  const getTemplateFields = () => {
    switch (type) {
      case 'look':
        return (
          <>
            <ProductSection
              products={content.products}
              onChange={(products) => setContent({ ...content, products })}
            />
            <ColorPaletteSection
              palette={content.colorPalette}
              onChange={(colorPalette) => setContent({ ...content, colorPalette })}
            />
            <BeforeAfterSection
              data={content.beforeAfter}
              onChange={(beforeAfter) => setContent({ ...content, beforeAfter })}
            />
          </>
        );

      case 'routine':
        return (
          <>
            <SkinTypeSection
              types={content.skinTypes}
              concerns={content.skinConcerns}
              onChange={(data) => setContent({ ...content, ...data })}
            />
            <ProductSection
              products={content.products}
              onChange={(products) => setContent({ ...content, products })}
            />
            <TimeEstimateSection />
          </>
        );

      case 'technique':
        return (
          <>
            <TechniqueSection
              techniques={content.techniques}
              onChange={(techniques) => setContent({ ...content, techniques })}
            />
            <DifficultySection />
            <ToolsSection />
          </>
        );

      case 'product_review':
        return (
          <>
            <ProductDetailSection />
            <RatingSection />
            <SwatchSection />
            <ComparisonSection />
          </>
        );

      // Add more template types as needed
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Common Fields */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={content.title}
          onChange={(e) => setContent({ ...content, title: e.target.value })}
          className="w-full px-4 py-2 border rounded-md"
        />
        
        <textarea
          placeholder="Description"
          value={content.description}
          onChange={(e) => setContent({ ...content, description: e.target.value })}
          className="w-full px-4 py-2 border rounded-md h-24"
        />
      </div>

      {/* Template-specific fields */}
      {getTemplateFields()}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={() => onSave(content)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save Content
        </button>
      </div>
    </div>
  );
}

// Template Sections
function ProductSection({ products, onChange }) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-medium mb-4">Products Used</h3>
      {/* Product input fields */}
    </div>
  );
}

function ColorPaletteSection({ palette, onChange }) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-medium mb-4">Color Palette</h3>
      {/* Color picker and palette management */}
    </div>
  );
}

function BeforeAfterSection({ data, onChange }) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-medium mb-4">Before & After</h3>
      {/* Image upload and comparison tools */}
    </div>
  );
}

function SkinTypeSection({ types, concerns, onChange }) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-medium mb-4">Skin Profile</h3>
      {/* Skin type and concerns selectors */}
    </div>
  );
}

function TechniqueSection({ techniques, onChange }) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-medium mb-4">Techniques</h3>
      {/* Technique input and management */}
    </div>
  );
}

function DifficultySection() {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-medium mb-4">Difficulty Level</h3>
      {/* Difficulty selector */}
    </div>
  );
}

function ToolsSection() {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-medium mb-4">Required Tools</h3>
      {/* Tools input and management */}
    </div>
  );
}

function ProductDetailSection() {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-medium mb-4">Product Details</h3>
      {/* Product information fields */}
    </div>
  );
}

function RatingSection() {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-medium mb-4">Rating</h3>
      {/* Rating input and criteria */}
    </div>
  );
}

function SwatchSection() {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-medium mb-4">Swatches</h3>
      {/* Swatch upload and management */}
    </div>
  );
}

function ComparisonSection() {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-medium mb-4">Product Comparisons</h3>
      {/* Comparison tools */}
    </div>
  );
}

function TimeEstimateSection() {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-medium mb-4">Time Estimate</h3>
      {/* Time input and breakdown */}
    </div>
  );
}
