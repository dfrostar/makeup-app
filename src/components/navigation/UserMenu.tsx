import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, Heart, Calendar, MessageSquare } from 'lucide-react';

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserMenu = ({ isOpen, onClose }: UserMenuProps) => {
  const menuItems = [
    { icon: User, label: 'Profile', href: '/profile' },
    { icon: Heart, label: 'Saved Looks', href: '/saved' },
    { icon: Calendar, label: 'Appointments', href: '/appointments' },
    { icon: MessageSquare, label: 'Messages', href: '/messages' },
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: LogOut, label: 'Sign Out', href: '/signout' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Menu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50"
          >
            <div className="p-2 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  <item.icon className="w-4 h-4 mr-3 text-gray-400" />
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
