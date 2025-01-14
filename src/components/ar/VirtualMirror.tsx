import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { Camera } from './Camera';
import { FaceMesh } from './FaceMesh';
import { ProductOverlay } from './ProductOverlay';
import { ColorPicker } from './ColorPicker';
import { Product } from '../../types/auth';
import { useAR } from '../../hooks/useAR';
import { useFaceDetection } from '../../hooks/useFaceDetection';
import { useMediaStream } from '../../hooks/useMediaStream';
import NeuralARService from '../../services/NeuralARService';
import arLogger from '../../utils/arLogger';
import { ExclamationCircleIcon, ArrowPathIcon, CameraIcon } from '@heroicons/react/24/outline';

interface VirtualMirrorProps {
    products: Product[];
    onCapture?: (image: string) => void;
    onProductSelect?: (product: Product) => void;
}

export const VirtualMirror: React.FC<VirtualMirrorProps> = ({
    products,
    onCapture,
    onProductSelect,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [showAllProducts, setShowAllProducts] = useState(false);
    const [intensity, setIntensity] = useState(50);

    const { stream, error: streamError } = useMediaStream();
    const { faceData, error: faceError } = useFaceDetection(videoRef);
    const { applyMakeup, error: arError } = useAR();
    const neuralARService = useRef<NeuralARService>(NeuralARService.getInstance());
    const [skinAnalysis, setSkinAnalysis] = useState<SkinAnalysis | null>(null);
    const [expression, setExpression] = useState<FacialExpression | null>(null);
    const [tracking, setTracking] = useState<FaceTracking | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const retryInitialization = () => {
        window.location.reload();
    };

    const handleReset = () => {
        setSelectedProduct(null);
        setSelectedColor(null);
    };

    // Initialize neural network models
    useEffect(() => {
        const initNeuralAR = async () => {
            try {
                await neuralARService.current.initialize();
            } catch (error) {
                arLogger.error('VirtualMirror', 'Failed to initialize neural AR', error);
            }
        };
        initNeuralAR();
    }, []);

    // Process video frames for analysis
    useEffect(() => {
        if (!videoRef.current || !canvasRef.current || isAnalyzing) return;

        const processFrame = async () => {
            if (!videoRef.current || !canvasRef.current) return;

            try {
                setIsAnalyzing(true);
                const ctx = canvasRef.current.getContext('2d');
                if (!ctx) return;

                // Draw current video frame to canvas
                ctx.drawImage(
                    videoRef.current,
                    0,
                    0,
                    canvasRef.current.width,
                    canvasRef.current.height
                );

                // Get image data for analysis
                const imageData = ctx.getImageData(
                    0,
                    0,
                    canvasRef.current.width,
                    canvasRef.current.height
                );

                // Run analyses in parallel
                const [newSkinAnalysis, newExpression, newTracking] = await Promise.all([
                    neuralARService.current.analyzeSkin(imageData),
                    neuralARService.current.detectExpression(imageData),
                    neuralARService.current.trackFace(imageData),
                ]);

                setSkinAnalysis(newSkinAnalysis);
                setExpression(newExpression);
                setTracking(newTracking);

                arLogger.debug('VirtualMirror', 'Frame analysis complete', {
                    skinTone: newSkinAnalysis.skinTone,
                    expression: newExpression.base,
                    stability: newTracking.stability.score,
                });
            } catch (error) {
                arLogger.error('VirtualMirror', 'Frame analysis failed', error);
            } finally {
                setIsAnalyzing(false);
            }
        };

        const intervalId = setInterval(processFrame, 1000); // Adjust interval based on performance
        return () => clearInterval(intervalId);
    }, [isAnalyzing]);

    // Apply makeup with enhanced features
    useEffect(() => {
        if (faceData && selectedProduct && canvasRef.current) {
            applyMakeup({
                canvas: canvasRef.current,
                face: faceData,
                product: {
                    ...selectedProduct,
                    adaptToSkin: true,
                    adaptToLighting: true,
                },
                skinAnalysis,
                expression,
                tracking,
                neuralNetwork: {
                    models: {
                        faceDetection: {
                            type: 'enhanced',
                            confidence: 0.9,
                            maxFaces: 1,
                        },
                        skinAnalysis: {
                            enabled: true,
                            updateInterval: 1000,
                        },
                        expressionDetection: {
                            enabled: true,
                            sensitivity: 0.8,
                        },
                    },
                    performance: {
                        gpuAcceleration: true,
                        powerEfficiency: true,
                        thermalManagement: true,
                    },
                    optimization: {
                        batchProcessing: true,
                        tensorCaching: true,
                        quantization: 'float16',
                    },
                },
            });
        }
    }, [faceData, selectedProduct, skinAnalysis, expression, tracking, applyMakeup]);

    // SEO metadata
    const pageTitle = 'Virtual Makeup Try-On | MakeupHub';
    const pageDescription = 'Try on makeup virtually with our AI-powered mirror. Test different products, colors, and looks in real-time with professional-grade AR technology.';

    useEffect(() => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    const handleProductSelect = (product: Product) => {
        setSelectedProduct(product);
        onProductSelect?.(product);
    };

    const handleCapture = async () => {
        if (!canvasRef.current) return;
        
        setIsCapturing(true);
        try {
            const imageData = canvasRef.current.toDataURL('image/png');
            onCapture?.(imageData);
        } finally {
            setIsCapturing(false);
        }
    };

    if (streamError || faceError || arError) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Unable to start virtual try-on
                </h2>
                <p className="text-gray-600 mb-4">
                    {streamError || faceError || arError}
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full min-h-[500px] bg-gray-900">
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
            </Head>

            {/* AR Canvas Container */}
            <div className="relative w-full h-full">
                {/* Video Feed */}
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* AR Canvas */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                />

                {/* Loading State */}
                {!stream && !streamError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
                            <p className="mt-4 text-white">Initializing camera...</p>
                        </div>
                    </div>
                )}

                {/* Error States */}
                {(streamError || faceError || arError) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
                        <div className="max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl">
                            <ExclamationCircleIcon className="h-12 w-12 text-red-500 mx-auto" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white text-center">
                                {streamError ? 'Camera Access Required' 
                                : faceError ? 'Face Detection Error'
                                : 'AR System Error'}
                            </h3>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                                {streamError || faceError || arError}
                            </p>
                            <button
                                onClick={retryInitialization}
                                className="mt-4 w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors duration-200"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}

                {/* AR Controls Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-gray-900 to-transparent">
                    <div className="max-w-4xl mx-auto">
                        {/* Product Selection */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-white">Products</h3>
                                <button
                                    onClick={() => setShowAllProducts(prev => !prev)}
                                    className="text-xs text-primary-400 hover:text-primary-300"
                                >
                                    {showAllProducts ? 'Show Less' : 'Show All'}
                                </button>
                            </div>
                            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                                {products.slice(0, showAllProducts ? undefined : 5).map((product) => (
                                    <button
                                        key={product.id}
                                        onClick={() => setSelectedProduct(product)}
                                        className={`flex-shrink-0 group relative ${
                                            selectedProduct?.id === product.id
                                                ? 'ring-2 ring-primary-500'
                                                : 'hover:ring-2 hover:ring-primary-400/50'
                                        } rounded-lg overflow-hidden transition-all duration-200`}
                                    >
                                        <img
                                            src={product.thumbnail}
                                            alt={product.name}
                                            className="w-16 h-16 object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                        <div className="absolute inset-x-0 bottom-0 p-1 text-xs text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            {product.name}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* AR Controls */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                {/* Color Selection */}
                                {selectedProduct?.colors && (
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs text-gray-400">Color:</span>
                                        <div className="flex space-x-1">
                                            {selectedProduct.colors.map((color) => (
                                                <button
                                                    key={color}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`w-6 h-6 rounded-full ${
                                                        selectedColor === color
                                                            ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-gray-900'
                                                            : 'hover:ring-2 hover:ring-primary-400/50 hover:ring-offset-2 hover:ring-offset-gray-900'
                                                    } transition-all duration-200`}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Intensity Slider */}
                                <div className="flex items-center space-x-2">
                                    <span className="text-xs text-gray-400">Intensity:</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={intensity}
                                        onChange={(e) => setIntensity(Number(e.target.value))}
                                        className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={handleReset}
                                    className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors duration-200"
                                    title="Reset"
                                >
                                    <ArrowPathIcon className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={handleCapture}
                                    disabled={isCapturing}
                                    className={`p-2 ${
                                        isCapturing
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-primary-500 hover:bg-primary-600 text-white'
                                    } rounded-full transition-colors duration-200`}
                                    title="Take Photo"
                                >
                                    <CameraIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skin Analysis Overlay */}
                {skinAnalysis && (
                    <div className="absolute top-4 right-4 max-w-xs bg-white/10 backdrop-blur-lg rounded-lg p-4 text-white">
                        <h4 className="text-sm font-medium mb-2">Skin Analysis</h4>
                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span>Tone:</span>
                                <span>{skinAnalysis.skinTone.undertone}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Type:</span>
                                <span>{skinAnalysis.skinType.type}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Lighting:</span>
                                <span>{skinAnalysis.lighting.quality}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
