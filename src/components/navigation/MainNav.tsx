'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';

export function MainNav() {
  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-semibold text-pink-500">MyLook</span>
              <span className="text-xs text-gray-500 ml-1">by MakeupHub</span>
            </Link>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search for looks, products, or professionals..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link href="/looks" className="text-gray-600 hover:text-gray-900">
              Looks
            </Link>
            <Link href="/products" className="text-gray-600 hover:text-gray-900">
              Products
            </Link>
            <Link
              href="/professionals"
              className="text-gray-600 hover:text-gray-900"
            >
              Professionals
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
