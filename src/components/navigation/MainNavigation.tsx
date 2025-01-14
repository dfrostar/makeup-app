import { useState } from 'react';
import Link from 'next/link';
import { SearchBar } from '../search/SearchBar';
import { UserMenu } from './UserMenu';
import { Camera } from 'lucide-react';

export const MainNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                MyLook
              </span>
              <span className="text-xs text-gray-500">by MakeupHub</span>
            </Link>
          </div>

          {/* Search */}
          <div className="flex flex-1 items-center justify-center px-8">
            <SearchBar />
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/looks"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Looks
            </Link>
            <Link 
              href="/products"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Products
            </Link>
            <Link 
              href="/professionals"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Professionals
            </Link>
            <Link 
              href="/try-on"
              className="flex items-center space-x-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Camera className="h-4 w-4" />
              <span>Try On</span>
            </Link>
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
};
