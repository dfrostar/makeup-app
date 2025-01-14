import DashboardMetrics from '@/components/admin/DashboardMetrics';
import RecentActivity from '@/components/admin/RecentActivity';
import ContentStats from '@/components/admin/ContentStats';

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
      
      {/* Metrics Overview */}
      <DashboardMetrics />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <RecentActivity />
        
        {/* Content Statistics */}
        <ContentStats />
      </div>
    </div>
  );
}
