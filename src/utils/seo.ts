import { NextSeoProps } from 'next-seo';

interface SEOConfig {
    title: string;
    description: string;
    canonical?: string;
    keywords?: string[];
    image?: string;
}

export const generateSEOConfig = ({
    title,
    description,
    canonical,
    keywords,
    image,
}: SEOConfig): NextSeoProps => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://makeupdir.com';
    const defaultImage = `${baseUrl}/images/default-og-image.jpg`;

    return {
        title,
        description,
        canonical: canonical ? `${baseUrl}${canonical}` : undefined,
        openGraph: {
            type: 'website',
            locale: 'en_US',
            url: canonical ? `${baseUrl}${canonical}` : baseUrl,
            site_name: 'MakeupHub',
            title,
            description,
            images: [
                {
                    url: image || defaultImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            handle: '@makeupHub',
            site: '@makeupHub',
            cardType: 'summary_large_image',
        },
        additionalMetaTags: [
            {
                name: 'keywords',
                content: keywords?.join(', ') || 'makeup, beauty, cosmetics, virtual try-on',
            },
        ],
    };
};

export const generateProductSchema = (product: any) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.images[0]?.url,
        description: product.description,
        brand: {
            '@type': 'Brand',
            name: product.brand,
        },
        offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'USD',
            availability: product.inStock
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
        },
        aggregateRating: product.rating && {
            '@type': 'AggregateRating',
            ratingValue: product.rating.average,
            reviewCount: product.rating.count,
        },
    };
};

export const generateProfessionalSchema = (professional: any) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: professional.name,
        image: professional.image,
        description: professional.bio,
        jobTitle: professional.title,
        worksFor: professional.organization && {
            '@type': 'Organization',
            name: professional.organization,
        },
        hasCredential: professional.certifications?.map((cert: any) => ({
            '@type': 'EducationalOccupationalCredential',
            name: cert.name,
            url: cert.url,
        })),
    };
};

export const generateTutorialSchema = (tutorial: any) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: tutorial.title,
        description: tutorial.description,
        image: tutorial.image,
        step: tutorial.steps.map((step: any) => ({
            '@type': 'HowToStep',
            name: step.title,
            text: step.description,
            image: step.image,
        })),
        tool: tutorial.products.map((product: any) => ({
            '@type': 'HowToTool',
            name: product.name,
        })),
    };
};

export const generateVirtualTryOnSchema = () => {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Virtual Makeup Try-on',
        applicationCategory: 'Beauty & Makeup',
        operatingSystem: 'Web Browser',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
        featureList: [
            'Real-time virtual makeup try-on',
            'AI-powered face detection',
            'Professional-grade AR technology',
            'Multiple product categories',
            'Color customization',
        ],
    };
};

export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${process.env.NEXT_PUBLIC_BASE_URL}${item.url}`,
        })),
    };
};

export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };
};

export const generateArticleSchema = (article: any) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        image: article.image,
        author: {
            '@type': 'Person',
            name: article.author.name,
        },
        publisher: {
            '@type': 'Organization',
            name: 'MakeupHub',
            logo: {
                '@type': 'ImageObject',
                url: `${process.env.NEXT_PUBLIC_BASE_URL}/images/logo.png`,
            },
        },
        datePublished: article.publishDate,
        dateModified: article.modifiedDate,
        description: article.description,
        articleBody: article.content,
    };
};

export const generateVideoSchema = (video: any) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: video.title,
        description: video.description,
        thumbnailUrl: video.thumbnail,
        uploadDate: video.uploadDate,
        duration: video.duration,
        contentUrl: video.url,
        embedUrl: video.embedUrl,
        interactionStatistic: {
            '@type': 'InteractionCounter',
            interactionType: { '@type': 'WatchAction' },
            userInteractionCount: video.views,
        },
    };
};
