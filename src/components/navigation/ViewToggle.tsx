import { LayoutGrid, Users } from 'lucide-react';

interface ViewToggleProps {
  currentView: 'grid' | 'list';
  onChange: (view: 'grid' | 'list') => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
  currentView,
  onChange,
  className = ''
}) => {
  const handleKeyDown = (event: React.KeyboardEvent, nextView: 'grid' | 'list') => {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowLeft':
        const targetButton = event.currentTarget.nextElementSibling || 
                           event.currentTarget.previousElementSibling;
        if (targetButton instanceof HTMLElement) {
          targetButton.focus();
        }
        break;
      case 'Enter':
      case 'Space':
        onChange(nextView);
        break;
    }
  };

  return (
    <div 
      data-testid="view-toggle-container"
      className={`inline-flex rounded-lg border border-white/20 bg-white/10 backdrop-blur-lg p-1 shadow-lg ${className}`}
    >
      <button
        onClick={() => onChange('grid')}
        onKeyDown={(e) => handleKeyDown(e, 'grid')}
        aria-pressed={currentView === 'grid'}
        className={`relative inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors
          ${currentView === 'grid'
            ? 'text-white'
            : 'text-gray-500 hover:text-white'
          }`}
      >
        <span className="relative flex items-center gap-2">
          <LayoutGrid className="h-4 w-4" />
          <span>Discovery</span>
        </span>
      </button>
      <button
        onClick={() => onChange('list')}
        onKeyDown={(e) => handleKeyDown(e, 'list')}
        aria-pressed={currentView === 'list'}
        className={`relative inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors
          ${currentView === 'list'
            ? 'text-white'
            : 'text-gray-500 hover:text-white'
          }`}
      >
        <span className="relative flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>Directory</span>
        </span>
      </button>
    </div>
  );
};
