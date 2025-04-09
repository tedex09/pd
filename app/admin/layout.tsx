import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Simple admin check using localStorage will be done on the client side
  // in each admin page component

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