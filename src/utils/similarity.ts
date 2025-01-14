/**
 * Calculate similarity score between two items based on their properties
 */
export function getSimilarityScore(item1: any, item2: any, weights: { [key: string]: number } = {}): number {
  const defaultWeights = {
    category: 0.3,
    tags: 0.3,
    price: 0.2,
    brand: 0.2,
    ...weights
  };

  let score = 0;
  let totalWeight = 0;

  // Category similarity
  if (item1.category && item2.category) {
    score += defaultWeights.category * (item1.category === item2.category ? 1 : 0);
    totalWeight += defaultWeights.category;
  }

  // Tags similarity
  if (item1.tags && item2.tags) {
    const commonTags = item1.tags.filter((tag: string) => item2.tags.includes(tag));
    const uniqueTags = new Set([...item1.tags, ...item2.tags]);
    score += defaultWeights.tags * (commonTags.length / uniqueTags.size);
    totalWeight += defaultWeights.tags;
  }

  // Price similarity (if applicable)
  if (item1.price && item2.price) {
    const priceDiff = Math.abs(item1.price - item2.price);
    const maxPrice = Math.max(item1.price, item2.price);
    const priceScore = 1 - (priceDiff / maxPrice);
    score += defaultWeights.price * priceScore;
    totalWeight += defaultWeights.price;
  }

  // Brand similarity (if applicable)
  if (item1.brand && item2.brand) {
    score += defaultWeights.brand * (item1.brand === item2.brand ? 1 : 0);
    totalWeight += defaultWeights.brand;
  }

  return totalWeight > 0 ? score / totalWeight : 0;
}
