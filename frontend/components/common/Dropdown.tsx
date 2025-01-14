import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface DropdownItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  width?: 'auto' | 'w-48' | 'w-56' | 'w-64';
}

export function Dropdown({ trigger, items, align = 'right', width = 'w-48' }: DropdownProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex items-center justify-center">
        {trigger}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={cn(
            'absolute z-50 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
            width,
            {
              'right-0': align === 'right',
              'left-0': align === 'left',
            }
          )}
        >
          <div className="py-1">
            {items.map((item, index) => (
              <Menu.Item key={index}>
                {({ active }) => {
                  const Component = item.href ? 'a' : 'button';
                  return (
                    <Component
                      href={item.href}
                      onClick={item.onClick}
                      className={cn(
                        'flex w-full items-center px-4 py-2 text-sm',
                        active ? 'bg-pink-50 text-pink-900' : 'text-gray-700'
                      )}
                    >
                      {item.icon && (
                        <item.icon
                          className={cn(
                            'mr-3 h-5 w-5',
                            active ? 'text-pink-500' : 'text-gray-400'
                          )}
                          aria-hidden="true"
                        />
                      )}
                      {item.label}
                    </Component>
                  );
                }}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
