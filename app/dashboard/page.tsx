'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Instagram, Share2, ShoppingBag } from 'lucide-react';
import Roleta from '@/components/Roleta';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      router.push('/login');
      return;
    }
    fetchUser(userId);
  }, [router]);

  const fetchUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/users/${userId}`);
      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleAction = async (type: 'like' | 'share' | 'purchase') => {
    try {
      const userId = localStorage.getItem('userId');
      await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          type,
          value: type === 'purchase' ? 50 : 10,
        }),
      });
      fetchUser(userId!);
    } catch (error) {
      console.error('Error saving reward:', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Olá, {user.name || 'Visitante'}</h1>
        <p className="text-lg">Você tem <span className="font-bold">{user.points}</span> pontos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Roleta onSpinComplete={() => fetchUser(user._id)} />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Ganhe mais pontos</h2>
          
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={() => handleAction('like')}
          >
            <Instagram className="h-5 w-5" />
            Seguir no Instagram (+10 pts)
          </Button>

          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={() => handleAction('share')}
          >
            <Share2 className="h-5 w-5" />
            Compartilhar com amigos (+10 pts)
          </Button>

          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={() => handleAction('purchase')}
          >
            <ShoppingBag className="h-5 w-5" />
            Registrar compra (+50 pts)
          </Button>
        </div>
      </div>
    </div>
  );
}