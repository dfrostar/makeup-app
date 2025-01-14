import { useState, useEffect } from 'react';
import { UnifiedAIService } from '@/lib/ai/UnifiedAIService';
import { ContentItem, ContentType, ContentStatus } from '@/lib/ai/types';
import ContentCard from './ContentCard';
import ContentBulkActions from './ContentBulkActions';
import Pagination from '@/components/common/Pagination';

export default function ContentList() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<'date' | 'quality' | 'engagement'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadContent();
  }, [page, sortBy, sortOrder]);

  const loadContent = async () => {
    setIsLoading(true);
    try {
      const aiService = UnifiedAIService.getInstance();
      const response = await aiService.getContent({
        page,
        sortBy,
        sortOrder,
        limit: 12,
      });
      
      setContent(response.items);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field: 'date' | 'quality' | 'engagement') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleSelect = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedItems(
      selectedItems.length === content.length
        ? []
        : content.map(item => item.id)
    );
  };

  const handleBulkAction = async (action: 'analyze' | 'optimize' | 'archive' | 'delete') => {
    try {
      const aiService = UnifiedAIService.getInstance();
      
      switch (action) {
        case 'analyze':
          await aiService.analyzeContentBulk(selectedItems);
          break;
        case 'optimize':
          await aiService.optimizeContentBulk(selectedItems);
          break;
        case 'archive':
          await aiService.archiveContentBulk(selectedItems);
          break;
        case 'delete':
          await aiService.deleteContentBulk(selectedItems);
          break;
      }

      // Refresh content list
      await loadContent();
      // Clear selection
      setSelectedItems([]);
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={selectedItems.length === content.length}
              onChange={handleSelectAll}
              className="rounded text-blue-600"
            />
            <span className="ml-2 text-sm text-gray-600">
              {selectedItems.length} selected
            </span>
          </label>

          {selectedItems.length > 0 && (
            <ContentBulkActions
              selectedCount={selectedItems.length}
              onAction={handleBulkAction}
            />
          )}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleSort('date')}
            className={`text-sm font-medium ${
              sortBy === 'date' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('quality')}
            className={`text-sm font-medium ${
              sortBy === 'quality' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            Quality {sortBy === 'quality' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('engagement')}
            className={`text-sm font-medium ${
              sortBy === 'engagement' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            Engagement {sortBy === 'engagement' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.map(item => (
          <ContentCard
            key={item.id}
            content={item}
            isSelected={selectedItems.includes(item.id)}
            onSelect={() => handleSelect(item.id)}
            onAction={handleBulkAction}
          />
        ))}
      </div>

      {/* Empty State */}
      {content.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No content found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your filters or create new content.
          </p>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
