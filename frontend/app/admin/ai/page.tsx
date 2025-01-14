import AIContentManager from '@/components/admin/ai/AIContentManager';
import AIMetrics from '@/components/admin/ai/AIMetrics';
import AISettings from '@/components/admin/ai/AISettings';

export default function AIManagement() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold">AI Management</h1>

      {/* AI Performance Metrics */}
      <AIMetrics />

      {/* Content Management */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">AI Content Management</h2>
          <AIContentManager />
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">AI Settings</h2>
          <AISettings />
        </div>
      </div>
    </div>
  );
}
