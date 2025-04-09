import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface UserHeaderProps {
  user: {
    name: string;
    points: number;
  };
}

export default function UserHeader({ user }: UserHeaderProps) {
  const clearAuth = useAuthStore((state) => state.clear);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = () => {
    clearAuth();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
    router.push('/login');
  };

  return (
    <motion.div 
      className="mb-8 text-center relative"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0"
        onClick={handleLogout}
      >
        <LogOut className="h-5 w-5" />
      </Button>

      <h1 className="text-2xl font-bold mb-2">
        Olá, {user.name || 'Visitante'}
      </h1>
      <div className="bg-card p-4 rounded-lg shadow-sm">
        <p className="text-lg">
          Você tem <span className="font-bold text-primary">{user.points}</span> pontos
        </p>
      </div>
    </motion.div>
  );
}