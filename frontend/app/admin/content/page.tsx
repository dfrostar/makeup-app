import { Suspense } from 'react';
import ContentList from '@/components/admin/content/ContentList';
import ContentFilters from '@/components/admin/content/ContentFilters';
import ContentActions from '@/components/admin/content/ContentActions';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function ContentManagement() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Content Management</h1>
        <ContentActions />
      </div>

      {/* Filters */}
      <ContentFilters />

      {/* Content List */}
      <Suspense fallback={<LoadingSpinner />}>
        <ContentList />
      </Suspense>
    </div>
  );
}
