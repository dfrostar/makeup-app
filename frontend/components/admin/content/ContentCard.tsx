import { useState } from 'react';
import Image from 'next/image';
import { ContentItem, ContentType, ContentStatus } from '@/lib/ai/types';
import {
  DocumentMagnifyingGlassIcon,
  SparklesIcon,
  ArchiveBoxIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

interface ContentCardProps {
  content: ContentItem;
  isSelected: boolean;
  onSelect: () => void;
  onAction: (action: 'analyze' | 'optimize' | 'archive' | 'delete') => void;
}

export default function ContentCard({
  content,
  isSelected,
  onSelect,
  onAction,
}: ContentCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = (status: ContentStatus) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'archived':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'article':
        return '📄';
      case 'tutorial':
        return '📝';
      case 'review':
        return '⭐';
      case 'look':
        return '💄';
      default:
        return '📄';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div
      className={`
        relative bg-white rounded-lg shadow-sm border
        ${isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}
        transition-all duration-200
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-4 left-4 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="rounded text-blue-600 focus:ring-blue-500"
        />
      </div>

      {/* Content Preview */}
      <div className="relative h-48">
        {content.thumbnail ? (
          <Image
            src={content.thumbnail}
            alt={content.title}
            fill
            className="object-cover rounded-t-lg"
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-100 rounded-t-lg">
            <span className="text-4xl">{getTypeIcon(content.type)}</span>
          </div>
        )}

        {/* Hover Actions */}
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-t-lg flex items-center justify-center space-x-4">
            <button
              onClick={() => onAction('analyze')}
              className="p-2 bg-white rounded-full hover:bg-gray-100"
              title="Analyze Content"
            >
              <DocumentMagnifyingGlassIcon className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={() => onAction('optimize')}
              className="p-2 bg-white rounded-full hover:bg-gray-100"
              title="Optimize Content"
            >
              <SparklesIcon className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={() => onAction('archive')}
              className="p-2 bg-white rounded-full hover:bg-gray-100"
              title="Archive Content"
            >
              <ArchiveBoxIcon className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={() => onAction('delete')}
              className="p-2 bg-white rounded-full hover:bg-gray-100"
              title="Delete Content"
            >
              <TrashIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        )}
      </div>

      {/* Content Details */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
              {content.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {formatDate(content.createdAt)}
            </p>
          </div>
          <span
            className={`
              inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              ${getStatusColor(content.status)}
            `}
          >
            {content.status}
          </span>
        </div>

        {/* Metrics */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Quality Score</p>
            <div className="mt-1 flex items-center">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${content.qualityScore * 100}%` }}
                />
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {(content.qualityScore * 100).toFixed(0)}%
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Engagement</p>
            <div className="mt-1 flex items-center">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${content.engagementRate * 100}%` }}
                />
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {(content.engagementRate * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 flex justify-between">
          <button
            className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <EyeIcon className="h-4 w-4 mr-1" />
            Preview
          </button>
          <button
            className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <PencilIcon className="h-4 w-4 mr-1" />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
