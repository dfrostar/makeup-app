import { ReactNode } from 'react';

export default function DocumentationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-50 border-r">
        <nav className="p-4">
          <h2 className="text-lg font-semibold mb-4">Documentation</h2>
          
          {/* Getting Started */}
          <div className="mb-4">
            <h3 className="font-medium mb-2">Getting Started</h3>
            <ul className="space-y-2">
              <li>
                <a href="/documentation/getting-started/ai" className="text-blue-600 hover:underline">
                  AI Features
                </a>
              </li>
              <li>
                <a href="/documentation/getting-started/setup" className="text-blue-600 hover:underline">
                  Setup Guide
                </a>
              </li>
            </ul>
          </div>

          {/* AI Documentation */}
          <div className="mb-4">
            <h3 className="font-medium mb-2">AI Features</h3>
            <ul className="space-y-2">
              <li>
                <a href="/documentation/ai/agents" className="text-blue-600 hover:underline">
                  AI Agents
                </a>
              </li>
              <li>
                <a href="/documentation/ai/services" className="text-blue-600 hover:underline">
                  AI Services
                </a>
              </li>
              <li>
                <a href="/documentation/ai/implementation" className="text-blue-600 hover:underline">
                  Implementation
                </a>
              </li>
            </ul>
          </div>

          {/* API Documentation */}
          <div className="mb-4">
            <h3 className="font-medium mb-2">API Reference</h3>
            <ul className="space-y-2">
              <li>
                <a href="/documentation/api/overview" className="text-blue-600 hover:underline">
                  Overview
                </a>
              </li>
              <li>
                <a href="/documentation/api/endpoints" className="text-blue-600 hover:underline">
                  Endpoints
                </a>
              </li>
            </ul>
          </div>

          {/* Guides */}
          <div className="mb-4">
            <h3 className="font-medium mb-2">Guides</h3>
            <ul className="space-y-2">
              <li>
                <a href="/documentation/guides/content" className="text-blue-600 hover:underline">
                  Content Management
                </a>
              </li>
              <li>
                <a href="/documentation/guides/search" className="text-blue-600 hover:underline">
                  Search Integration
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
