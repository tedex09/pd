'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Gift, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/clients', label: 'Clientes', icon: Users },
  { href: '/admin/rewards', label: 'Recompensas', icon: Gift },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="h-full py-8 px-4">
      <div className="mb-8">
        <h2 className="text-lg font-semibold px-4">Admin Panel</h2>
      </div>
      <nav>
        <ul className="space-y-2">
          {menuItems.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                  pathname === href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}