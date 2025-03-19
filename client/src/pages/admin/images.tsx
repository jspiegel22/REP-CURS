import { ImageManager } from '@/components/admin/ImageManager';
import { AdminLayout } from '@/components/layouts/AdminLayout';

export default function AdminImagesPage() {
  return (
    <AdminLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Image Management</h1>
        <ImageManager />
      </div>
    </AdminLayout>
  );
} 