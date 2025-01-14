import Link from 'next/link';

export default function DocumentationPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Beauty Directory Platform Documentation</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-8">
          Welcome to the Beauty Directory Platform documentation. Here you'll find comprehensive guides and documentation to help you start working with our platform as quickly as possible.
        </p>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link href="/documentation/getting-started/ai" className="block p-6 bg-white rounded-lg border hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Getting Started with AI</h2>
            <p className="text-gray-600">Learn how to use our AI features for content management and search.</p>
          </Link>

          <Link href="/documentation/api/overview" className="block p-6 bg-white rounded-lg border hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">API Documentation</h2>
            <p className="text-gray-600">Explore our API endpoints and integration guides.</p>
          </Link>

          <Link href="/documentation/guides/content" className="block p-6 bg-white rounded-lg border hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Content Management</h2>
            <p className="text-gray-600">Learn about content creation, curation, and optimization.</p>
          </Link>

          <Link href="/documentation/guides/search" className="block p-6 bg-white rounded-lg border hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Search Integration</h2>
            <p className="text-gray-600">Implement AI-powered search in your applications.</p>
          </Link>
        </div>

        {/* Featured Documentation */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Featured Documentation</h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded">
              <h3 className="font-semibold mb-2">AI Agents Documentation</h3>
              <p className="mb-2">Learn about our AI agent architecture and implementation.</p>
              <Link href="/documentation/ai/agents" className="text-blue-600 hover:underline">
                Read More →
              </Link>
            </div>

            <div className="p-4 bg-green-50 rounded">
              <h3 className="font-semibold mb-2">Content Quality Analysis</h3>
              <p className="mb-2">Understand how our AI analyzes and improves content quality.</p>
              <Link href="/documentation/ai/content-quality" className="text-blue-600 hover:underline">
                Read More →
              </Link>
            </div>

            <div className="p-4 bg-purple-50 rounded">
              <h3 className="font-semibold mb-2">Search Ranking System</h3>
              <p className="mb-2">Deep dive into our AI-powered search ranking algorithm.</p>
              <Link href="/documentation/ai/search" className="text-blue-600 hover:underline">
                Read More →
              </Link>
            </div>
          </div>
        </section>

        {/* Recent Updates */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Recent Updates</h2>
          <ul className="space-y-3">
            <li className="flex items-center gap-4">
              <span className="text-sm text-gray-500">2025-01-09</span>
              <span>Added comprehensive AI agents documentation</span>
            </li>
            <li className="flex items-center gap-4">
              <span className="text-sm text-gray-500">2025-01-09</span>
              <span>Updated search ranking documentation with new features</span>
            </li>
            <li className="flex items-center gap-4">
              <span className="text-sm text-gray-500">2025-01-09</span>
              <span>Added performance monitoring guide</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
