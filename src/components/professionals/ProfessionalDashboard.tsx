import React, { useState } from 'react';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import { Professional, Appointment, Review, Analytics } from '../../types/auth';
import { generateProfessionalSchema } from '../../utils/seo';
import { Calendar } from '../common/Calendar';
import { Chart } from '../common/Chart';
import { Stats } from '../common/Stats';

interface ProfessionalDashboardProps {
    professional: Professional;
    appointments: Appointment[];
    reviews: Review[];
    analytics: Analytics;
}

export const ProfessionalDashboard: React.FC<ProfessionalDashboardProps> = ({
    professional,
    appointments,
    reviews,
    analytics,
}) => {
    const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('week');
    const [selectedMetric, setSelectedMetric] = useState<'bookings' | 'revenue' | 'rating'>('bookings');

    const seoTitle = `${professional.name}'s Professional Dashboard | MakeupHub`;
    const seoDescription = `Manage your makeup artist profile, appointments, reviews, and analytics. Track your performance and grow your business with MakeupHub.`;

    const stats = [
        {
            name: 'Total Bookings',
            value: analytics.totalBookings,
            change: analytics.bookingGrowth,
            changeType: analytics.bookingGrowth >= 0 ? 'increase' : 'decrease',
        },
        {
            name: 'Total Revenue',
            value: `$${analytics.totalRevenue.toLocaleString()}`,
            change: analytics.revenueGrowth,
            changeType: analytics.revenueGrowth >= 0 ? 'increase' : 'decrease',
        },
        {
            name: 'Average Rating',
            value: analytics.averageRating.toFixed(1),
            change: analytics.ratingGrowth,
            changeType: analytics.ratingGrowth >= 0 ? 'increase' : 'decrease',
        },
        {
            name: 'Profile Views',
            value: analytics.profileViews,
            change: analytics.viewsGrowth,
            changeType: analytics.viewsGrowth >= 0 ? 'increase' : 'decrease',
        },
    ];

    return (
        <>
            <NextSeo
                title={seoTitle}
                description={seoDescription}
                noindex={true} // Dashboard should not be indexed
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(generateProfessionalSchema(professional)),
                }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="md:flex md:items-center md:justify-between">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl font-bold text-gray-900 truncate">
                            Welcome back, {professional.name}
                        </h1>
                    </div>
                    <div className="mt-4 flex md:mt-0 md:ml-4">
                        <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            Edit Profile
                        </button>
                        <button
                            type="button"
                            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            View Public Profile
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-8">
                    <Stats stats={stats} />
                </div>

                {/* Analytics Chart */}
                <div className="mt-8">
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6">
                            <div className="sm:flex sm:items-center sm:justify-between">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Performance Analytics
                                </h3>
                                <div className="mt-3 sm:mt-0 sm:ml-4">
                                    <div className="flex space-x-4">
                                        <select
                                            value={selectedMetric}
                                            onChange={(e) =>
                                                setSelectedMetric(
                                                    e.target.value as any
                                                )
                                            }
                                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                                        >
                                            <option value="bookings">Bookings</option>
                                            <option value="revenue">Revenue</option>
                                            <option value="rating">Rating</option>
                                        </select>
                                        <select
                                            value={timeframe}
                                            onChange={(e) =>
                                                setTimeframe(e.target.value as any)
                                            }
                                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                                        >
                                            <option value="day">Daily</option>
                                            <option value="week">Weekly</option>
                                            <option value="month">Monthly</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6">
                                <Chart
                                    data={analytics.getChartData(selectedMetric, timeframe)}
                                    metric={selectedMetric}
                                    timeframe={timeframe}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upcoming Appointments */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900">
                                Upcoming Appointments
                            </h3>
                            <div className="mt-6">
                                <Calendar
                                    appointments={appointments}
                                    onAppointmentClick={(appointment) => {
                                        // Handle appointment click
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Recent Reviews */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900">
                                Recent Reviews
                            </h3>
                            <div className="mt-6 flow-root">
                                <ul className="-my-5 divide-y divide-gray-200">
                                    {reviews.slice(0, 5).map((review) => (
                                        <li key={review.id} className="py-5">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0">
                                                    <Image
                                                        src={review.author.avatar}
                                                        alt={review.author.name}
                                                        width={40}
                                                        height={40}
                                                        className="rounded-full"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {review.author.name}
                                                    </p>
                                                    <div className="flex items-center mt-1">
                                                        <div className="flex items-center">
                                                            {[0, 1, 2, 3, 4].map((rating) => (
                                                                <svg
                                                                    key={rating}
                                                                    className={`h-5 w-5 ${
                                                                        review.rating > rating
                                                                            ? 'text-yellow-400'
                                                                            : 'text-gray-300'
                                                                    }`}
                                                                    fill="currentColor"
                                                                    viewBox="0 0 20 20"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M10 15.934L4.618 19.247l1.03-6.987L.836 7.653l6.342-.892L10 .453l2.822 6.308 6.342.892-4.812 4.607 1.03 6.987L10 15.934z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                            ))}
                                                        </div>
                                                        <p className="ml-2 text-sm text-gray-500">
                                                            {new Date(review.date).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <p className="mt-2 text-sm text-gray-600">
                                                        {review.content}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
