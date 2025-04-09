'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Instagram, Share2, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import Roleta from '@/components/Roleta';
import UserHeader from '@/components/UserHeader';
import ActionButton from '@/components/ActionButton';
import { useAuthStore } from '@/store/auth';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const { toast } = useToast();
  const phone = useAuthStore((state) => state.phone);

  useEffect(() => {
    if (!phone) {
      router.push('/login');
      return;
    }
    fetchUser();
  }, [router, phone]);

  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/users/${phone}`);
      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleAction = async (type: 'like' | 'share' | 'purchase') => {
    try {
      await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          type,
          value: type === 'purchase' ? 50 : 10,
        }),
      });
      fetchUser();

      toast({
        title: "Sucesso! 🎉",
        description: `Você ganhou ${type === 'purchase' ? 50 : 10} pontos!`,
      });
    } catch (error) {
      console.error('Error saving reward:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar sua recompensa.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <UserHeader user={user} />

      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Roleta onSpinComplete={fetchUser} />
        </motion.div>

        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-4">Ganhe mais pontos</h2>
          
          <ActionButton
            icon={<Instagram className="h-5 w-5" />}
            text="Seguir no Instagram"
            points={10}
            onClick={() => handleAction('like')}
          />

          <ActionButton
            icon={<Share2 className="h-5 w-5" />}
            text="Compartilhar com amigos"
            points={10}
            onClick={() => handleAction('share')}
          />

          <ActionButton
            icon={<ShoppingBag className="h-5 w-5" />}
            text="Registrar compra"
            points={50}
            onClick={() => handleAction('purchase')}
          />
        </motion.div>
      </div>
    </div>
  );
}