import { promises as fs } from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';

async function getDocContent() {
  const docsDir = path.join(process.cwd(), '../../docs');
  const filePath = path.join(docsDir, 'guides/AI-GETTING-STARTED.md');
  const fileContent = await fs.readFile(filePath, 'utf8');
  
  // Convert markdown to HTML
  const processedContent = await remark()
    .use(html)
    .process(fileContent);
    
  return processedContent.toString();
}

export default async function AIGettingStartedPage() {
  const content = await getDocContent();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Getting Started with AI Features</h1>
      
      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Additional Resources */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Additional Resources</h2>
        <ul className="space-y-2">
          <li>
            <a href="/documentation/ai/agents" className="text-blue-600 hover:underline">
              AI Agents Documentation
            </a>
          </li>
          <li>
            <a href="/documentation/ai/services" className="text-blue-600 hover:underline">
              AI Services Guide
            </a>
          </li>
          <li>
            <a href="/documentation/ai/implementation" className="text-blue-600 hover:underline">
              Implementation Details
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
