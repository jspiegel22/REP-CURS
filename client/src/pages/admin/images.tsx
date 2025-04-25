import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import ImageManager from '@/components/admin/ImageManager';

export default function AdminImagesPage() {
  return (
    <AdminLayout>
      <ImageManager />
    </AdminLayout>
  );
}