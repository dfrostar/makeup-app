import Link from 'next/link';
import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  YoutubeIcon,
  TikTokIcon,
} from '@/components/common/SocialIcons';

const navigation = {
  main: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Accessibility', href: '/accessibility' },
    { name: 'Partners', href: '/partners' },
  ],
  categories: [
    { name: 'Makeup', href: '/categories/makeup' },
    { name: 'Skincare', href: '/categories/skincare' },
    { name: 'Hair', href: '/categories/hair' },
    { name: 'Tools', href: '/categories/tools' },
    { name: 'Brands', href: '/brands' },
    { name: 'New Arrivals', href: '/new' },
  ],
  resources: [
    { name: 'Tutorials', href: '/tutorials' },
    { name: 'Looks', href: '/looks' },
    { name: 'Virtual Try-On', href: '/virtual-tryon' },
    { name: 'Ingredient Guide', href: '/ingredients' },
    { name: 'Beauty Quiz', href: '/quiz' },
    { name: 'Sustainability', href: '/sustainability' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Returns', href: '/returns' },
    { name: 'Shipping', href: '/shipping' },
    { name: 'Track Order', href: '/orders/track' },
    { name: 'Gift Cards', href: '/gift-cards' },
  ],
  social: [
    { name: 'Facebook', href: '#', icon: FacebookIcon },
    { name: 'Twitter', href: '#', icon: TwitterIcon },
    { name: 'Instagram', href: '#', icon: InstagramIcon },
    { name: 'YouTube', href: '#', icon: YoutubeIcon },
    { name: 'TikTok', href: '#', icon: TikTokIcon },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-white border-t" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-5 xl:gap-8">
          {/* Company Info */}
          <div className="space-y-8 xl:col-span-1">
            <Link href="/">
              <span className="text-2xl font-bold text-pink-600 font-playfair">MakeupHub</span>
            </Link>
            <p className="text-gray-500 text-sm">
              Your ultimate destination for beauty discovery, education, and shopping.
            </p>
            <div className="flex space-x-6">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-pink-500"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-4 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Categories
                </h3>
                <ul className="mt-4 space-y-4">
                  {navigation.categories.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-base text-gray-500 hover:text-pink-600"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Resources
                </h3>
                <ul className="mt-4 space-y-4">
                  {navigation.resources.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-base text-gray-500 hover:text-pink-600"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Support
                </h3>
                <ul className="mt-4 space-y-4">
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-base text-gray-500 hover:text-pink-600"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Company
                </h3>
                <ul className="mt-4 space-y-4">
                  {navigation.main.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-base text-gray-500 hover:text-pink-600"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="max-w-md">
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Subscribe to our newsletter
            </h3>
            <p className="mt-2 text-base text-gray-500">
              Get beauty tips, trends, and exclusive offers delivered to your inbox.
            </p>
            <form className="mt-4 sm:flex">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                type="email"
                name="email-address"
                id="email-address"
                autoComplete="email"
                required
                className="w-full min-w-0 px-4 py-2 text-base text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter your email"
              />
              <div className="mt-3 sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-base font-medium text-white bg-pink-600 border border-transparent rounded-md shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; {new Date().getFullYear()} MakeupHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
