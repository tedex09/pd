'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { useAuthStore } from '@/store/auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const phone = useAuthStore((state) => state.phone);

  useEffect(() => {
    if (!phone) {
      router.push('/login');
    }
  }, [phone, router]);

  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-card border-r">
        <AdminSidebar />
      </div>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}