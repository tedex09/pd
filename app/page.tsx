'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

export default function Home() {
  const router = useRouter();
  const phone = useAuthStore((state) => state.phone);
  
  useEffect(() => {
    if (!phone) {
      router.push('/login');
    } else {
      router.push('/dashboard');
    }
  }, [phone, router]);
  
  return null;
}