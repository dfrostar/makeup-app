import type { WebGLSecurity } from '@/types/ar';

export class WebGLSecurityManager {
  private context: WebGLRenderingContext | WebGL2RenderingContext;
  private config: WebGLSecurity;
  private secureExtensions: Set<string>;
  private originalFunctions: Map<string, Function>;

  constructor(
    context: WebGLRenderingContext | WebGL2RenderingContext,
    config: WebGLSecurity
  ) {
    this.context = context;
    this.config = config;
    this.secureExtensions = new Set([
      'WEBGL_debug_renderer_info',
      'WEBGL_debug_shaders'
    ]);
    this.originalFunctions = new Map();

    if (config.contextIsolation) {
      this.isolateContext();
    }

    if (config.textureProtection) {
      this.protectTextures();
    }

    if (config.secureContext) {
      this.enforceSecureContext();
    }
  }

  /**
   * Isolate WebGL context to prevent interference
   */
  private isolateContext(): void {
    // Store original functions
    const functionsToProtect = [
      'getExtension',
      'getParameter',
      'getShaderPrecisionFormat'
    ];

    functionsToProtect.forEach(funcName => {
      this.originalFunctions.set(
        funcName,
        (this.context as any)[funcName].bind(this.context)
      );
    });

    // Override getExtension to block sensitive extensions
    this.context.getExtension = (name: string): any => {
      if (this.secureExtensions.has(name)) {
        console.warn(`Access to extension ${name} blocked for security`);
        return null;
      }
      return this.originalFunctions.get('getExtension')!(name);
    };

    // Override getParameter to hide hardware details
    this.context.getParameter = (pname: number): any => {
      const sensitiveParams = new Set([
        this.context.VENDOR,
        this.context.RENDERER,
        this.context.VERSION,
        this.context.SHADING_LANGUAGE_VERSION
      ]);

      if (sensitiveParams.has(pname)) {
        return 'WebGL Secure Context';
      }
      return this.originalFunctions.get('getParameter')!(pname);
    };
  }

  /**
   * Protect textures from unauthorized access
   */
  private protectTextures(): void {
    const originalTexImage2D = this.context.texImage2D.bind(this.context);
    const originalReadPixels = this.context.readPixels.bind(this.context);

    // Override texImage2D to validate sources
    this.context.texImage2D = (...args: any[]): void => {
      const source = args[5];
      if (source && !this.isValidTextureSource(source)) {
        throw new Error('Invalid texture source');
      }
      originalTexImage2D(...args);
    };

    // Override readPixels to prevent unauthorized reads
    this.context.readPixels = (...args: any[]): void => {
      if (!this.isSecureReadAllowed()) {
        throw new Error('Texture read access denied');
      }
      originalReadPixels(...args);
    };
  }

  /**
   * Enforce secure context requirements
   */
  private enforceSecureContext(): void {
    if (!window.isSecureContext) {
      throw new Error('Secure context required for WebGL operations');
    }

    // Enable security extensions if available
    const securityExtensions = [
      'WEBGL_security_sensitive_resources',
      'WEBGL_lose_context'
    ];

    securityExtensions.forEach(ext => {
      const extension = this.context.getExtension(ext);
      if (extension) {
        // Configure security-related extension settings
        this.configureSecurityExtension(extension);
      }
    });
  }

  /**
   * Configure security-related WebGL extensions
   */
  private configureSecurityExtension(extension: any): void {
    if (extension.name === 'WEBGL_security_sensitive_resources') {
      extension.enableSecureMode?.();
    }
  }

  /**
   * Validate texture source
   */
  private isValidTextureSource(source: any): boolean {
    const validSources = [
      HTMLImageElement,
      HTMLCanvasElement,
      HTMLVideoElement,
      ImageBitmap,
      ImageData
    ];

    return validSources.some(type => source instanceof type) &&
           this.isSourceSecure(source);
  }

  /**
   * Check if source is from secure origin
   */
  private isSourceSecure(source: any): boolean {
    if (source instanceof HTMLImageElement) {
      try {
        const url = new URL(source.src);
        return url.protocol === 'https:' ||
               url.hostname === 'localhost' ||
               url.hostname === '127.0.0.1';
      } catch {
        return false;
      }
    }
    return true;
  }

  /**
   * Check if pixel reading is allowed
   */
  private isSecureReadAllowed(): boolean {
    // Check if we're in a secure context
    if (!window.isSecureContext) {
      return false;
    }

    // Check if the frame context is secure
    try {
      return window.parent === window || // Same origin
             document.referrer.startsWith('https://');
    } catch {
      return false; // Cross-origin iframe
    }
  }

  /**
   * Clean up security overrides
   */
  dispose(): void {
    // Restore original functions
    this.originalFunctions.forEach((func, name) => {
      (this.context as any)[name] = func;
    });

    this.originalFunctions.clear();
    this.secureExtensions.clear();
  }

  /**
   * Check if context is secure
   */
  isContextSecure(): boolean {
    return window.isSecureContext &&
           this.context instanceof WebGLRenderingContext &&
           !this.context.isContextLost();
  }

  /**
   * Get security status
   */
  getSecurityStatus(): Record<string, boolean> {
    return {
      contextIsolation: this.config.contextIsolation,
      textureProtection: this.config.textureProtection,
      secureContext: this.config.secureContext,
      isSecure: this.isContextSecure()
    };
  }
}
