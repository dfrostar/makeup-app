import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ChartBarIcon,
  CogIcon,
  SparklesIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Content', href: '/admin/content', icon: DocumentTextIcon },
  { name: 'Users', href: '/admin/users', icon: UserGroupIcon },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
  { name: 'AI Management', href: '/admin/ai', icon: SparklesIcon },
  { name: 'Social Media', href: '/admin/social', icon: ShareIcon },
  { name: 'Settings', href: '/admin/settings', icon: CogIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64">
        {/* Sidebar */}
        <div className="flex flex-col flex-grow bg-gray-800 pt-5 pb-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-4">
            <img
              className="h-8 w-auto"
              src="/logo.svg"
              alt="Beauty Directory"
            />
          </div>

          {/* Navigation */}
          <nav className="mt-5 flex-1 flex flex-col divide-y divide-gray-700 overflow-y-auto">
            <div className="px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md
                      ${isActive
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }
                    `}
                  >
                    <item.icon
                      className={`
                        mr-4 flex-shrink-0 h-6 w-6
                        ${isActive
                          ? 'text-white'
                          : 'text-gray-400 group-hover:text-gray-300'
                        }
                      `}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
