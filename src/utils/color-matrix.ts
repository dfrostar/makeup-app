import * as tf from '@tensorflow/tfjs';

export class ColorMatrix {
  // Standard illuminant D65
  private static readonly D65 = [0.95047, 1.0, 1.08883];

  // sRGB to XYZ conversion matrix
  private static readonly RGB2XYZ = [
    [0.4124564, 0.3575761, 0.1804375],
    [0.2126729, 0.7151522, 0.0721750],
    [0.0193339, 0.1191920, 0.9503041]
  ];

  // XYZ to sRGB conversion matrix
  private static readonly XYZ2RGB = [
    [ 3.2404542, -1.5371385, -0.4985314],
    [-0.9692660,  1.8760108,  0.0415560],
    [ 0.0556434, -0.2040259,  1.0572252]
  ];

  /**
   * Convert RGB to LAB color space
   */
  static rgb2lab(rgb: tf.Tensor3D): tf.Tensor3D {
    return tf.tidy(() => {
      // Normalize RGB values
      const normalizedRGB = tf.div(rgb, 255);

      // Convert to XYZ
      const xyz = tf.dot(normalizedRGB, this.RGB2XYZ);

      // Normalize by D65
      const normalizedXYZ = tf.div(xyz, this.D65);

      // Apply LAB conversion function
      const f = tf.where(
        tf.greater(normalizedXYZ, 0.008856),
        tf.pow(normalizedXYZ, 1/3),
        tf.add(tf.mul(normalizedXYZ, 7.787), 16/116)
      );

      // Calculate LAB channels
      const L = tf.sub(tf.mul(116, f.gather([1], 1)), 16);
      const a = tf.mul(500, tf.sub(f.gather([0], 1), f.gather([1], 1)));
      const b = tf.mul(200, tf.sub(f.gather([1], 1), f.gather([2], 1)));

      // Combine channels
      return tf.stack([L, a, b], -1);
    });
  }

  /**
   * Calculate white balance correction matrix
   */
  static calculateWhiteBalanceMatrix(whitePoint: tf.Tensor): tf.Tensor2D {
    return tf.tidy(() => {
      // Calculate scaling factors
      const scale = tf.div(this.D65, whitePoint);

      // Create diagonal matrix
      return tf.diag(scale);
    });
  }

  /**
   * Extract luminance channel from RGB image
   */
  static extractLuminance(rgb: tf.Tensor3D): tf.Tensor2D {
    return tf.tidy(() => {
      // Use Rec. 709 coefficients for luminance
      const weights = tf.tensor1d([0.2126, 0.7152, 0.0722]);
      return tf.sum(tf.mul(rgb, weights), -1);
    });
  }

  /**
   * Calculate lighting compensation matrix
   */
  static calculateLightingCompensation(
    distribution: { mean: tf.Tensor, variance: tf.Tensor }
  ): tf.Tensor2D {
    return tf.tidy(() => {
      const { mean, variance } = distribution;

      // Calculate gamma correction
      const gamma = tf.div(1.0, tf.add(1.0, tf.sqrt(variance)));

      // Calculate brightness adjustment
      const brightness = tf.sub(1.0, mean);

      // Create compensation matrix
      return tf.diag(tf.mul(gamma, brightness));
    });
  }

  /**
   * Extract color checker patches from image
   */
  static extractColorCheckerPatches(
    colorChecker: tf.Tensor3D
  ): tf.Tensor2D {
    return tf.tidy(() => {
      // Assume 24-patch color checker
      const patchSize = 64;
      const numPatches = 24;
      const patches: tf.Tensor2D[] = [];

      // Extract each patch
      for (let i = 0; i < numPatches; i++) {
        const row = Math.floor(i / 6);
        const col = i % 6;
        
        const patch = tf.slice(
          colorChecker,
          [row * patchSize, col * patchSize, 0],
          [patchSize, patchSize, 3]
        );

        // Calculate average color
        patches.push(tf.mean(patch, [0, 1]));
      }

      return tf.stack(patches);
    });
  }

  /**
   * Calculate color differences between patches
   */
  static calculateColorDifferences(
    patches: tf.Tensor2D,
    reference: Float32Array
  ): tf.Tensor1D {
    return tf.tidy(() => {
      const referenceTensor = tf.tensor2d(
        reference,
        [24, 3]
      );

      // Convert both to LAB
      const patchesLAB = this.rgb2lab(patches.expandDims(0)).squeeze();
      const referenceLAB = this.rgb2lab(referenceTensor.expandDims(0)).squeeze();

      // Calculate Delta E (CIE2000)
      return this.deltaE2000(patchesLAB, referenceLAB);
    });
  }

  /**
   * Calculate Delta E 2000 color difference
   */
  private static deltaE2000(
    lab1: tf.Tensor2D,
    lab2: tf.Tensor2D
  ): tf.Tensor1D {
    return tf.tidy(() => {
      // Extract L, a, b values
      const L1 = lab1.gather([0], 1);
      const a1 = lab1.gather([1], 1);
      const b1 = lab1.gather([2], 1);
      const L2 = lab2.gather([0], 1);
      const a2 = lab2.gather([1], 1);
      const b2 = lab2.gather([2], 1);

      // Calculate C1, C2 (Chroma)
      const C1 = tf.sqrt(tf.add(tf.square(a1), tf.square(b1)));
      const C2 = tf.sqrt(tf.add(tf.square(a2), tf.square(b2)));

      // Calculate h1, h2 (Hue angle)
      const h1 = tf.atan2(b1, a1);
      const h2 = tf.atan2(b2, a2);

      // Calculate ΔL, ΔC, ΔH
      const deltaL = tf.sub(L2, L1);
      const deltaC = tf.sub(C2, C1);
      const deltaH = tf.mul(2, tf.sqrt(tf.mul(C1, C2)), tf.sin(tf.div(tf.sub(h2, h1), 2)));

      // Calculate CIEDE2000 color difference
      return tf.sqrt(
        tf.add(
          tf.add(
            tf.square(tf.div(deltaL, 1)),
            tf.square(tf.div(deltaC, 1))
          ),
          tf.square(tf.div(deltaH, 1))
        )
      );
    });
  }
}
