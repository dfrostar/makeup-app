import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { NextSeo } from 'next-seo';
import { generateProfessionalSchema } from '../../utils/seo';
import { Professional, Review } from '../../types/auth';
import { Rating } from '../common/Rating';
import { Gallery } from '../common/Gallery';
import { Availability } from './Availability';
import { BookingForm } from './BookingForm';

interface ProfessionalProfileProps {
    professional: Professional;
    reviews: Review[];
}

export const ProfessionalProfile: React.FC<ProfessionalProfileProps> = ({
    professional,
    reviews,
}) => {
    const seoTitle = `${professional.name} - Professional Makeup Artist | MakeupHub`;
    const seoDescription = `Book ${professional.name}, a professional makeup artist specializing in ${professional.specialties.join(
        ', '
    )}. View portfolio, reviews, and availability.`;

    return (
        <>
            <NextSeo
                title={seoTitle}
                description={seoDescription}
                openGraph={{
                    title: seoTitle,
                    description: seoDescription,
                    images: [
                        {
                            url: professional.profileImage,
                            width: 1200,
                            height: 630,
                            alt: professional.name,
                        },
                    ],
                }}
            />

            <Head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(generateProfessionalSchema(professional)),
                    }}
                />
            </Head>

            <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Profile Header */}
                <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                    <div>
                        <div className="relative aspect-square w-full rounded-lg overflow-hidden">
                            <Image
                                src={professional.profileImage}
                                alt={professional.name}
                                layout="fill"
                                objectFit="cover"
                                priority
                            />
                        </div>
                    </div>

                    <div className="mt-8 lg:mt-0">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {professional.name}
                        </h1>
                        <p className="mt-2 text-lg text-gray-600">
                            {professional.title}
                        </p>

                        <div className="mt-4 flex items-center">
                            <Rating value={professional.rating} />
                            <span className="ml-2 text-sm text-gray-600">
                                ({reviews.length} reviews)
                            </span>
                        </div>

                        <div className="mt-6 prose prose-indigo">
                            <p>{professional.bio}</p>
                        </div>

                        <div className="mt-6">
                            <h2 className="text-lg font-medium text-gray-900">
                                Specialties
                            </h2>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {professional.specialties.map((specialty) => (
                                    <span
                                        key={specialty}
                                        className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                                    >
                                        {specialty}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6">
                            <h2 className="text-lg font-medium text-gray-900">
                                Certifications
                            </h2>
                            <ul className="mt-2 space-y-2">
                                {professional.certifications.map((cert) => (
                                    <li
                                        key={cert.name}
                                        className="flex items-center text-gray-600"
                                    >
                                        <svg
                                            className="h-5 w-5 text-primary-500 mr-2"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {cert.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Portfolio Gallery */}
                <section className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900">Portfolio</h2>
                    <div className="mt-6">
                        <Gallery images={professional.portfolio} />
                    </div>
                </section>

                {/* Availability Calendar */}
                <section className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Availability
                    </h2>
                    <div className="mt-6">
                        <Availability schedule={professional.availability} />
                    </div>
                </section>

                {/* Booking Form */}
                <section className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Book a Session
                    </h2>
                    <div className="mt-6">
                        <BookingForm professional={professional} />
                    </div>
                </section>

                {/* Reviews */}
                <section className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Client Reviews
                    </h2>
                    <div className="mt-6 space-y-8">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="bg-white p-6 rounded-lg shadow"
                            >
                                <div className="flex items-center">
                                    <Image
                                        src={review.author.avatar}
                                        alt={review.author.name}
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {review.author.name}
                                        </h3>
                                        <Rating value={review.rating} />
                                    </div>
                                </div>
                                <p className="mt-4 text-gray-600">
                                    {review.content}
                                </p>
                                {review.images && (
                                    <div className="mt-4 flex gap-4">
                                        {review.images.map((image, index) => (
                                            <div
                                                key={index}
                                                className="relative w-24 h-24"
                                            >
                                                <Image
                                                    src={image}
                                                    alt={`Review image ${index + 1}`}
                                                    layout="fill"
                                                    objectFit="cover"
                                                    className="rounded-lg"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </article>
        </>
    );
};
