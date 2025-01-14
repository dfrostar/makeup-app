import React, { useEffect, useRef, useState } from 'react';
import { Look } from '../../types/auth';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { LookCard } from './LookCard';
import { Masonry } from '../shared/Masonry';

interface LookGridProps {
    looks: Look[];
    layout?: 'pinterest' | 'grid' | 'masonry';
    loading?: boolean;
    hasMore?: boolean;
    onLoadMore?: () => void;
    onLookClick?: (look: Look) => void;
}

export const LookGrid: React.FC<LookGridProps> = ({
    looks,
    layout = 'masonry',
    loading = false,
    hasMore = false,
    onLoadMore,
    onLookClick,
}) => {
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const [columns, setColumns] = useState(getInitialColumns());

    // Intersection observer for infinite loading
    useIntersectionObserver({
        target: loadMoreRef,
        onIntersect: onLoadMore,
        enabled: !loading && hasMore,
    });

    // Responsive columns
    useEffect(() => {
        const handleResize = () => {
            setColumns(getInitialColumns());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    function getInitialColumns() {
        if (typeof window === 'undefined') return 3;
        if (window.innerWidth >= 1536) return 5;
        if (window.innerWidth >= 1280) return 4;
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    }

    if (layout === 'masonry') {
        return (
            <div className="w-full">
                <Masonry columns={columns} gap={4}>
                    {looks.map((look) => (
                        <LookCard
                            key={look.id}
                            look={look}
                            onClick={() => onLookClick?.(look)}
                        />
                    ))}
                </Masonry>
                {(loading || hasMore) && (
                    <div ref={loadMoreRef} className="w-full h-20 flex items-center justify-center">
                        {loading ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
                        ) : (
                            hasMore && <div className="text-gray-400">Load more...</div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (layout === 'pinterest') {
        return (
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-4">
                {looks.map((look) => (
                    <div key={look.id} className="break-inside-avoid mb-4">
                        <LookCard
                            look={look}
                            onClick={() => onLookClick?.(look)}
                        />
                    </div>
                ))}
                {(loading || hasMore) && (
                    <div ref={loadMoreRef} className="w-full h-20 flex items-center justify-center">
                        {loading ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
                        ) : (
                            hasMore && <div className="text-gray-400">Load more...</div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {looks.map((look) => (
                <LookCard
                    key={look.id}
                    look={look}
                    onClick={() => onLookClick?.(look)}
                />
            ))}
            {(loading || hasMore) && (
                <div ref={loadMoreRef} className="w-full h-20 flex items-center justify-center">
                    {loading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
                    ) : (
                        hasMore && <div className="text-gray-400">Load more...</div>
                    )}
                </div>
            )}
        </div>
    );
};
