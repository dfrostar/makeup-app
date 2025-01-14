import React from 'react';
import Image from 'next/image';
import { Look } from '../../types/auth';
import { HeartIcon, BookmarkIcon, ShareIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface LookCardProps {
    look: Look;
    onClick?: () => void;
}

export const LookCard: React.FC<LookCardProps> = ({ look, onClick }) => {
    const [liked, setLiked] = React.useState(false);
    const [saved, setSaved] = React.useState(false);

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        setLiked(!liked);
    };

    const handleSave = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSaved(!saved);
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Implement share functionality
    };

    return (
        <div
            className="group relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
            onClick={onClick}
        >
            {/* Main Image */}
            <div className="aspect-[3/4] relative">
                <Image
                    src={look.images[0].url}
                    alt={look.images[0].alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={handleLike}
                        className="p-2 rounded-full bg-white/90 hover:bg-white shadow-sm hover:shadow-md transition-all duration-300"
                    >
                        {liked ? (
                            <HeartIconSolid className="w-5 h-5 text-red-500" />
                        ) : (
                            <HeartIcon className="w-5 h-5 text-gray-600" />
                        )}
                    </button>
                    
                    <button
                        onClick={handleSave}
                        className="p-2 rounded-full bg-white/90 hover:bg-white shadow-sm hover:shadow-md transition-all duration-300"
                    >
                        <BookmarkIcon className={`w-5 h-5 ${saved ? 'text-primary-500' : 'text-gray-600'}`} />
                    </button>
                    
                    <button
                        onClick={handleShare}
                        className="p-2 rounded-full bg-white/90 hover:bg-white shadow-sm hover:shadow-md transition-all duration-300"
                    >
                        <ShareIcon className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                    {look.title}
                </h3>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                    {look.description}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-2">
                    {look.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                        >
                            {tag}
                        </span>
                    ))}
                    {look.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            +{look.tags.length - 3}
                        </span>
                    )}
                </div>
                
                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <HeartIcon className="w-4 h-4" />
                        <span>{look.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="capitalize">{look.difficulty}</span>
                        <span>•</span>
                        <span>{look.timeEstimate}min</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
