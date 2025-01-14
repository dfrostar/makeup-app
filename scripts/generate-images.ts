import Replicate from 'replicate';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

interface ImagePrompt {
  category: string;
  description: string;
  filename: string;
  style?: string;
  season?: string;
  occasion?: string;
}

// Enhanced parameters for better image quality
const baseParams = {
  width: 1024,
  height: 1024,
  num_inference_steps: 75, // Increased for better quality
  guidance_scale: 8.5,    // Slightly increased for better prompt adherence
  scheduler: 'DPMSolverMultistep', // Better scheduler for detailed images
  refine: 'expert_ensemble_refiner', // Use expert refiner for higher quality
  refine_steps: 20,
  prompt_strength: 0.8,
};

// Style variations for seasonal looks
const styles = {
  spring: 'soft pastel colors, fresh dewy skin, light and airy',
  summer: 'sun-kissed glow, bronzed skin, vibrant colors',
  fall: 'warm earth tones, matte finish, rich textures',
  winter: 'cool tones, metallic accents, dramatic contrasts'
};

// Occasions for different looks
const occasions = [
  'Natural Day Look',
  'Office Professional',
  'Date Night',
  'Wedding Guest',
  'Red Carpet',
  'Festival',
  'Beach Ready',
  'Night Out',
  'Brunch',
  'Photoshoot',
  'Special Event',
  'Holiday Party'
];

// Generate monthly variations for each look
function generateMonthlyLooks(baseDescription: string, category: string): ImagePrompt[] {
  return occasions.map((occasion, index) => ({
    category: `looks/${category}`,
    description: `${baseDescription}, styled for ${occasion}, ${getSeasonStyle(index)}, professional beauty photography, perfect for ${getMonth(index)}`,
    filename: `${category}-${index + 1}.jpg`,
    style: getSeasonStyle(index),
    occasion,
    season: getSeason(index)
  }));
}

function getMonth(index: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[index];
}

function getSeason(index: number): string {
  const seasons = ['winter', 'spring', 'summer', 'fall'];
  return seasons[Math.floor(index / 3) % 4];
}

function getSeasonStyle(index: number): string {
  return styles[getSeason(index)];
}

const imagePrompts: ImagePrompt[] = [
  // Product Images with variations
  ...['Classic', 'Matte', 'Dewy', 'Long-Wear'].map((variant, i) => ({
    category: 'products/foundation',
    description: `Professional product photography of a luxury ${variant.toLowerCase()} foundation bottle with a gold cap, ${i % 2 ? 'dark' : 'light'} shade, beauty product photography, high-end cosmetics, studio lighting`,
    filename: `foundation-${variant.toLowerCase()}.jpg`
  })),
  
  ...['Matte', 'Cream', 'Metallic', 'Satin'].map((finish, i) => ({
    category: 'products/lipstick',
    description: `Elegant lipstick in a ${finish.toLowerCase()} finish, luxury ${['red', 'pink', 'nude', 'berry'][i]} shade, premium packaging, beauty product photography`,
    filename: `lipstick-${finish.toLowerCase()}.jpg`
  })),
  
  // Monthly Natural Looks
  ...generateMonthlyLooks(
    'Beautiful young woman with natural-looking makeup, focus on skin perfection and subtle enhancement',
    'natural'
  ),
  
  // Monthly Glam Looks
  ...generateMonthlyLooks(
    'Stunning glamorous makeup with dramatic eyes and defined features',
    'glam'
  ),
  
  // Monthly Editorial Looks
  ...generateMonthlyLooks(
    'Creative and artistic makeup with unique color combinations and geometric elements',
    'editorial'
  ),
  
  // Monthly Bridal Looks
  ...generateMonthlyLooks(
    'Elegant bridal makeup with timeless beauty and romantic elements',
    'bridal'
  ),
  
  // Professional Portfolio
  ...Array(12).fill(null).map((_, i) => ({
    category: 'portfolio/work',
    description: `Professional makeup artist working on a ${occasions[i].toLowerCase()} look, lifestyle photography in a modern studio setting, ${getSeasonStyle(i)}`,
    filename: `portfolio-${i + 1}.jpg`,
    occasion: occasions[i]
  })),
  
  // Before & After Transformations
  ...Array(12).fill(null).map((_, i) => ({
    category: 'transformations',
    description: `Side by side before and after makeup transformation, ${occasions[i].toLowerCase()} look, professional beauty photography, ${getSeasonStyle(i)}`,
    filename: `transformation-${i + 1}.jpg`,
    occasion: occasions[i]
  }))
];

const model = 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b';

async function generateImage(prompt: ImagePrompt) {
  const output = await replicate.run(model, {
    input: {
      prompt: `${prompt.description}, 8k, highly detailed, professional photography, perfect lighting, high-end fashion magazine quality`,
      negative_prompt: 'watermark, text, low quality, blurry, amateur, distorted features, deformed, disfigured, bad anatomy, unrealistic skin, poor lighting',
      ...baseParams
    }
  });

  if (Array.isArray(output) && output.length > 0) {
    const imageUrl = output[0];
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();

    // Create directory if it doesn't exist
    const dirPath = path.join(process.cwd(), 'public', 'images', prompt.category);
    await fs.mkdir(dirPath, { recursive: true });

    // Save the image
    const filePath = path.join(dirPath, prompt.filename);
    await fs.writeFile(filePath, Buffer.from(buffer));
    
    console.log(`Generated: ${prompt.category}/${prompt.filename}`);
    console.log(`Style: ${prompt.style || 'N/A'}`);
    console.log(`Occasion: ${prompt.occasion || 'N/A'}`);
    console.log('---');
  }
}

async function generateAllImages() {
  console.log('Starting image generation...');
  console.log(`Total images to generate: ${imagePrompts.length}`);
  
  for (const prompt of imagePrompts) {
    try {
      await generateImage(prompt);
      // Increased wait time to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error) {
      console.error(`Error generating ${prompt.filename}:`, error);
    }
  }
  
  console.log('Image generation complete!');
}

generateAllImages().catch(console.error);
