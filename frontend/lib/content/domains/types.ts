// Beauty & Makeup Domain
export type BeautyContentType =
  | 'look'
  | 'routine'
  | 'technique'
  | 'product_review'
  | 'trend'
  | 'tutorial'
  | 'comparison'
  | 'swatch'
  | 'ingredient_analysis'
  | 'skin_concern'
  | 'seasonal_look'
  | 'brand_review';

export interface BeautyMetadata {
  products?: Array<{
    name: string;
    brand: string;
    category: string;
    shade?: string;
    price?: number;
    affiliate_link?: string;
  }>;
  techniques?: Array<{
    name: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    tools_required: string[];
    estimated_time: number;
  }>;
  skin_types?: Array<'dry' | 'oily' | 'combination' | 'sensitive' | 'normal'>;
  skin_concerns?: Array<'acne' | 'aging' | 'pigmentation' | 'sensitivity'>;
  color_palette?: Array<{
    name: string;
    hex_code: string;
    product_match?: string;
  }>;
  before_after?: {
    before_image: string;
    after_image: string;
    technique_used: string;
    products_used: string[];
  };
}

// Fashion Domain
export type FashionContentType =
  | 'outfit'
  | 'style_guide'
  | 'trend_report'
  | 'lookbook'
  | 'wardrobe_essential'
  | 'seasonal_collection'
  | 'street_style'
  | 'designer_spotlight'
  | 'sustainable_fashion'
  | 'size_inclusive'
  | 'vintage_fashion'
  | 'fashion_history';

export interface FashionMetadata {
  garments?: Array<{
    type: string;
    brand: string;
    size_range: string[];
    price_range: string;
    materials: string[];
    care_instructions?: string[];
  }>;
  style_categories?: Array<'casual' | 'formal' | 'business' | 'athletic' | 'evening'>;
  seasons?: Array<'spring' | 'summer' | 'fall' | 'winter' | 'resort'>;
  body_types?: string[];
  sustainability_score?: {
    materials: number;
    production: number;
    longevity: number;
    overall: number;
  };
  size_inclusivity?: {
    size_range: string[];
    fit_notes: string;
    model_sizes?: string[];
  };
}

// Food & Recipe Domain
export type FoodContentType =
  | 'recipe'
  | 'restaurant_review'
  | 'cooking_technique'
  | 'meal_plan'
  | 'ingredient_guide'
  | 'kitchen_equipment'
  | 'food_science'
  | 'dietary_guide'
  | 'beverage'
  | 'preservation'
  | 'cultural_cuisine'
  | 'seasonal_cooking';

export interface FoodMetadata {
  recipe?: {
    ingredients: Array<{
      name: string;
      amount: string;
      unit: string;
      notes?: string;
      substitutes?: string[];
    }>;
    nutritional_info: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      fiber?: number;
      [key: string]: number | undefined;
    };
    preparation_time: number;
    cooking_time: number;
    difficulty: 'easy' | 'medium' | 'hard';
    serves: number;
    equipment_needed: string[];
    dietary_info: Array<'vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free' | 'keto' | 'paleo'>;
  };
  technique?: {
    difficulty: 'basic' | 'intermediate' | 'advanced';
    key_points: string[];
    common_mistakes: string[];
    tips: string[];
  };
}

// Fitness & Wellness Domain
export type WellnessContentType =
  | 'workout'
  | 'meditation'
  | 'nutrition_plan'
  | 'wellness_guide'
  | 'mental_health'
  | 'yoga_sequence'
  | 'recovery_technique'
  | 'supplement_review'
  | 'fitness_challenge'
  | 'sleep_guide'
  | 'stress_management'
  | 'holistic_health';

export interface WellnessMetadata {
  workout?: {
    type: string;
    duration: number;
    intensity: 'low' | 'medium' | 'high';
    equipment_needed: string[];
    muscle_groups: string[];
    calories_burned: number;
    modifications: Array<{
      level: string;
      description: string;
    }>;
  };
  meditation?: {
    duration: number;
    type: string;
    background_music?: string;
    guided: boolean;
    benefits: string[];
  };
  nutrition?: {
    meal_timing: string[];
    macros: {
      protein: number;
      carbs: number;
      fats: number;
    };
    supplements?: Array<{
      name: string;
      dosage: string;
      timing: string;
    }>;
  };
}

// Technology Domain
export type TechContentType =
  | 'tutorial'
  | 'review'
  | 'comparison'
  | 'troubleshooting'
  | 'news'
  | 'analysis'
  | 'how_to'
  | 'security_guide'
  | 'development_guide'
  | 'tool_review'
  | 'tech_stack'
  | 'benchmark';

export interface TechMetadata {
  technologies?: Array<{
    name: string;
    version: string;
    category: string;
    requirements: string[];
    compatibility: string[];
  }>;
  code_samples?: Array<{
    language: string;
    code: string;
    explanation: string;
  }>;
  performance_metrics?: {
    benchmark_scores: Record<string, number>;
    load_times: number[];
    resource_usage: {
      cpu: number;
      memory: number;
      storage: number;
    };
  };
}

// Combined Types
export type DomainContentType =
  | BeautyContentType
  | FashionContentType
  | FoodContentType
  | WellnessContentType
  | TechContentType;

export type DomainMetadata =
  | BeautyMetadata
  | FashionMetadata
  | FoodMetadata
  | WellnessMetadata
  | TechMetadata;
