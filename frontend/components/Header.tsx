import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  HeartIcon,
  ShoppingBagIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import SearchOverlay from './search/SearchOverlay';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Categories', href: '/categories' },
  { name: 'Trending', href: '/trending' },
  { name: 'Looks', href: '/looks' },
  { name: 'Virtual Try-On', href: '/virtual-tryon' },
  { name: 'Ingredients', href: '/ingredients' },
  { name: 'Quiz', href: '/quiz' },
  { name: 'Sustainability', href: '/sustainability' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed w-full z-40 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-transparent'
        }`}
      >
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-2xl font-bold text-pink-600 font-playfair"
              >
                MakeupHub
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex space-x-1">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      pathname === item.href
                        ? 'text-pink-600 bg-pink-50'
                        : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {/* Search */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-600 hover:text-pink-600 transition-colors duration-200 rounded-full hover:bg-pink-50"
              >
                <MagnifyingGlassIcon className="h-6 w-6" />
              </motion.button>

              {/* Favorites */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/favorites"
                  className="p-2 text-gray-600 hover:text-pink-600 transition-colors duration-200 rounded-full hover:bg-pink-50"
                >
                  <HeartIcon className="h-6 w-6" />
                </Link>
              </motion.div>

              {/* Shopping Bag */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/cart"
                  className="p-2 text-gray-600 hover:text-pink-600 transition-colors duration-200 rounded-full hover:bg-pink-50"
                >
                  <ShoppingBagIcon className="h-6 w-6" />
                </Link>
              </motion.div>

              {/* Profile */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/profile"
                  className="p-2 text-gray-600 hover:text-pink-600 transition-colors duration-200 rounded-full hover:bg-pink-50"
                >
                  <UserCircleIcon className="h-6 w-6" />
                </Link>
              </motion.div>

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-pink-600 transition-colors duration-200 rounded-full hover:bg-pink-50"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden mt-2"
              >
                <div className="rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="px-2 pt-2 pb-3 space-y-1">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                          pathname === item.href
                            ? 'bg-pink-50 text-pink-600'
                            : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </motion.header>

      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
