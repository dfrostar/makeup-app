import React, { useEffect, useRef } from 'react';
import { Product } from '../../types/auth';
import { FaceLandmarks } from '../../types/ar';
import { useProductRenderer } from '../../hooks/useProductRenderer';

interface ProductOverlayProps {
    product: Product;
    position: FaceLandmarks | null;
    color?: string | null;
    opacity?: number;
}

export const ProductOverlay: React.FC<ProductOverlayProps> = ({
    product,
    position,
    color = null,
    opacity = 0.8,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { renderProduct, error } = useProductRenderer();

    useEffect(() => {
        if (!canvasRef.current || !position) return;

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        // Clear previous render
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Render product overlay
        renderProduct({
            ctx,
            product,
            landmarks: position,
            color,
            opacity,
        });
    }, [product, position, color, opacity, renderProduct]);

    if (error) {
        console.error('Product overlay error:', error);
        return null;
    }

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden="true"
        />
    );
};
