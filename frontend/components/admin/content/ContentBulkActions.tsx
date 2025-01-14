import {
  DocumentMagnifyingGlassIcon,
  SparklesIcon,
  ArchiveBoxIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

interface ContentBulkActionsProps {
  selectedCount: number;
  onAction: (action: 'analyze' | 'optimize' | 'archive' | 'delete') => void;
}

export default function ContentBulkActions({
  selectedCount,
  onAction,
}: ContentBulkActionsProps) {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onAction('analyze')}
        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
      >
        <DocumentMagnifyingGlassIcon className="h-4 w-4 mr-1" />
        Analyze
      </button>
      
      <button
        onClick={() => onAction('optimize')}
        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
      >
        <SparklesIcon className="h-4 w-4 mr-1" />
        Optimize
      </button>
      
      <button
        onClick={() => onAction('archive')}
        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
      >
        <ArchiveBoxIcon className="h-4 w-4 mr-1" />
        Archive
      </button>
      
      <button
        onClick={() => onAction('delete')}
        className="inline-flex items-center px-3 py-1 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
      >
        <TrashIcon className="h-4 w-4 mr-1" />
        Delete
      </button>
    </div>
  );
}
