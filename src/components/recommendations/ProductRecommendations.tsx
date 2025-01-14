import React from 'react';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import { Product } from '../../types/auth';
import { generateProductSchema } from '../../utils/seo';
import { useUnifiedRecommendations } from '../../hooks/useUnifiedRecommendations';
import { Rating } from '../common/Rating';
import { Badge } from '../common/Badge';
import { motion } from 'framer-motion';
import { Tooltip } from '../common/Tooltip';

interface ProductRecommendationsProps {
    userPreferences: {
        skinType: string;
        skinTone: string;
        concerns: string[];
    };
    recentlyViewed: Product[];
    purchaseHistory: Product[];
}

export const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
    userPreferences,
    recentlyViewed,
    purchaseHistory,
}) => {
    const {
        personalizedRecommendations,
        trendingProducts,
        similarProducts,
        qualityScores,
        insights,
        isLoading,
        error,
    } = useUnifiedRecommendations({
        userPreferences,
        recentlyViewed,
        purchaseHistory,
    });

    const seoTitle = 'Personalized Makeup Recommendations | MakeupHub';
    const seoDescription = `Discover makeup products tailored to your ${userPreferences.skinType} skin type and ${userPreferences.skinTone} skin tone. Get personalized beauty recommendations based on your preferences.`;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500">
                    Unable to load recommendations. Please try again later.
                </p>
            </div>
        );
    }

    const renderProduct = (product: Product) => {
        const quality = qualityScores[product.id] || 0;
        const productInsights = insights[product.id] || [];

        return (
            <motion.article
                key={product.id}
                className="group relative"
                itemScope
                itemType="https://schema.org/Product"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(
                            generateProductSchema(product)
                        ),
                    }}
                />
                <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                        src={product.images[0].url}
                        alt={product.name}
                        layout="fill"
                        objectFit="cover"
                        className="group-hover:opacity-75 transition-opacity duration-300"
                    />
                    {quality >= 0.9 && (
                        <Badge
                            className="absolute top-2 right-2"
                            variant="success"
                        >
                            Top Rated
                        </Badge>
                    )}
                </div>
                <div className="mt-4 flex justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-gray-900">
                            <a href={`/products/${product.id}`}>
                                <span
                                    aria-hidden="true"
                                    className="absolute inset-0"
                                />
                                {product.name}
                            </a>
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {product.brand}
                        </p>
                    </div>
                    <Tooltip content={productInsights.join(' • ')}>
                        <div className="flex items-center">
                            <Rating value={quality * 5} />
                            <span className="ml-2 text-sm text-gray-500">
                                {(quality * 100).toFixed(0)}%
                            </span>
                        </div>
                    </Tooltip>
                </div>
                <p className="mt-2 text-sm font-medium text-gray-900">
                    ${product.price.toFixed(2)}
                </p>
            </motion.article>
        );
    };

    return (
        <>
            <NextSeo
                title={seoTitle}
                description={seoDescription}
                openGraph={{
                    title: seoTitle,
                    description: seoDescription,
                    type: 'website',
                }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Personalized Recommendations */}
                <section aria-labelledby="personalized-heading">
                    <h2
                        id="personalized-heading"
                        className="text-2xl font-bold text-gray-900"
                    >
                        Recommended for You
                    </h2>
                    <p className="mt-2 text-gray-600">
                        Based on your skin type, tone, and preferences
                    </p>
                    <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
                        {personalizedRecommendations.map(renderProduct)}
                    </div>
                </section>

                {/* Trending Products */}
                <section aria-labelledby="trending-heading" className="mt-16">
                    <h2
                        id="trending-heading"
                        className="text-2xl font-bold text-gray-900"
                    >
                        Trending Now
                    </h2>
                    <p className="mt-2 text-gray-600">
                        Popular products loved by our community
                    </p>
                    <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
                        {trendingProducts.map(renderProduct)}
                    </div>
                </section>

                {/* Similar Products */}
                {similarProducts.length > 0 && (
                    <section aria-labelledby="similar-heading" className="mt-16">
                        <h2
                            id="similar-heading"
                            className="text-2xl font-bold text-gray-900"
                        >
                            You Might Also Like
                        </h2>
                        <p className="mt-2 text-gray-600">
                            Based on your recently viewed items
                        </p>
                        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
                            {similarProducts.map(renderProduct)}
                        </div>
                    </section>
                )}
            </div>
        </>
    );
};
