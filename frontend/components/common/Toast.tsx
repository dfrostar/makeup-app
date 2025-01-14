import { Fragment } from 'react';
import { Transition } from '@headlessui/react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  type?: ToastType;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const icons = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: ExclamationCircleIcon,
  info: InformationCircleIcon,
};

const styles = {
  success: 'bg-green-50 text-green-900',
  error: 'bg-red-50 text-red-900',
  warning: 'bg-yellow-50 text-yellow-900',
  info: 'bg-blue-50 text-blue-900',
};

const iconStyles = {
  success: 'text-green-400',
  error: 'text-red-400',
  warning: 'text-yellow-400',
  info: 'text-blue-400',
};

const positions = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
};

export function Toast({
  open,
  onClose,
  title,
  message,
  type = 'info',
  duration = 5000,
  position = 'top-right',
}: ToastProps) {
  const Icon = icons[type];

  // Auto-close after duration
  React.useEffect(() => {
    if (open && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);

  return (
    <div
      aria-live="assertive"
      className={cn('pointer-events-none fixed z-50 flex items-end px-4 py-6', positions[position])}
    >
      <Transition
        show={open}
        as={Fragment}
        enter="transform ease-out duration-300 transition"
        enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enterTo="translate-y-0 opacity-100 sm:translate-x-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
          <div className={cn('p-4', styles[type])}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Icon className={cn('h-6 w-6', iconStyles[type])} aria-hidden="true" />
              </div>
              <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium">{title}</p>
                {message && <p className="mt-1 text-sm opacity-90">{message}</p>}
              </div>
              <div className="ml-4 flex flex-shrink-0">
                <button
                  type="button"
                  className={cn(
                    'inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2',
                    'text-sm font-medium opacity-70 hover:opacity-100',
                    'focus:ring-offset-' + type + '-50 focus:ring-' + type + '-500'
                  )}
                  onClick={onClose}
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
}
