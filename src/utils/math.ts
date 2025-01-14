/**
 * Calculate weighted average of values
 */
export function weightedAverage(values: number[], weights: number[]): number {
  if (values.length !== weights.length) {
    throw new Error('Values and weights arrays must have the same length');
  }

  const sum = values.reduce((acc, val, i) => acc + val * weights[i], 0);
  const weightSum = weights.reduce((acc, val) => acc + val, 0);

  return weightSum === 0 ? 0 : sum / weightSum;
}

/**
 * Calculate momentum score based on current and historical values
 */
export function calculateMomentum(current: number, historical: number[]): number {
  if (historical.length === 0) return 0;

  const average = historical.reduce((a, b) => a + b) / historical.length;
  const change = current - average;
  const maxChange = Math.max(...historical) - Math.min(...historical);

  return maxChange === 0 ? 0 : Math.max(0, Math.min(1, (change + maxChange) / (2 * maxChange)));
}

/**
 * Normalize a value between 0 and 1
 */
export function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

/**
 * Calculate exponential moving average
 */
export function exponentialMovingAverage(values: number[], alpha: number = 0.2): number[] {
  const ema: number[] = [values[0]];
  
  for (let i = 1; i < values.length; i++) {
    ema.push(alpha * values[i] + (1 - alpha) * ema[i - 1]);
  }
  
  return ema;
}
